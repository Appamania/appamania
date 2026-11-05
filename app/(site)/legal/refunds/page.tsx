import type { Metadata } from "next";
import { LegalPage } from "@/components/site/Prose";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Refunds and cancellation", alternates: { canonical: "/legal/refunds" } };

// TODO(legal): review before launch (PRD App. A, A7). Required by Razorpay (E1.7).
export default function Refunds() {
  return (
    <LegalPage title="Refund and cancellation policy" updated="3 Nov 2026">
      <h2>App Health Audit</h2>
      <p>Full refund if you cancel before work starts. Once the review has started, the audit is not refundable.</p>
      <h2>Rescue and Migration Sprint</h2>
      <p>If you cancel mid-sprint, you are refunded pro-rata for milestones not yet delivered. Delivered work stays yours.</p>
      <h2>Care Retainer</h2>
      <p>Cancel any time before the next monthly invoice. The current month is not refunded and runs to its end.</p>
      <h2>How refunds are paid</h2>
      <p>Refunds go back to the original payment method through Razorpay, usually within 5–7 working days of approval.</p>
      <h2>Ask for a refund</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> with your invoice number.
      </p>
    </LegalPage>
  );
}
