-- RLS isolation and client write rules (PRD v4 §14, E4.7). Release gate: a failure blocks deploy.
begin;
create extension if not exists pgtap with schema extensions;
select plan(86);

-- ---------- fixtures (as postgres, bypassing RLS); rolled back at the end ----------
truncate public.audit_log, public.payments, public.invoice_items, public.invoices, public.invoice_counters,
  public.files, public.change_requests, public.updates, public.milestones, public.projects, public.leads,
  public.client_members, public.client_notes, public.clients, public.profiles cascade;

-- handle_new_user creates client profiles; the test then sets roles and status.
insert into auth.users (id, email, raw_user_meta_data) values
  ('aaaaaaaa-0000-0000-0000-00000000000a', 'admin@test.local', '{"full_name":"Admin"}'),
  ('aaaaaaaa-0000-0000-0000-0000000000a1', 'a@test.local', '{"full_name":"Ana A"}'),
  ('aaaaaaaa-0000-0000-0000-0000000000b1', 'b@test.local', '{"full_name":"Ben B"}'),
  ('aaaaaaaa-0000-0000-0000-0000000000c1', 'c@test.local', '{}'),        -- member of offboarded client C
  ('aaaaaaaa-0000-0000-0000-0000000000a2', 'a-gone@test.local', '{}'),   -- offboarded profile on client A
  ('aaaaaaaa-0000-0000-0000-00000000000f', 'admin-gone@test.local', '{}'),
  ('aaaaaaaa-0000-0000-0000-0000000000d1', 'dual@test.local', '{}'),     -- member of active A and offboarded C
  ('aaaaaaaa-0000-0000-0000-0000000000e1', 'nomember@test.local', '{}'); -- profile, no membership

update public.profiles set role = 'admin' where id in ('aaaaaaaa-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-00000000000f');
update public.profiles set status = 'offboarded' where id in ('aaaaaaaa-0000-0000-0000-0000000000a2', 'aaaaaaaa-0000-0000-0000-00000000000f');

insert into public.clients (id, name, billing_email, industry, status) values
  ('f1000000-0000-0000-0000-00000000000a', 'Client A', 'a@test.local', 'Health', 'active'),
  ('f1000000-0000-0000-0000-00000000000b', 'Client B', 'b@test.local', 'Games',  'active'),
  ('f1000000-0000-0000-0000-00000000000c', 'Client C', 'c@test.local', 'Other',  'offboarded');

insert into public.client_members (client_id, profile_id) values
  ('f1000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1'),
  ('f1000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a2'),
  ('f1000000-0000-0000-0000-00000000000b', 'aaaaaaaa-0000-0000-0000-0000000000b1'),
  ('f1000000-0000-0000-0000-00000000000c', 'aaaaaaaa-0000-0000-0000-0000000000c1'),
  ('f1000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000d1'),
  ('f1000000-0000-0000-0000-00000000000c', 'aaaaaaaa-0000-0000-0000-0000000000d1');

insert into public.client_notes (client_id, notes) values ('f1000000-0000-0000-0000-00000000000a', 'Prefers WhatsApp');

insert into public.projects (id, client_id, title, offer, value_minor) values
  ('f2000000-0000-0000-0000-00000000000a', 'f1000000-0000-0000-0000-00000000000a', 'Project A', 'sprint', 2499900),
  ('f2000000-0000-0000-0000-00000000000b', 'f1000000-0000-0000-0000-00000000000b', 'Project B', 'audit', 299900),
  ('f2000000-0000-0000-0000-00000000000c', 'f1000000-0000-0000-0000-00000000000c', 'Project C', 'audit', 299900);

insert into public.milestones (project_id, position, title, status) values
  ('f2000000-0000-0000-0000-00000000000a', 1, 'M A1', 'done'),
  ('f2000000-0000-0000-0000-00000000000a', 2, 'M A2', 'active'),
  ('f2000000-0000-0000-0000-00000000000b', 1, 'M B1', 'todo');

insert into public.updates (project_id, body, client_visible) values
  ('f2000000-0000-0000-0000-00000000000a', 'A shared', true),
  ('f2000000-0000-0000-0000-00000000000a', 'A internal', false),
  ('f2000000-0000-0000-0000-00000000000b', 'B shared', true);

insert into public.change_requests (id, project_id, created_by, title, status, quote_minor) values
  ('f5000000-0000-0000-0000-0000000000a1', 'f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'Dark mode', 'quoted', 499900),
  ('f5000000-0000-0000-0000-0000000000a2', 'f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'Open item', 'open', null),
  ('f5000000-0000-0000-0000-0000000000b1', 'f2000000-0000-0000-0000-00000000000b', 'aaaaaaaa-0000-0000-0000-0000000000b1', 'B request', 'quoted', 99900);

insert into public.files (project_id, uploaded_by, kind, storage_path, file_name, size_bytes, expires_at) values
  ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-00000000000a', 'report', 'f2000000-0000-0000-0000-00000000000a/report/r.pdf', 'r.pdf', 10, null),
  ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-00000000000a', 'build', 'f2000000-0000-0000-0000-00000000000a/build/old.apk', 'old.apk', 10, now() - interval '1 day'),
  ('f2000000-0000-0000-0000-00000000000b', 'aaaaaaaa-0000-0000-0000-00000000000a', 'report', 'f2000000-0000-0000-0000-00000000000b/report/b.pdf', 'b.pdf', 10, null);

insert into storage.objects (bucket_id, name) values
  ('project-files', 'f2000000-0000-0000-0000-00000000000a/report/r.pdf'),
  ('project-files', 'f2000000-0000-0000-0000-00000000000a/build/old.apk'),     -- files row expired
  ('project-files', 'f2000000-0000-0000-0000-00000000000a/invoice/staged.pdf'), -- no files row yet
  ('project-files', 'f2000000-0000-0000-0000-00000000000b/report/b.pdf');

insert into public.invoices (id, client_id, project_id, title, status, number, total_minor) values
  ('f3000000-0000-0000-0000-0000000000a1', 'f1000000-0000-0000-0000-00000000000a', 'f2000000-0000-0000-0000-00000000000a', 'Deposit', 'sent', 'INV/26-27/001', 1249950),
  ('f3000000-0000-0000-0000-0000000000a2', 'f1000000-0000-0000-0000-00000000000a', 'f2000000-0000-0000-0000-00000000000a', 'Draft', 'draft', null, 0),
  ('f3000000-0000-0000-0000-0000000000b1', 'f1000000-0000-0000-0000-00000000000b', 'f2000000-0000-0000-0000-00000000000b', 'Audit', 'sent', 'INV/26-27/002', 299900);

insert into public.invoice_items (invoice_id, description, unit_price_minor) values
  ('f3000000-0000-0000-0000-0000000000a1', 'Sprint deposit', 1249950),
  ('f3000000-0000-0000-0000-0000000000a2', 'Draft line', 100),
  ('f3000000-0000-0000-0000-0000000000b1', 'Audit', 299900);

insert into public.leads (id, name, email, industry, need, stage) values
  ('f6000000-0000-0000-0000-000000000001', 'Lead', 'lead@test.local', 'Health', 'audit', 'won');

insert into public.payments (invoice_id, lead_id, kind, source, amount_minor, fee_minor, razorpay_payment_id, paid_at, raw) values
  ('f3000000-0000-0000-0000-0000000000a1', null, 'invoice', 'razorpay', 1249950, 2500, 'pay_a1', now(), '{"secret":"x"}'),
  ('f3000000-0000-0000-0000-0000000000b1', null, 'invoice', 'razorpay', 299900, 600, 'pay_b1', now(), '{}'),
  (null, 'f6000000-0000-0000-0000-000000000001', 'audit_page', 'razorpay', 299900, 600, 'pay_page', now(), '{}');

insert into public.audit_log (action, entity) values ('test', 'none');
insert into public.invoice_counters (fy, last_no) values ('26-27', 2);

-- ---------- structure ----------
select is_empty(
  $$select proname from pg_proc where proname in ('is_admin', 'my_client_ids', 'decide_change_request', 'handle_new_user', 'uploaded_by_me')
    and pronamespace = 'public'::regnamespace and not (prosecdef and proconfig @> array['search_path=""'])$$,
  'security definer functions pin an empty search_path');
select is_empty(
  $$select c.relname from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'v')
    and (has_table_privilege('anon', c.oid, 'TRUNCATE') or has_table_privilege('authenticated', c.oid, 'TRUNCATE')
      or has_table_privilege('authenticated', c.oid, 'TRIGGER'))$$,
  'API roles cannot truncate (bypasses RLS) or add triggers');
select is((select role::text from public.profiles where id = 'aaaaaaaa-0000-0000-0000-0000000000e1'), 'client',
  'new auth users get a client profile');
select throws_ok($$insert into public.payments (kind, source, amount_minor, paid_at) values ('invoice', 'razorpay', 1, now())$$,
  '23514', null, 'invoice payment needs an invoice');
select throws_ok($$insert into public.payments (invoice_id, source, amount_minor, paid_at)
  values ('f3000000-0000-0000-0000-0000000000a1', 'upi', 1, now())$$,
  '23514', null, 'manual payment needs a reference');

create function pg_temp.act_as(uid uuid, aal text default 'aal2') returns void language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated', 'aal', aal)::text, true);
end $$;

-- ---------- client A: reads ----------
select pg_temp.act_as('aaaaaaaa-0000-0000-0000-0000000000a1');
select results_eq('select title from public.projects', $$values ('Project A')$$, 'A sees only own project');
select results_eq('select name from public.clients', $$values ('Client A')$$, 'A sees only own client');
select results_eq('select title from public.milestones order by position', $$values ('M A1'), ('M A2')$$, 'A sees own milestones');
select results_eq('select body from public.updates', $$values ('A shared')$$, 'A sees shared updates only');
select results_eq('select title from public.change_requests order by title', $$values ('Dark mode'), ('Open item')$$, 'A sees own change requests');
select results_eq('select file_name from public.files', $$values ('r.pdf')$$, 'A sees own unexpired files');
select results_eq('select number from public.invoices', $$values ('INV/26-27/001')$$, 'A sees sent invoice, not draft or B');
select results_eq('select description from public.invoice_items', $$values ('Sprint deposit')$$, 'A sees items of own sent invoice');
select results_eq('select amount_minor from public.client_payments', $$values (1249950::bigint)$$, 'A sees own payment via view');
select is_empty('select 1 from public.payments', 'A cannot read payments base table (fees, raw)');
select results_eq('select full_name from public.profiles', $$values ('Ana A')$$, 'A sees own profile only');
select results_eq('select client_id from public.client_members', $$values ('f1000000-0000-0000-0000-00000000000a'::uuid)$$, 'A sees own membership only');
select is_empty('select 1 from public.leads', 'A cannot read leads');
select is_empty('select 1 from public.audit_log', 'A cannot read audit log');
select is_empty('select 1 from public.invoice_counters', 'A cannot read counters');
select is_empty('select 1 from public.client_notes', 'A cannot read admin notes');
select results_eq('select progress from public.project_progress', $$values (50)$$, 'A sees own progress (1 of 2 done)');
select results_eq('select name from storage.objects where bucket_id = ''project-files''',
  $$values ('f2000000-0000-0000-0000-00000000000a/report/r.pdf')$$, 'A sees own storage objects only');
select lives_ok(
  $$select * from public.project_progress where 1 / (case when project_id = 'f2000000-0000-0000-0000-00000000000b' then 0 else 1 end) = 1$$,
  'progress view filters before caller predicates (no error oracle)');

-- ---------- client A: allowed writes ----------
select lives_ok($$insert into public.change_requests (project_id, created_by, title, priority, created_at)
  values ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'New screen', 'nice', '2020-01-01')$$,
  'A can open a change request on own project');
select is((select created_at::date from public.change_requests where title = 'New screen'), current_date, 'client cannot backdate a request');
select lives_ok($$insert into storage.objects (bucket_id, name, owner_id)
  values ('project-files', 'f2000000-0000-0000-0000-00000000000a/client_upload/0f0f0f0f-0000-0000-0000-000000000001-brand.zip', 'aaaaaaaa-0000-0000-0000-0000000000a1')$$,
  'A can upload into own client_upload folder');
select lives_ok($$insert into public.files (project_id, uploaded_by, kind, storage_path, file_name, size_bytes, created_at)
  values ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'client_upload',
          'f2000000-0000-0000-0000-00000000000a/client_upload/0f0f0f0f-0000-0000-0000-000000000001-brand.zip', 'brand.zip', 100, '2020-01-01')$$,
  'A can register own uploaded object');
select is((select created_at::date from public.files where file_name = 'brand.zip'), current_date, 'client cannot backdate a file row');
select lives_ok($$select public.decide_change_request('f5000000-0000-0000-0000-0000000000a1', true)$$,
  'A can approve own quoted request');

-- ---------- client A: forbidden writes ----------
select throws_ok($$insert into public.change_requests (project_id, created_by, title)
  values ('f2000000-0000-0000-0000-00000000000b', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'Sneaky')$$,
  '42501', null, 'A cannot open a request on B project');
select throws_ok($$insert into public.change_requests (project_id, created_by, title, status, quote_minor)
  values ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'Self quote', 'approved', 1)$$,
  '42501', null, 'A cannot insert a pre-approved or quoted request');
select throws_ok($$insert into public.change_requests (project_id, created_by, title)
  values ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000b1', 'Impersonate')$$,
  '42501', null, 'A cannot create a request as someone else');
select throws_ok($$insert into public.files (project_id, uploaded_by, kind, storage_path, file_name, size_bytes)
  values ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'build',
          'f2000000-0000-0000-0000-00000000000a/build/x.apk', 'x.apk', 1)$$,
  '42501', null, 'A cannot add a build or report');
select throws_ok($$insert into public.files (project_id, uploaded_by, kind, storage_path, file_name, size_bytes)
  values ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'client_upload',
          'f2000000-0000-0000-0000-00000000000b/client_upload/x.zip', 'x.zip', 1)$$,
  '42501', null, 'A cannot point a file row at another project path');
select throws_ok($$insert into storage.objects (bucket_id, name, owner_id)
  values ('project-files', 'f2000000-0000-0000-0000-00000000000b/client_upload/0f0f0f0f-0000-0000-0000-000000000001-x.zip', 'aaaaaaaa-0000-0000-0000-0000000000a1')$$,
  '42501', null, 'A cannot upload into B folder');
select throws_ok($$insert into storage.objects (bucket_id, name, owner_id)
  values ('project-files', 'f2000000-0000-0000-0000-00000000000a/client_upload/../../f2000000-0000-0000-0000-00000000000b/report/b2.pdf', 'aaaaaaaa-0000-0000-0000-0000000000a1')$$,
  '42501', null, 'A cannot upload with a .. path');
select throws_ok($$insert into public.files (project_id, uploaded_by, kind, storage_path, file_name, size_bytes)
  values ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'client_upload',
          'f2000000-0000-0000-0000-00000000000a/client_upload/../../f2000000-0000-0000-0000-00000000000b/report/b.pdf', 'b.pdf', 1)$$,
  '42501', null, 'A cannot register a .. path');
select throws_ok($$insert into public.files (project_id, uploaded_by, kind, storage_path, file_name, size_bytes)
  values ('f2000000-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-0000000000a1', 'client_upload',
          'f2000000-0000-0000-0000-00000000000a/client_upload/0f0f0f0f-0000-0000-0000-000000000002-ghost.zip', 'ghost.zip', 1)$$,
  '42501', null, 'A cannot register a file row with no uploaded object');
select throws_ok($$insert into storage.objects (bucket_id, name, owner_id)
  values ('project-files', 'f2000000-0000-0000-0000-00000000000a/report/fake.pdf', 'aaaaaaaa-0000-0000-0000-0000000000a1')$$,
  '42501', null, 'A cannot upload outside client_upload');
select throws_ok($$select public.decide_change_request('f5000000-0000-0000-0000-0000000000b1', true)$$,
  'P0002', null, 'A cannot decide B request');
select throws_ok($$select public.decide_change_request('f5000000-0000-0000-0000-0000000000a2', true)$$,
  'P0002', null, 'A cannot approve a request that has no quote');
select throws_ok($$insert into public.projects (client_id, title, offer, value_minor)
  values ('f1000000-0000-0000-0000-00000000000a', 'x', 'audit', 1)$$, '42501', null, 'A cannot insert projects');
select throws_ok($$insert into public.updates (project_id, body) values ('f2000000-0000-0000-0000-00000000000a', 'x')$$,
  '42501', null, 'A cannot post updates');
select throws_ok($$insert into public.client_members values ('f1000000-0000-0000-0000-00000000000b', 'aaaaaaaa-0000-0000-0000-0000000000a1')$$,
  '42501', null, 'A cannot join another client');
select throws_ok($$insert into public.invoices (client_id, title) values ('f1000000-0000-0000-0000-00000000000a', 'x')$$,
  '42501', null, 'A cannot create invoices');
select throws_ok($$insert into public.payments (invoice_id, source, amount_minor, razorpay_payment_id, paid_at)
  values ('f3000000-0000-0000-0000-0000000000a1', 'razorpay', 1, 'pay_fake', now())$$,
  '42501', null, 'A cannot record payments');
select throws_ok($$insert into public.leads (name, email, industry) values ('x', 'x@x.x', 'Other')$$,
  '42501', null, 'A cannot insert leads');
-- Silently filtered by RLS (checked as admin below).
update public.projects set title = 'hacked';
update public.change_requests set status = 'approved', quote_minor = 1 where id = 'f5000000-0000-0000-0000-0000000000a2';
update public.invoices set total_minor = 1;
update public.profiles set role = 'admin';
delete from public.change_requests;
delete from public.files;

-- ---------- client B ----------
select pg_temp.act_as('aaaaaaaa-0000-0000-0000-0000000000b1');
select results_eq('select title from public.projects', $$values ('Project B')$$, 'B sees only own project');
select results_eq('select number from public.invoices', $$values ('INV/26-27/002')$$, 'B sees only own invoice');
select results_eq('select title from public.change_requests', $$values ('B request')$$, 'B sees only own requests');
select results_eq('select amount_minor from public.client_payments', $$values (299900::bigint)$$, 'B sees only own payment');

-- ---------- offboarded and edge identities ----------
select pg_temp.act_as('aaaaaaaa-0000-0000-0000-0000000000c1');
select is_empty('select 1 from public.projects', 'member of offboarded client reads no projects');
select is_empty('select 1 from public.files', 'member of offboarded client reads no files');
select is_empty('select 1 from public.project_progress', 'member of offboarded client reads no progress');
select throws_ok($$insert into public.change_requests (project_id, created_by, title)
  values ('f2000000-0000-0000-0000-00000000000c', 'aaaaaaaa-0000-0000-0000-0000000000c1', 'After offboard')$$,
  '42501', null, 'offboarded client cannot open requests');

select pg_temp.act_as('aaaaaaaa-0000-0000-0000-0000000000a2');
select is_empty('select 1 from public.projects', 'offboarded profile reads no projects');
select is_empty('select 1 from public.client_payments', 'offboarded profile reads no payments');

select pg_temp.act_as('aaaaaaaa-0000-0000-0000-00000000000f');
select is_empty('select 1 from public.leads', 'offboarded admin is not admin');

select pg_temp.act_as('aaaaaaaa-0000-0000-0000-0000000000d1');
select results_eq('select title from public.projects', $$values ('Project A')$$, 'member of active and offboarded client sees active only');

select pg_temp.act_as('aaaaaaaa-0000-0000-0000-0000000000e1');
select is_empty('select 1 from public.projects', 'profile without membership reads nothing');

-- ---------- anon ----------
select set_config('role', 'anon', true);
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is_empty('select 1 from public.projects', 'anon reads no projects');
select is_empty('select 1 from public.profiles', 'anon reads no profiles');
select throws_ok('select 1 from public.project_progress', '42501', null, 'anon cannot read progress view');
select is_empty($$select 1 from storage.objects where bucket_id = 'project-files'$$, 'anon reads no storage objects');

-- ---------- admin without MFA (aal1): no admin powers via the API ----------
select pg_temp.act_as('aaaaaaaa-0000-0000-0000-00000000000a', 'aal1');
select is_empty('select 1 from public.leads', 'aal1 admin cannot read leads');
select is_empty('select 1 from public.payments', 'aal1 admin cannot read payments');
select throws_ok($$insert into public.leads (name, email, industry) values ('x', 'x@x.x', 'Other')$$,
  '42501', null, 'aal1 admin cannot write');
select results_eq('select full_name from public.profiles', $$values ('Admin')$$, 'aal1 admin still reads own profile (MFA step)');

-- ---------- admin ----------
select pg_temp.act_as('aaaaaaaa-0000-0000-0000-00000000000a');
select is((select count(*)::int from public.projects), 3, 'admin reads all projects');
select is((select count(*)::int from public.invoices), 3, 'admin reads drafts too');
select is((select count(*)::int from public.updates), 3, 'admin reads hidden updates');
select is((select count(*)::int from public.payments), 3, 'admin reads all payments incl. audit page');
select is((select count(*)::int from public.files), 4, 'admin reads expired builds and client uploads');
select is((select notes from public.client_notes), 'Prefers WhatsApp', 'admin reads client notes');

-- Earlier client writes: allowed ones landed, forbidden ones had no effect.
select results_eq($$select status::text, decided_at is not null from public.change_requests where id = 'f5000000-0000-0000-0000-0000000000a1'$$,
  $$values ('approved', true)$$, 'client decision recorded');
select results_eq($$select status::text, quote_minor from public.change_requests where id = 'f5000000-0000-0000-0000-0000000000a2'$$,
  $$values ('open', null::bigint)$$, 'client update of a request had no effect');
select is((select count(*)::int from public.change_requests), 4, 'client deletes had no effect; new request kept');
select is((select count(*)::int from public.projects where title = 'hacked'), 0, 'client update of project had no effect');
select is((select role::text from public.profiles where id = 'aaaaaaaa-0000-0000-0000-0000000000a1'), 'client', 'client self-promotion had no effect');
select is((select total_minor from public.invoices where id = 'f3000000-0000-0000-0000-0000000000a1'), 1249950::bigint, 'client update of invoice total had no effect');
select is((select count(*)::int from public.audit_log where action = 'change_request.decide'), 1, 'client decision is audit-logged');

-- Finance and audit rows are never hard-deleted, even by admin.
delete from public.payments;
delete from public.invoices where status <> 'draft';
delete from public.audit_log;
update public.audit_log set action = 'tampered';
select is((select count(*)::int from public.payments), 3, 'admin cannot delete payments');
select is((select count(*)::int from public.invoices where status <> 'draft'), 2, 'admin cannot delete sent invoices');
select is((select count(*)::int from public.audit_log where action = 'tampered'), 0, 'admin cannot edit audit log');
select lives_ok($$delete from public.invoices where id = 'f3000000-0000-0000-0000-0000000000a2'$$, 'admin can delete a draft');

select * from finish();
rollback;
