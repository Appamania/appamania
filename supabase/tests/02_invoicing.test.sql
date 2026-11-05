-- pgTAP: send_invoice numbering + sync_invoice_paid (PRD §13 / §16).
begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

create function pg_temp.act_as(uid uuid, aal text default 'aal2') returns void language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated', 'aal', aal)::text, true);
end $$;

insert into public.invoices (id, client_id, project_id, title, status)
values (
  '30000000-0000-0000-0000-0000000000d1',
  '10000000-0000-0000-0000-00000000000a',
  '20000000-0000-0000-0000-00000000000a',
  'Test draft',
  'draft'
);
insert into public.invoice_items (invoice_id, description, unit_price_minor)
values ('30000000-0000-0000-0000-0000000000d1', 'Line', 299900);

select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');

select is(
  public.send_invoice('30000000-0000-0000-0000-0000000000d1'),
  'INV/' || public.fy_label((now() at time zone 'Asia/Kolkata')::date) || '/002',
  'send_invoice returns next number after seed counter'
);

select results_eq(
  $$ select status, total_minor from public.invoices where id = '30000000-0000-0000-0000-0000000000d1' $$,
  $$ values ('sent'::public.invoice_status, 299900::bigint) $$,
  'send_invoice sets sent + total from items'
);

select throws_ok(
  $$ update public.invoices set total_minor = 1 where id = '30000000-0000-0000-0000-0000000000d1' $$,
  'P0001',
  'sent invoice is immutable; void and create a new one',
  'guard blocks mutating sent total'
);

select throws_ok(
  $$ insert into public.invoice_items (invoice_id, description, unit_price_minor)
     values ('30000000-0000-0000-0000-0000000000d1', 'Nope', 100) $$,
  'P0001',
  'items of a non-draft invoice are immutable',
  'guard_items blocks insert on sent invoice'
);

-- Reset role for trigger inserts as owner (payments often service-role in app).
select set_config('role', 'postgres', true);

insert into public.payments (kind, invoice_id, source, amount_minor, paid_at, razorpay_payment_id)
values (
  'invoice',
  '30000000-0000-0000-0000-0000000000a1',
  'razorpay',
  500000,
  now(),
  'pay_test_partial'
);

select results_eq(
  $$ select status, paid_minor from public.invoices where id = '30000000-0000-0000-0000-0000000000a1' $$,
  $$ values ('partially_paid'::public.invoice_status, 500000::bigint) $$,
  'partial payment → partially_paid'
);

insert into public.payments (kind, invoice_id, source, amount_minor, paid_at, razorpay_payment_id)
values (
  'invoice',
  '30000000-0000-0000-0000-0000000000a1',
  'razorpay',
  749950,
  now(),
  'pay_test_rest'
);

select results_eq(
  $$ select status, paid_minor from public.invoices where id = '30000000-0000-0000-0000-0000000000a1' $$,
  $$ values ('paid'::public.invoice_status, 1249950::bigint) $$,
  'full payment → paid'
);

select isnt(
  (select paid_at from public.invoices where id = '30000000-0000-0000-0000-0000000000a1'),
  null,
  'paid_at set when fully paid'
);

select is(
  public.fy_label('2026-11-05'::date),
  '26-27',
  'fy_label for Nov uses Apr–Mar FY'
);

select * from finish();
rollback;
