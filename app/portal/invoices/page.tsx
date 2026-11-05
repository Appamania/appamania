import { FileText } from "lucide-react";
import { StatusPill } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Misc";
import { Money } from "@/components/ui/Money";
import { listClientInvoices } from "@/features/invoices/queries";
import { invoiceDisplayStatus } from "@/features/invoices/status";
import { formatAbsolute } from "@/lib/dates";

export default async function PortalInvoicesPage() {
  const rows = await listClientInvoices();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-h1">Invoices</h1>
        <p className="text-small text-ink-muted">Pay open balances via the Razorpay link.</p>
      </div>
      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          body="When a draft is sent, it shows up here with a pay link."
        />
      ) : (
        <ul className="grid gap-3">
          {rows.map((r) => {
            const status = invoiceDisplayStatus(r.status, r.due_date);
            return (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line px-4 py-3"
              >
                <div className="grid gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-small text-ink-muted">{r.number}</p>
                    <StatusPill domain="invoice" value={status} />
                  </div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-small text-ink-muted">
                    <Money minor={r.paid_minor} trim /> / <Money minor={r.total_minor} trim />
                    {r.due_date ? (
                      <span className="font-mono"> · Due {formatAbsolute(r.due_date)}</span>
                    ) : null}
                  </p>
                </div>
                {r.razorpay_short_url && r.status !== "paid" && r.status !== "void" ? (
                  <a
                    href={r.razorpay_short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles("primary", "sm")}
                  >
                    Pay
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
