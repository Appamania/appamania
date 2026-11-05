import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminInvoice } from "@/features/invoices/queries";
import { formatMinor } from "@/lib/money";
import { SendInvoiceButton } from "./SendInvoiceButton";

export default async function AdminInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await getAdminInvoice(id);
  if (!inv) notFound();
  const client = inv.clients as { name: string; billing_email: string; phone: string | null } | null;
  const items = inv.invoice_items ?? [];

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <Link href="/admin/invoices" className="text-small text-ink-muted hover:text-ink">
        ← Invoices
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-small text-ink-muted">
            {inv.number ?? "Draft"} · {inv.status}
          </p>
          <h1 className="text-h1">{inv.title}</h1>
          <p className="text-small text-ink-muted">{client?.name}</p>
        </div>
        <p className="text-h2 tabular-nums">
          {formatMinor(inv.total_minor || items.reduce((s, i) => s + (i.amount_minor ?? 0), 0), "INR", { trim: true })}
        </p>
      </div>
      <ul className="divide-y divide-line rounded-lg border border-line">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 px-4 py-3 text-small">
            <span>{item.description}</span>
            <span className="tabular-nums">{formatMinor(item.amount_minor ?? 0, "INR", { trim: true })}</span>
          </li>
        ))}
      </ul>
      {inv.status === "draft" ? <SendInvoiceButton invoiceId={inv.id} /> : null}
      {inv.razorpay_short_url ? (
        <p className="text-small">
          Pay link:{" "}
          <a href={inv.razorpay_short_url} className="break-all text-brand underline" target="_blank" rel="noopener noreferrer">
            {inv.razorpay_short_url}
          </a>
        </p>
      ) : null}
      {inv.status !== "draft" && !inv.razorpay_short_url ? (
        <p className="text-small text-ink-muted">Sent without a payment link. Set Razorpay keys and send again later.</p>
      ) : null}
    </div>
  );
}
