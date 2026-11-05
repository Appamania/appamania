-- PRD §13 / §16: invoice send, immutability guards, paid sync.

create function public.fy_label(d date) returns text
language sql immutable set search_path = '' as $$
  select case when extract(month from d) >= 4
    then to_char(d, 'YY') || '-' || to_char(d + interval '1 year', 'YY')
    else to_char(d - interval '1 year', 'YY') || '-' || to_char(d, 'YY') end
$$;

create function public.send_invoice(p_id uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_inv public.invoices%rowtype;
  v_sub bigint;
  v_fy text;
  v_no int;
  v_num text;
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;

  select * into v_inv from public.invoices where id = p_id for update;
  if not found then raise exception 'invoice not found'; end if;
  if v_inv.status <> 'draft' then raise exception 'invoice is not a draft'; end if;

  select coalesce(sum(amount_minor), 0) into v_sub from public.invoice_items where invoice_id = p_id;
  if v_sub = 0 then raise exception 'invoice has no items'; end if;

  v_fy := public.fy_label(v_today);
  insert into public.invoice_counters (fy, last_no) values (v_fy, 1)
    on conflict (fy) do update set last_no = public.invoice_counters.last_no + 1
    returning last_no into v_no;
  v_num := 'INV/' || v_fy || '/' || lpad(v_no::text, 3, '0');

  update public.invoices i set
    number = v_num,
    status = 'sent',
    issue_date = v_today,
    due_date = coalesce(i.due_date, v_today + 7),
    sent_at = now(),
    total_minor = v_sub,
    bill_to = (
      select jsonb_build_object(
        'name', coalesce(c.legal_name, c.name),
        'email', c.billing_email,
        'phone', c.phone,
        'address', c.address,
        'country', c.country,
        'state_code', c.state_code,
        'gstin', c.gstin
      )
      from public.clients c where c.id = i.client_id
    )
  where i.id = p_id;

  insert into public.audit_log (actor, action, entity, entity_id)
  values (auth.uid(), 'invoice.send', 'invoices', p_id);

  return v_num;
end $$;

revoke execute on function public.send_invoice(uuid) from public, anon;
grant execute on function public.send_invoice(uuid) to authenticated;

create function public.guard_sent_invoice() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.status <> 'draft' and (
    new.client_id is distinct from old.client_id
    or new.total_minor is distinct from old.total_minor
    or new.number is distinct from old.number
    or new.bill_to is distinct from old.bill_to
    or new.supply is distinct from old.supply
    or new.currency is distinct from old.currency
  ) then
    raise exception 'sent invoice is immutable; void and create a new one';
  end if;
  return new;
end $$;

create trigger guard_sent before update on public.invoices
  for each row execute function public.guard_sent_invoice();

create function public.guard_items() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (select status from public.invoices where id = coalesce(new.invoice_id, old.invoice_id)) <> 'draft'
  then raise exception 'items of a non-draft invoice are immutable';
  end if;
  return coalesce(new, old);
end $$;

create trigger guard_items before insert or update or delete on public.invoice_items
  for each row execute function public.guard_items();

create function public.sync_invoice_paid() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_paid bigint;
  v_inv public.invoices%rowtype;
begin
  if new.invoice_id is null then return new; end if;

  select coalesce(sum(amount_minor), 0) into v_paid
  from public.payments where invoice_id = new.invoice_id;

  select * into v_inv from public.invoices where id = new.invoice_id for update;
  if not found then return new; end if;
  if v_inv.status = 'void' then return new; end if;

  update public.invoices set
    paid_minor = v_paid,
    status = case
      when v_paid >= total_minor then 'paid'::public.invoice_status
      when v_paid > 0 then 'partially_paid'::public.invoice_status
      else status
    end,
    paid_at = case
      when v_paid >= total_minor then coalesce(paid_at, now())
      else null
    end
  where id = new.invoice_id;

  return new;
end $$;

create trigger sync_paid after insert or update on public.payments
  for each row execute function public.sync_invoice_paid();
