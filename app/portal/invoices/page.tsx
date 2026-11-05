import { listClientInvoices } from "@/features/invoices/queries";
import { formatMinor } from "@/lib/money";

export default async function PortalInvoicesPage() {
  const rows = await listClientInvoices();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-h1">Invoices</h1>
        <p className="text-small text-ink-muted">Pay open balances via the Razorpay link.</p>
      </div>
      <ul className="grid gap-3">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line px-4 py-3">
            <div>
              <p className="font-mono text-small text-ink-muted">
                {r.number} · {r.status}
              </p>
              <p className="font-medium">{r.title}</p>
              <p className="text-small tabular-nums text-ink-muted">
                {formatMinor(r.paid_minor, "INR", { trim: true })} / {formatMinor(r.total_minor, "INR", { trim: true })}
              </p>
            </div>
            {r.razorpay_short_url && r.status !== "paid" && r.status !== "void" ? (
              <a
                href={r.razorpay_short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill bg-brand px-4 py-2 text-small font-medium text-on-brand"
              >
                Pay
              </a>
            ) : null}
          </li>
        ))}
        {rows.length === 0 ? <li className="text-small text-ink-muted">No invoices yet.</li> : null}
      </ul>
    </div>
  );
}
