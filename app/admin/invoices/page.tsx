import { FileText } from "lucide-react";
import Link from "next/link";
import { StatusPill } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Money } from "@/components/ui/Money";
import { EmptyState } from "@/components/ui/Misc";
import { Table, THead, Th, Td, Tr } from "@/components/ui/Table";
import { listAdminInvoices } from "@/features/invoices/queries";
import { invoiceDisplayStatus } from "@/features/invoices/status";
import { formatAbsolute } from "@/lib/dates";

export default async function AdminInvoicesPage() {
  const rows = await listAdminInvoices();
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">Invoices</h1>
          <p className="text-small text-ink-muted">Draft, send, and track Razorpay links.</p>
        </div>
        <ButtonLink href="/admin/invoices/new" size="sm">
          New draft
        </ButtonLink>
      </div>
      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          body="Create a draft, add the line, then send a Razorpay pay link."
          action={
            <ButtonLink href="/admin/invoices/new" size="sm">
              New draft
            </ButtonLink>
          }
        />
      ) : (
        <Table>
          <THead>
            <tr>
              <Th>Number</Th>
              <Th>Client</Th>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Due</Th>
              <Th className="tabular-nums">Total</Th>
            </tr>
          </THead>
          <tbody className="max-md:block">
            {rows.map((r) => {
              const client = r.clients as { name: string } | null;
              const status = invoiceDisplayStatus(r.status, r.due_date);
              return (
                <Tr key={r.id}>
                  <Td label="Number" className="font-mono">
                    <Link href={`/admin/invoices/${r.id}`} className="text-brand hover:underline">
                      {r.number ?? "Draft"}
                    </Link>
                  </Td>
                  <Td label="Client">{client?.name ?? "—"}</Td>
                  <Td label="Title">{r.title}</Td>
                  <Td label="Status">
                    <StatusPill domain="invoice" value={status} />
                  </Td>
                  <Td label="Due" className="font-mono">
                    {r.due_date ? formatAbsolute(r.due_date) : "—"}
                  </Td>
                  <Td label="Total">
                    <Money minor={r.total_minor} trim />
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
