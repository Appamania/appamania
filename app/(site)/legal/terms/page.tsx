import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/Prose";
import { priceText } from "@/components/site/Price";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/legal/terms" } };

// TODO(legal): review with a lawyer/CA before launch (PRD App. A, A7).
export default function Terms() {
  return (
    <LegalPage title="Terms of service" updated="3 Nov 2026">
      <p>These terms cover every Appamania engagement unless a signed proposal says otherwise. Appamania is run by {site.owner}, {site.location}.</p>
      <h2>Scope and price</h2>
      <ul>
        <li>Each offer has a fixed price against a written scope. Work outside it is a change request, quoted before it starts.</li>
        <li>App Health Audit ({priceText("audit")}) is paid in full upfront. The fee is credited in full if a sprint starts within 30 days.</li>
        <li>Rescue and Migration Sprint ({priceText("sprint")}): 50% to start, 50% on release.</li>
        <li>Care Retainer ({priceText("retainer")}) is billed monthly in advance and can be cancelled any time; the current month runs to its end.</li>
        <li>Prices are in INR. GST is not charged while Appamania is not GST-registered.</li>
      </ul>
      <h2>Delivery</h2>
      <ul>
        <li>All work happens in your repository. Progress, files and invoices are in the client portal.</li>
        <li>You create and own every third-party account (stores, Firebase, Supabase, domains); Appamania is invited as a member.</li>
        <li>An NDA is signed on request before repo access.</li>
      </ul>
      <h2>Ownership</h2>
      <p>Code and IP delivered under an engagement belong to you once the related invoice is paid.</p>
      <h2>Refunds</h2>
      <p>
        See the <Link href="/legal/refunds">refund and cancellation policy</Link>.
      </p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </LegalPage>
  );
}
