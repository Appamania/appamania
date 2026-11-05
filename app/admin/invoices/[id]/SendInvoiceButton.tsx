"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { sendInvoice } from "@/features/invoices/actions";

export function SendInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        loading={pending}
        className="justify-self-start"
        onClick={() => {
          setError(null);
          start(async () => {
            const res = await sendInvoice(invoiceId);
            if ("formError" in res && res.formError) setError(res.formError);
          });
        }}
      >
        Send and create pay link
      </Button>
      {error ? (
        <p role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
