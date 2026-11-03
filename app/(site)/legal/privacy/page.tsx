import type { Metadata } from "next";
import { LegalPage } from "@/components/site/Prose";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/legal/privacy" } };

// TODO(legal): review before launch (PRD App. A, A7).
export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" updated="3 Nov 2026">
      <h2>What is collected</h2>
      <ul>
        <li>Enquiries: name, email, company, industry, what you need, an optional link and your message.</li>
        <li>Clients: contact and billing details needed for invoices, and project files you share in the portal.</li>
        <li>A one-way hash of your IP address to limit spam. Raw IP addresses are not stored.</li>
        <li>Cookieless page analytics (Vercel Web Analytics). No advertising trackers.</li>
      </ul>
      <h2>Why</h2>
      <p>Only to reply to you, deliver the work, invoice it and keep financial records required by law.</p>
      <h2>Where it is kept</h2>
      <p>
        Data is stored with Supabase in Mumbai, India. Emails are sent through Resend. Payments are processed by Razorpay; card and UPI details never reach
        Appamania. The spam check on the contact form is Cloudflare Turnstile.
      </p>
      <h2>How long</h2>
      <p>Enquiries that don&apos;t become projects are deleted after 24 months. Invoices and payment records are kept as tax law requires.</p>
      <h2>Your rights</h2>
      <p>
        Ask for a copy, a correction or deletion at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
