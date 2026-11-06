import { stack } from "@/config/catalog";
import { formatPrice, offers } from "@/config/offers";

// Home copy. Edit here; prices come from config/offers.ts.
export const homeCopy = {
  hero: {
    before: "Stuck Flutter app?",
    after: "Fixed price,",
    accent: "shipped.",
    lead: "I'm Sumit Pal, a Flutter engineer in Kolkata. SDK upgrades, crash fixes, CI, and store releases for apps with live users. Written report first, fixed quote after.",
    primary: `Book the ${formatPrice(offers.audit)} audit`,
    secondary: "See the work",
  },
  stats: [
    { value: "6+ yrs", label: "production Flutter" },
    { value: "0", label: "regressions, last upgrade" },
    { value: "48 h", label: "audit turnaround" },
  ],
  faq: [
    {
      q: "What does it cost?",
      a: `Audit ${formatPrice(offers.audit)}. Rescue sprint ${formatPrice(offers.sprint)}. Care retainer ${formatPrice(offers.retainer)}. MVP ${formatPrice(offers.mvp)}. All on the services page.`,
    },
    {
      q: "Why a paid audit first?",
      a: "I read the code before I quote. The fee is credited to the sprint, and the report is yours either way.",
    },
    { q: "Who owns the code?", a: "You do, from the first commit. Work happens in your repo." },
    { q: "Where is the proof?", a: "Case studies on this site, the apps on Google Play, the packages on pub.dev." },
  ],
  floats: {
    upgradeEyebrow: "Upgraded to",
    upgradeValue: "3.47",
    upgradeCaption: "without pausing releases",
    ci: "CI on every push",
  },
  stack: [...stack],
} as const;
