"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createInvoice } from "@/features/invoices/actions";
import type { InvoiceFormState } from "@/features/invoices/schema";

const initial: InvoiceFormState = { ok: true };

export function NewInvoiceForm({ clients }: { clients: { id: string; name: string }[] }) {
  const router = useRouter();
  const [state, action] = useActionState(createInvoice, initial);

  useEffect(() => {
    if (state && "ok" in state && state.ok && state.id) router.push(`/admin/invoices/${state.id}`);
  }, [state, router]);

  const values = state && "values" in state ? state.values : undefined;
  const fieldErrors = state && "fieldErrors" in state ? state.fieldErrors : undefined;
  const formError = state && "formError" in state ? state.formError : undefined;

  return (
    <form action={action} className="grid gap-4">
      <Select
        name="clientId"
        label="Client"
        required
        defaultValue={values?.clientId ?? ""}
        error={fieldErrors?.clientId}
      >
        <option value="" disabled>
          Select…
        </option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Input name="title" label="Title" required defaultValue={values?.title} error={fieldErrors?.title} />
      <Input
        name="description"
        label="Line description"
        required
        defaultValue={values?.description}
        error={fieldErrors?.description}
      />
      <Input
        name="unitPriceRupees"
        label="Amount (INR)"
        type="number"
        step="0.01"
        min="1"
        required
        inputMode="decimal"
        defaultValue={values?.unitPriceRupees}
        error={fieldErrors?.unitPriceRupees}
        className="tabular-nums"
      />
      <input type="hidden" name="projectId" value="" />
      {formError ? (
        <p role="alert" className="text-small text-danger">
          {formError}
        </p>
      ) : null}
      <SubmitButton className="justify-self-start">Create draft</SubmitButton>
    </form>
  );
}
