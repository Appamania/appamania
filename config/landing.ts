import { formatPrice, offers, type OfferId } from "@/config/offers";

export type LandingSlug = "flutter-upgrade" | "flutter-app-rescue" | "flutter-app-audit";
export type Landing = {
  slug: LandingSlug;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  accent: string;
  lead: string;
  offer: OfferId;
  signs: readonly string[];
  caseStudy: string;
  faq: readonly { q: string; a: string }[];
};

// Service landing pages. Facts come from config/offers.ts, config/home.ts, and content/snapshot.json only.
export const landings = {
  "flutter-upgrade": {
    slug: "flutter-upgrade",
    title: "Flutter upgrade and migration service",
    description: `Upgrade a live Flutter app to the current SDK, plugins, and Swift PM without pausing releases. Written audit first, then a fixed-price sprint. Audit ${formatPrice(offers.audit)}.`,
    eyebrow: "Flutter upgrade",
    h1: "Upgrade your Flutter app",
    accent: "without pausing releases.",
    lead: "Appamania moves a live Flutter app to the current SDK, plugins, and Swift Package Manager. A written audit comes first, then a fixed-price sprint that lands on a branch behind CI.",
    offer: "audit",
    signs: [
      offers.audit.fit,
      offers.sprint.fit,
      "A two-step SDK jump with live users, without pausing releases.",
      "A move from CocoaPods to Swift Package Manager on iOS.",
    ],
    caseStudy: "flutter-3-47-upgrade",
    faq: [
      {
        q: "What does it cost?",
        a: `Start with the ${formatPrice(offers.audit)} audit. It is credited to the sprint if you go ahead, and the report is yours either way.`,
      },
      {
        q: "How long does it take?",
        a: `The audit report comes in 48 hours. A sprint runs ${offers.sprint.duration}, paid ${offers.sprint.payment.toLowerCase()}.`,
      },
      { q: "Who owns the code?", a: "You do, from the first commit. Work happens in your repo." },
    ],
  },
  "flutter-app-rescue": {
    slug: "flutter-app-rescue",
    title: "Fix a crashing or stuck Flutter app",
    description: `Take over a Flutter app that crashes, lags, or is stuck on an old SDK. Root-cause fixes, CI, and a store release at a fixed price. You own the code.`,
    eyebrow: "Flutter app rescue",
    h1: "Fix a Flutter app that crashes",
    accent: "or is stuck on an old SDK.",
    lead: "Appamania takes over a live Flutter app that crashes, lags, or is stuck on an old SDK. Root-cause fixes, CI, and a store release, at a fixed price. You own the code.",
    offer: "audit",
    signs: [offers.audit.fit, offers.sprint.fit, offers.sprint.includes[1]],
    caseStudy: "telecom-flutter-3-migration",
    faq: [
      {
        q: "What does it cost?",
        a: `Start with the ${formatPrice(offers.audit)} audit. The sprint is a fixed price set from the report.`,
      },
      {
        q: "How long does it take?",
        a: `A rescue sprint runs ${offers.sprint.duration}, paid ${offers.sprint.payment.toLowerCase()}.`,
      },
      { q: "Where is the proof?", a: "Case studies on this site, the apps on Google Play, the packages on pub.dev." },
    ],
  },
  "flutter-app-audit": {
    slug: "flutter-app-audit",
    title: "Flutter app audit in 48 hours",
    description: `A written Flutter code audit for ${formatPrice(offers.audit)}: crashes, SDK and dependency gaps, CI and store risks, scored with the top fix first. In 48 hours or free.`,
    eyebrow: "Flutter app audit",
    h1: "A written Flutter app audit",
    accent: "in 48 hours.",
    lead: "Send the repo or the APK. In 48 hours you get a written report with the top fix first, and a fixed quote for the sprint that fixes it.",
    offer: "audit",
    signs: [
      offers.audit.fit,
      "You want a fixed quote before anyone changes the code.",
      "You need a scored checklist of crashes, SDK gaps, and store risks.",
    ],
    caseStudy: "flutter-3-47-upgrade",
    faq: [
      {
        q: "What does it cost?",
        a: `The audit is ${formatPrice(offers.audit)}, ${offers.audit.payment.toLowerCase()}.`,
      },
      { q: "What if the report is late?", a: "Report in 48 hours or the audit is free." },
      { q: "Does the fee count toward a sprint?", a: "Yes. The fee is credited to a sprint." },
    ],
  },
} as const satisfies Record<LandingSlug, Landing>;

export const landingSlugs = Object.keys(landings) as LandingSlug[];
