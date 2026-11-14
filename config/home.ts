import { formatPrice, offers } from "@/config/offers";

// Home copy. Edit here; prices come from config/offers.ts.
export const homeCopy = {
  hero: {
    before: "Stuck Flutter app?",
    after: "Fixed price,",
    accent: "shipped.",
    lead: "Appamania takes over live Flutter apps that crash, lag, or sit on an old SDK. A written audit in 48 hours, then a fixed-price sprint to upgrade, fix, and release. You own the code.",
    primary: `Book the ${formatPrice(offers.audit)} audit`,
    secondary: "Read the case studies",
  },
  faq: [
    {
      q: "What does it cost?",
      a: `Audit ${formatPrice(offers.audit)}. Rescue sprint ${formatPrice(offers.sprint)}. Care retainer ${formatPrice(offers.retainer)}. MVP ${formatPrice(offers.mvp)}. All on the services page.`,
    },
    {
      q: "Why a paid audit first?",
      a: "Appamania reads the code before it quotes. The fee is credited to the sprint, and the report is yours either way.",
    },
    { q: "Who owns the code?", a: "You do, from the first commit. Work happens in your repo." },
    { q: "Where is the proof?", a: "Case studies on this site, the apps on Google Play, the packages on pub.dev." },
    {
      q: "Is Appamania a team?",
      a: "No. Appamania is founded and run by Sumit Pal. He does every audit and sprint himself.",
    },
  ],
  floats: {
    upgradeEyebrow: "Upgraded to",
    upgradeValue: "3.47",
    upgradeCaption: "without pausing releases",
    ci: "CI on every push",
  },
} as const;

export type ProofFact = { value: string; label: string; href: string };

/** Real facts only. Points come live from pub.dev; app count from the snapshot. */
export function proofFacts({ points, appCount }: { points: number[]; appCount: number }): ProofFact[] {
  const facts: ProofFact[] = [
    { value: "6+ yrs", label: "production Flutter", href: "/about" },
    { value: "0", label: "regressions in the 3.47 upgrade", href: "/work/flutter-3-47-upgrade" },
  ];
  if (points.length) {
    const min = Math.min(...points);
    const max = Math.max(...points);
    facts.push({
      value: min === max ? `${max}` : `${min}–${max}`,
      label: `pub points, ${points.length} packages`,
      href: "/open-source",
    });
  }
  if (appCount > 0) facts.push({ value: `${appCount}`, label: "apps on Google Play", href: "/apps" });
  return facts;
}

// Services process. Used by the services page and the About page.
export const steps = [
  { title: "Audit", body: "Send the repo or the APK. In 48 hours you get a written report with the top fix first." },
  { title: "Quote", body: "The report ends in a fixed price and a dated plan. No hourly meter." },
  { title: "Build", body: "Work happens on a branch with CI. You see every PR and every build." },
  { title: "Release", body: "Signed builds go to both stores. Hand-over notes. You own the code." },
] as const;
