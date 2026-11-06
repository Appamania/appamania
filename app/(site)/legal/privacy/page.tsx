import type { Metadata } from "next";
import { LegalPage } from "@/components/site/Prose";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/legal/privacy" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="6 Nov 2026">
      <h2>What is collected</h2>
      <p>The note form asks for your name, email, a message, and an optional link.</p>
      <h2>Where it goes</h2>
      <p>
        Those fields are stored in a Google Sheet owned by {site.email}. They are used only to reply. Page views use Vercel Web Analytics, which does not use advertising cookies.
      </p>
      <h2>Your rights</h2>
      <p>
        Ask for a copy, a correction, or deletion at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
