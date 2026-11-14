import type { Metadata } from "next";
import { LegalPage } from "@/components/site/Prose";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/legal/privacy" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="14 Nov 2026">
      <h2>What is collected</h2>
      <p>
        The note form asks for your name, email, a message, an optional link, and the service you picked. It also
        records when the note was received.
      </p>
      <h2>Where it goes</h2>
      <p>
        Those fields are stored in Firestore and are read only by {site.email} in the Firebase console. They are used
        only to reply. Page views use Google Analytics (GA4).
      </p>
      <p>
        The site is hosted on Netlify, which keeps standard server logs (IP address, browser, time) for security and abuse prevention.
      </p>
      <h2>Your rights</h2>
      <p>
        Ask for a copy, a correction, or deletion at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
