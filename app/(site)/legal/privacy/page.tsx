import { LegalPage } from "@/components/site/Prose";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy",
  description:
    "The note form stores your name, email, message, optional link, chosen service, platform, timeline, budget, and receipt time in Firestore, used only to reply.",
  path: "/legal/privacy",
  rootImage: true,
});

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="14 Nov 2026">
      <h2>What is collected</h2>
      <p>
        The note form asks for your name, email, a message, an optional link, the service you picked, and, if you
        choose, the platform, timeline, and budget range. It also records when the note was received.
      </p>
      <h2>Where it goes</h2>
      <p>
        Those fields are stored in Firestore and are read only by {site.email} in the Firebase console. They are used
        only to reply. Page views use Google Analytics (GA4). Google Analytics also records which buttons are clicked
        and whether the form was sent, without the form&apos;s contents.
      </p>
      <p>Google Analytics sets cookies and records the browser, device, and approximate location of each visit.</p>
      <p>
        The site is hosted on Netlify, which keeps standard server logs (IP address, browser, time) for security and
        abuse prevention.
      </p>
      <h2>Your rights</h2>
      <p>
        Ask for a copy, a correction, or deletion at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
