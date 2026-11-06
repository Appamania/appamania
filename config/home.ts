import { inDevelopment, stack } from "@/config/catalog";
import type { HomeCopy } from "@/lib/store";

// Checked-in home copy. Remote Config `static` replaces this when the JSON parses.
export const homeCopy: HomeCopy = {
  hero: {
    before: "Flutter apps",
    after: "that actually",
    accent: "ship.",
    lead: "I'm Sumit Pal, a Flutter engineer in Kolkata. This site is the work, the apps, and the packages.",
    primary: "See the work",
    secondary: "Send a note",
  },
  stats: [
    { value: "6+ yrs", label: "production Flutter" },
    { value: "150–160", label: "pub.dev points" },
    { value: "4 apps", label: "live on Play" },
  ],
  faq: [
    { q: "Where is the work?", a: "Case studies are on this site. The apps are on Google Play. The packages are on pub.dev." },
    { q: "Why are the write-ups unnamed?", a: "The apps are described without the company name, unless someone asked to be named." },
    { q: "How does a note reach you?", a: "The form saves a note I read. Email works too." },
  ],
  floats: {
    upgradeEyebrow: "Upgraded to",
    upgradeValue: "3.47",
    upgradeCaption: "without pausing releases",
    ci: "CI on every push",
  },
  stack: [...stack],
  inDevelopment: { name: inDevelopment.name, summary: inDevelopment.summary },
};
