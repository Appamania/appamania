import { statuses } from "@/components/ui/Badge";

export type InvoiceDisplayStatus = keyof typeof statuses.invoice;

/** Today's calendar date in IST as YYYY-MM-DD (matches invoice due_date storage). */
function todayIst(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Display status for StatusPill (PRD §8 / §14).
 * Overdue is derived: status in sent|partially_paid and due_date < IST today.
 */
export function invoiceDisplayStatus(
  status: string,
  dueDate: string | null | undefined,
  now: Date = new Date(),
): InvoiceDisplayStatus {
  if ((status === "sent" || status === "partially_paid") && dueDate && dueDate < todayIst(now)) {
    return "overdue";
  }
  if (Object.hasOwn(statuses.invoice, status)) return status as InvoiceDisplayStatus;
  return "draft";
}
