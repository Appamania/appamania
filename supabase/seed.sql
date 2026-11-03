-- Local/staging seed (PRD v4 §21). Never run against production.
-- Sign in with a magic link at /portal/login; read the email in Mailpit (http://127.0.0.1:54324).
--   admin@appamania.test   admin (enrols TOTP on first sign-in)
--   ana@clienta.test       Client A (Northwind Health)
--   ben@clientb.test       Client B (Pixel Forge)
-- Fixed UUIDs so e2e tests can address rows directly.

with u(id, email, name) as (values
  ('00000000-0000-0000-0000-00000000000a'::uuid, 'admin@appamania.test', 'Studio admin'),
  ('00000000-0000-0000-0000-0000000000a1'::uuid, 'ana@clienta.test', 'Ana Rao'),
  ('00000000-0000-0000-0000-0000000000b1'::uuid, 'ben@clientb.test', 'Ben Thomas'))
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
select '00000000-0000-0000-0000-000000000000', id, 'authenticated', 'authenticated', email, '', now(),
  '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', name), now(), now(), '', '', '', ''
from u;

insert into auth.identities (id, user_id, provider_id, provider, identity_data, created_at, updated_at, last_sign_in_at)
select gen_random_uuid(), id, id::text, 'email',
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true), now(), now(), now()
from auth.users where email like '%.test';

-- Profiles come from the handle_new_user trigger; promote the admin.
update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000a';

insert into public.clients (id, name, billing_email, phone, industry, state_code, country) values
  ('10000000-0000-0000-0000-00000000000a', 'Northwind Health', 'ana@clienta.test', '+919800000001', 'Health', '19', 'IN'),
  ('10000000-0000-0000-0000-00000000000b', 'Pixel Forge', 'ben@clientb.test', '+919800000002', 'Games', '27', 'IN');

insert into public.client_members (client_id, profile_id) values
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-0000000000a1'),
  ('10000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-0000000000b1');

insert into public.projects (id, client_id, title, offer, status, value_minor, start_date, due_date) values
  ('20000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a', 'Clinic app rescue sprint',
   'sprint', 'active', 2499900, current_date - 10, current_date + 14),
  ('20000000-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-00000000000b', 'Game app health audit',
   'audit', 'active', 299900, current_date - 1, current_date + 1);

insert into public.milestones (project_id, position, title, status, due_date) values
  ('20000000-0000-0000-0000-00000000000a', 1, 'Kickoff and access', 'done', current_date - 9),
  ('20000000-0000-0000-0000-00000000000a', 2, 'SDK upgrade', 'done', current_date - 2),
  ('20000000-0000-0000-0000-00000000000a', 3, 'Crash fixes', 'active', current_date + 4),
  ('20000000-0000-0000-0000-00000000000a', 4, 'CI/CD', 'todo', current_date + 9),
  ('20000000-0000-0000-0000-00000000000a', 5, 'Store release', 'todo', current_date + 14),
  ('20000000-0000-0000-0000-00000000000b', 1, 'Access received', 'done', current_date - 1),
  ('20000000-0000-0000-0000-00000000000b', 2, 'Review', 'active', current_date),
  ('20000000-0000-0000-0000-00000000000b', 3, 'Report delivered', 'todo', current_date + 1);

insert into public.updates (project_id, body, client_visible, needs_client_action, author_id) values
  ('20000000-0000-0000-0000-00000000000a', 'Flutter 3.41 to 3.47 done. Test build 1.10.0-rc1 is in Files.', true, false, '00000000-0000-0000-0000-00000000000a'),
  ('20000000-0000-0000-0000-00000000000a', 'Add me to App Store Connect as Developer so I can upload the release.', true, true, '00000000-0000-0000-0000-00000000000a'),
  ('20000000-0000-0000-0000-00000000000a', 'Internal: checkout crash traced to setState after dispose.', false, false, '00000000-0000-0000-0000-00000000000a');

insert into public.change_requests (project_id, created_by, title, details, priority, status, quote_minor, quote_days) values
  ('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-0000000000a1', 'Add dark mode',
   'Patients asked for it in reviews.', 'nice', 'quoted', 499900, 3);

insert into public.invoices (id, client_id, project_id, title, status, number, total_minor, issue_date, due_date, sent_at, bill_to) values
  ('30000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-00000000000a', '20000000-0000-0000-0000-00000000000a',
   'Rescue sprint — deposit (50%)', 'sent', 'INV/26-27/001', 1249950, current_date - 10, current_date + 5, now() - interval '10 days',
   '{"name":"Northwind Health","email":"ana@clienta.test","country":"IN"}');

insert into public.invoice_items (invoice_id, description, unit_price_minor) values
  ('30000000-0000-0000-0000-0000000000a1', 'Rescue and Migration Sprint — 50% deposit', 1249950);

insert into public.invoice_counters (fy, last_no) values ('26-27', 1);

insert into public.leads (name, email, company, industry, need, message, stage, created_at) values
  ('Riya Sen', 'riya@example.test', 'Shopline', 'E-commerce', 'audit', 'Our Flutter app crashes on Android 15 at checkout.', 'new', now() - interval '30 hours');
