-- Smoke: pgTAP runs, and no public table has RLS disabled (PRD v4 §22).
begin;
create extension if not exists pgtap with schema extensions;
select plan(1);

select is_empty(
  $$ select tablename from pg_tables where schemaname = 'public' and not rowsecurity $$,
  'every public table has RLS enabled'
);

select * from finish();
rollback;
