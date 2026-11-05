import Link from "next/link";
import { listAdminInvoices } from "@/features/invoices/queries";
import { formatMinor } from "@/lib/money";

export default async function AdminInvoicesPage() {
  const rows = await listAdminInvoices();
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">Invoices</h1>
          <p className="text-small text-ink-muted">Draft, send, and track Razorpay links.</p>
        </div>
        <Link href="/admin/invoices/new" className="rounded-pill bg-brand px-4 py-2 text-small font-medium text-on-brand">
          New draft
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-left text-small">
          <thead className="border-b border-line bg-paper-sunken font-mono text-ink-muted">
            <tr>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 tabular-nums">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const client = r.clients as { name: string } | null;
              return (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono">
                    <Link href={`/admin/invoices/${r.id}`} className="text-brand hover:underline">
                      {r.number ?? "Draft"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{client?.name ?? "—"}</td>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3 font-mono">{r.status}</td>
                  <td className="px-4 py-3 tabular-nums">{formatMinor(r.total_minor, "INR", { trim: true })}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink-muted">
                  No invoices yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
