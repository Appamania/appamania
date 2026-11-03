-- 0003 RLS policies, client views and storage (PRD v4 §13–§14). Forward-only; never edit once applied.
-- Policies are `to authenticated`; anon gets nothing. API roles lose TRUNCATE/TRIGGER/REFERENCES
-- (TRUNCATE ignores RLS). Service role (webhook, admin server actions) bypasses RLS by design.

do $$ declare t text; begin
  foreach t in array array['profiles','clients','client_notes','client_members','leads','projects',
    'milestones','updates','change_requests','files','invoice_counters','invoices','invoice_items',
    'payments','audit_log']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy admin_all on public.%I for all to authenticated
      using ((select public.is_admin())) with check ((select public.is_admin()))', t);
  end loop;
end $$;

-- ---------- client reads ----------
create policy own_profile on profiles for select to authenticated
  using (id = (select auth.uid()));

create policy client_read on clients for select to authenticated
  using (id in (select public.my_client_ids()));

create policy own_membership on client_members for select to authenticated
  using (profile_id = (select auth.uid()) and client_id in (select public.my_client_ids()));

create policy client_read on projects for select to authenticated
  using (client_id in (select public.my_client_ids()));

create policy client_read on milestones for select to authenticated
  using (project_id in (select id from public.projects));          -- inherits projects RLS

create policy client_read on updates for select to authenticated
  using (client_visible and project_id in (select id from public.projects));

create policy client_read on change_requests for select to authenticated
  using (project_id in (select id from public.projects));

create policy client_read on files for select to authenticated
  using (project_id in (select id from public.projects) and (expires_at is null or expires_at > now()));

create policy client_read on invoices for select to authenticated
  using (status <> 'draft' and client_id in (select public.my_client_ids()));

create policy client_read on invoice_items for select to authenticated
  using (invoice_id in (select id from public.invoices));          -- inherits invoices RLS

-- payments: no client policy on the base table (fee and raw payload stay admin-only); see client_payments.
-- client_notes, leads, audit_log, invoice_counters: no client policy = no access.

-- ---------- client writes (PRD §14) ----------
create policy client_insert on change_requests for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and status = 'open' and quote_minor is null and quote_days is null and decided_at is null
    and project_id in (select id from public.projects));

-- Definer function: reading storage.objects under its own RLS would recurse back into files (pf_read).
create function public.uploaded_by_me(p_path text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from storage.objects o
                 where o.bucket_id = 'project-files' and o.name = p_path and o.owner_id = auth.uid()::text)
$$;
revoke execute on function public.uploaded_by_me(text) from public, anon;

-- A client file row must point at an object the same user already uploaded, at
-- {project_id}/client_upload/{uuid}-{name}: no `..`, no deeper folders, no rows for missing objects.
create policy client_insert on files for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and kind = 'client_upload' and expires_at is null
    and storage_path ~ ('^' || project_id::text || '/client_upload/[0-9a-f-]{36}-[^/]+$')
    and project_id in (select id from public.projects)
    and public.uploaded_by_me(storage_path));

-- Clients cannot backdate rows they create; admin can't either (one rule, no branches).
create function public.stamp_created_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.created_at := now();
  return new;
end $$;
create trigger stamp_created_at before insert on change_requests for each row execute function public.stamp_created_at();
create trigger stamp_created_at before insert on files for each row execute function public.stamp_created_at();

-- Approve or decline a quote: the only client update, through a function (no update policy).
create function public.decide_change_request(p_id uuid, p_approve boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.change_requests cr
     set status = case when p_approve then 'approved'::public.cr_status else 'declined'::public.cr_status end,
         decided_at = now()
   where cr.id = p_id and cr.status = 'quoted'
     and cr.project_id in (select p.id from public.projects p where p.client_id in (select public.my_client_ids()));
  if not found then raise exception 'change request not found or not awaiting a decision' using errcode = 'P0002'; end if;
  insert into public.audit_log (actor, action, entity, entity_id, diff)
  values (auth.uid(), 'change_request.decide', 'change_requests', p_id, jsonb_build_object('approved', p_approve));
end $$;
revoke execute on function public.decide_change_request(uuid, boolean) from public, anon;

-- ---------- views (owner privileges, explicit filter, security barrier) ----------
-- Progress: done milestones / total, unless overridden (PRD §13).
create view public.project_progress with (security_barrier) as
select p.id as project_id,
  coalesce(p.progress_override,
           round(100.0 * count(m.id) filter (where m.status = 'done') / nullif(count(m.id), 0))::int,
           0) as progress
from public.projects p
left join public.milestones m on m.project_id = p.id
where public.is_admin() or p.client_id in (select public.my_client_ids())
group by p.id, p.progress_override;

-- Client-safe payments: no gateway fee, tax on fee, raw payload or lead link.
create view public.client_payments with (security_barrier) as
select pm.id, pm.invoice_id, pm.source, pm.amount_minor, pm.currency, pm.method, pm.reference, pm.paid_at
from public.payments pm
join public.invoices i on i.id = pm.invoice_id
where public.is_admin() or (i.status <> 'draft' and i.client_id in (select public.my_client_ids()));

revoke insert, update, delete, truncate on public.project_progress, public.client_payments from anon, authenticated;
revoke select on public.project_progress, public.client_payments from anon;

-- ---------- never hard-delete finance or audit rows, not even as admin ----------
create policy no_delete on payments         as restrictive for delete to authenticated using (false);
create policy no_delete on audit_log        as restrictive for delete to authenticated using (false);
create policy no_update on audit_log        as restrictive for update to authenticated using (false);
create policy no_delete on invoice_counters as restrictive for delete to authenticated using (false);
create policy draft_only_delete on invoices as restrictive for delete to authenticated using (status = 'draft');

revoke truncate, trigger, references on all tables in schema public from anon, authenticated;
alter default privileges for role postgres in schema public revoke truncate, trigger, references on tables from anon, authenticated;

-- ---------- storage: private bucket project-files, path {project_id}/{kind}/{file} (PRD §14) ----------
-- ponytail: aab/ipa have no registered MIME type, so octet-stream is allowed; the upload action
-- also checks the extension allow-list.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-files', 'project-files', false, 52428800, array[
  'application/vnd.android.package-archive', 'application/octet-stream', 'application/pdf', 'application/zip',
  'image/png', 'image/jpeg', 'image/webp', 'text/plain', 'text/markdown', 'text/csv'])
on conflict (id) do nothing;

-- Clients read only objects that have a visible files row (inherits the files policy, incl. expiry),
-- so expired builds and objects staged before their row exists stay private.
create policy pf_read on storage.objects for select to authenticated using (
  bucket_id = 'project-files' and (public.is_admin() or name in (select storage_path from public.files)));

create policy pf_client_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'project-files'
  and name ~ '^[0-9a-f-]{36}/client_upload/[0-9a-f-]{36}-[^/]+$'
  and (storage.foldername(name))[1] in
    (select id::text from public.projects where client_id in (select public.my_client_ids())));

create policy pf_admin on storage.objects for all to authenticated
  using (bucket_id = 'project-files' and public.is_admin())
  with check (bucket_id = 'project-files' and public.is_admin());
