-- 0001 core schema (PRD v4 §13). Forward-only; never edit once applied.
-- Finance and project rows are never hard-deleted (on delete restrict).

create type user_role        as enum ('admin','client');
create type account_status   as enum ('active','offboarded');
create type lead_stage       as enum ('new','contacted','call_booked','proposal_sent','won','lost','declined_auto');
create type offer_id         as enum ('audit','sprint','retainer','mvp','website','custom');
create type project_status   as enum ('booked','active','on_hold','done','cancelled');
create type milestone_status as enum ('todo','active','done');
create type invoice_status   as enum ('draft','sent','partially_paid','paid','void');
create type supply_type      as enum ('non_gst','intra_state','inter_state','export_lut','export_igst');
create type cr_status        as enum ('open','quoted','approved','declined','done');
create type cr_priority      as enum ('nice','sprint','urgent');
create type file_kind        as enum ('build','report','proposal','invoice','client_upload','other');
create type payment_source   as enum ('razorpay','bank_transfer','upi','wise','other');
create type payment_kind     as enum ('invoice','audit_page');

create table profiles (
  id         uuid primary key references auth.users on delete restrict,
  role       user_role not null default 'client',
  full_name  text,
  status     account_status not null default 'active',
  created_at timestamptz not null default now()
);

create table clients (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  legal_name    text,
  billing_email text not null,
  phone         text,                       -- Razorpay customer contact
  country       char(2) not null default 'IN',
  state_code    char(2),                    -- for GST later
  gstin         text,
  address       text,
  industry      text not null,
  status        account_status not null default 'active',
  created_at    timestamptz not null default now(),
  offboarded_at timestamptz
);

create table client_notes (                 -- admin-only
  client_id  uuid primary key references clients on delete restrict,
  notes      text not null default '',
  updated_at timestamptz not null default now()
);

create table client_members (
  client_id  uuid references clients on delete restrict,
  profile_id uuid references profiles on delete restrict,
  primary key (client_id, profile_id)
);

create table leads (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  email               text not null,
  company             text,
  industry            text not null,
  need                offer_id,
  repo_url            text,
  message             text,
  source              text not null default 'site',   -- site | audit_page | linkedin | warm
  stage               lead_stage not null default 'new',
  conflict_flag       boolean not null default false,
  override_reason     text,
  value_minor         bigint,
  ip_hash             text,                            -- sha256(ip + LEAD_SALT)
  razorpay_payment_id text unique,                     -- audit_page idempotency
  first_reply_at      timestamptz,
  next_action_at      date,
  client_id           uuid references clients on delete restrict,
  created_at          timestamptz not null default now()
);

create table projects (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references clients on delete restrict,
  title             text not null,
  offer             offer_id not null,
  status            project_status not null default 'booked',
  value_minor       bigint not null check (value_minor >= 0),
  start_date        date,
  due_date          date,
  hours_budget      int,
  progress_override smallint check (progress_override between 0 and 100),
  created_at        timestamptz not null default now()
);

create table milestones (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects on delete restrict,
  position    int not null,
  title       text not null,
  description text,
  status      milestone_status not null default 'todo',
  due_date    date,
  done_at     timestamptz,
  unique (project_id, position) deferrable initially deferred
);

create table updates (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references projects on delete restrict,
  author_id           uuid references profiles,
  milestone_id        uuid references milestones on delete set null,
  body                text not null,
  client_visible      boolean not null default true,
  needs_client_action boolean not null default false,
  created_at          timestamptz not null default now()
);

create table change_requests (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects on delete restrict,
  created_by  uuid not null references profiles,
  title       text not null check (length(title) between 3 and 140),
  details     text check (length(details) <= 4000),
  priority    cr_priority not null default 'sprint',
  status      cr_status not null default 'open',
  quote_minor bigint check (quote_minor > 0),
  quote_days  int check (quote_days > 0),
  decided_at  timestamptz,
  created_at  timestamptz not null default now()
);

create table files (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects on delete restrict,
  uploaded_by  uuid not null references profiles,
  kind         file_kind not null,
  storage_path text not null unique,           -- '{project_id}/...' in bucket project-files
  file_name    text not null,
  size_bytes   bigint not null check (size_bytes between 1 and 52428800),
  expires_at   timestamptz,                    -- test builds
  created_at   timestamptz not null default now()
);

create table invoice_counters (fy text primary key, last_no int not null);   -- fy '26-27'

create table invoices (
  id                 uuid primary key default gen_random_uuid(),
  client_id          uuid not null references clients on delete restrict,
  project_id         uuid references projects on delete restrict,
  number             text unique,                -- null while draft; 'INV/26-27/001'
  title              text not null,
  status             invoice_status not null default 'draft',
  currency           char(3) not null default 'INR' check (currency = 'INR'),
  supply             supply_type not null default 'non_gst',
  total_minor        bigint not null default 0,  -- set by send_invoice()
  paid_minor         bigint not null default 0,  -- maintained by trigger
  issue_date         date,
  due_date           date,
  bill_to            jsonb,                      -- client snapshot at send
  razorpay_link_id   text unique,
  razorpay_short_url text,
  pdf_path           text,
  sent_at            timestamptz,
  paid_at            timestamptz,
  voided_at          timestamptz,
  created_at         timestamptz not null default now()
);

create table invoice_items (
  id               uuid primary key default gen_random_uuid(),
  invoice_id       uuid not null references invoices on delete cascade,  -- drafts only (guard trigger)
  position         int not null default 0,
  description      text not null,
  qty              numeric(10,2) not null default 1 check (qty > 0),
  unit_price_minor bigint not null check (unit_price_minor > 0),
  amount_minor     bigint generated always as (round(qty * unit_price_minor)::bigint) stored
);

create table payments (
  id                  uuid primary key default gen_random_uuid(),
  kind                payment_kind not null default 'invoice',
  invoice_id          uuid references invoices on delete restrict,
  lead_id             uuid references leads on delete restrict,
  source              payment_source not null,
  amount_minor        bigint not null check (amount_minor > 0),
  currency            char(3) not null default 'INR',
  fee_minor           bigint not null default 0,
  tax_on_fee_minor    bigint not null default 0,
  method              text,                         -- upi | card | netbanking | ...
  razorpay_payment_id text unique,                  -- webhook idempotency
  reference           text,                         -- UTR / Wise ref for manual entries
  paid_at             timestamptz not null,
  raw                 jsonb,                        -- admin-only column (see §14)
  created_at          timestamptz not null default now(),
  constraint payment_target check (invoice_id is not null or (kind = 'audit_page' and lead_id is not null)),
  constraint manual_has_ref check (source = 'razorpay' or reference is not null)
);

create table audit_log (
  id         bigint generated always as identity primary key,
  actor      uuid,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  diff       jsonb,
  created_at timestamptz not null default now()
);

create index on projects (client_id);
create index on milestones (project_id, position);
create index on updates (project_id, created_at desc);
create index on change_requests (project_id, created_at desc);
create index on files (project_id, created_at desc);
create index on invoices (client_id, status);
create index on payments (invoice_id);
create index on payments (paid_at);
create index on leads (stage, created_at desc);
create index on leads (ip_hash, created_at);
