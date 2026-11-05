"use client";

import { useState, useTransition } from "react";
import { sendInvoice } from "@/features/invoices/actions";

export function SendInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-2">
      <button
        type="button"
        disabled={pending}
        className="justify-self-start rounded-pill bg-brand px-4 py-2.5 text-small font-medium text-on-brand disabled:opacity-50"
        onClick={() => {
          setError(null);
          start(async () => {
            const res = await sendInvoice(invoiceId);
            if ("formError" in res && res.formError) setError(res.formError);
          });
        }}
      >
        {pending ? "Sending…" : "Send and create pay link"}
      </button>
      {error ? <p className="text-small text-danger">{error}</p> : null}
    </div>
  );
}
