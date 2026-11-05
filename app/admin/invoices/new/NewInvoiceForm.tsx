"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createInvoice } from "@/features/invoices/actions";
import type { InvoiceFormState } from "@/features/invoices/schema";

const initial: InvoiceFormState = { ok: true };

export function NewInvoiceForm({ clients }: { clients: { id: string; name: string }[] }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createInvoice, initial);

  useEffect(() => {
    if (state && "ok" in state && state.ok && state.id) router.push(`/admin/invoices/${state.id}`);
  }, [state, router]);

  const values = state && "values" in state ? state.values : undefined;
  const fieldErrors = state && "fieldErrors" in state ? state.fieldErrors : undefined;
  const formError = state && "formError" in state ? state.formError : undefined;

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-1.5 text-small">
        Client
        <select name="clientId" required defaultValue={values?.clientId ?? ""} className="rounded-md border border-line bg-paper px-3 py-2">
          <option value="" disabled>
            Select…
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {fieldErrors?.clientId ? <span className="text-small text-danger">{fieldErrors.clientId[0]}</span> : null}
      </label>
      <label className="grid gap-1.5 text-small">
        Title
        <input name="title" required defaultValue={values?.title} className="rounded-md border border-line bg-paper px-3 py-2" />
        {fieldErrors?.title ? <span className="text-small text-danger">{fieldErrors.title[0]}</span> : null}
      </label>
      <label className="grid gap-1.5 text-small">
        Line description
        <input name="description" required defaultValue={values?.description} className="rounded-md border border-line bg-paper px-3 py-2" />
        {fieldErrors?.description ? <span className="text-small text-danger">{fieldErrors.description[0]}</span> : null}
      </label>
      <label className="grid gap-1.5 text-small">
        Amount (INR)
        <input name="unitPriceRupees" type="number" step="0.01" min="1" required defaultValue={values?.unitPriceRupees} className="rounded-md border border-line bg-paper px-3 py-2 tabular-nums" />
        {fieldErrors?.unitPriceRupees ? <span className="text-small text-danger">{fieldErrors.unitPriceRupees[0]}</span> : null}
      </label>
      <input type="hidden" name="projectId" value="" />
      {formError ? <p className="text-small text-danger">{formError}</p> : null}
      <button type="submit" disabled={pending} className="rounded-pill bg-brand px-4 py-2.5 text-small font-medium text-on-brand disabled:opacity-50">
        {pending ? "Saving…" : "Create draft"}
      </button>
    </form>
  );
}
