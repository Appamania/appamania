-- 0002 RLS helpers and profile trigger (PRD v4 §12, §14). Forward-only; never edit once applied.
-- Status checks make offboarding cut access immediately, even with a still-valid JWT.
-- is_admin() requires MFA (aal2): a magic-link-only admin session gets no admin rows via the API either.

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active')
    and (auth.jwt() ->> 'aal') = 'aal2'
$$;

create function public.my_client_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select cm.client_id
  from public.client_members cm
  join public.profiles p on p.id = cm.profile_id
  join public.clients  c on c.id = cm.client_id
  where p.id = auth.uid() and p.status = 'active' and c.status = 'active'
$$;

-- ponytail: EXECUTE stays granted to anon. Revoking it segfaulted Postgres 17.6 on anon reads of owner
-- views that call these helpers (v3 lesson). Safe: helpers only return the caller's own data.

-- Invites are the only way in (sign-ups disabled), so every auth user gets a client profile.
-- The admin row is promoted once by SQL (docs/runbooks/first-admin.md).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;
