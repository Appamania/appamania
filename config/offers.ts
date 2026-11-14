// Offers and prices. The only place these live. INR; USD on request. Prices are integer paise.

export type OfferId = "audit" | "sprint" | "retainer" | "mvp" | "website";

export type Offer = {
  id: OfferId;
  name: string;
  /** Verb-first button label. */
  cta: string;
  /** Fixed price in paise. `from` marks a starting price that ends in a quote. */
  priceMinor: number;
  from?: boolean;
  per?: "month";
  duration: string;
  payment: string;
  /** Who this is for, in one line. */
  fit: string;
  includes: readonly string[];
  guarantee?: string;
};

export const offers = {
  audit: {
    id: "audit",
    name: "App health audit",
    cta: "Book the audit",
    priceMinor: 2_999_00,
    duration: "48 hours",
    payment: "100% upfront",
    fit: "A live Flutter app that crashes, lags, or is stuck on an old SDK, and nobody dares touch it.",
    includes: [
      "Written report: crashes, SDK and dependency gaps, build and CI risks, store compliance",
      "Scored checklist with the top fix first",
      "A fixed quote for the sprint that fixes it",
      "One 30-minute call to walk through the report",
    ],
    guarantee: "Report in 48 hours or the audit is free. Fee credited to a sprint.",
  },
  sprint: {
    id: "sprint",
    name: "Rescue and migration sprint",
    cta: "Start a sprint",
    priceMinor: 24_999_00,
    duration: "3–4 weeks",
    payment: "50% to start, 50% on release",
    fit: "An app that needs an SDK upgrade, crash fixes, CI, and a store release without pausing users.",
    includes: [
      "Flutter and dependency upgrade on a branch, merged when green",
      "Root-cause fixes for the top crashes",
      "CI/CD on GitHub Actions: tests, builds, signed artifacts",
      "Play Store and App Store release, with the listing checked",
      "Hand-over notes. You own the code.",
    ],
  },
  retainer: {
    id: "retainer",
    name: "Care retainer",
    cta: "Start a retainer",
    priceMinor: 14_999_00,
    per: "month",
    duration: "Monthly",
    payment: "Monthly in advance",
    fit: "A shipped app that needs someone on call for SDK bumps, store policy changes, and small features.",
    includes: [
      "One release a month, more when needed",
      "Dependency and SDK bumps before they break",
      "Crash triage within one working day",
      "Small changes included, bigger ones quoted",
    ],
  },
  mvp: {
    id: "mvp",
    name: "MVP build",
    cta: "Scope an MVP",
    priceMinor: 74_999_00,
    from: true,
    duration: "6–8 weeks",
    payment: "Milestones, quoted",
    fit: "A new product that needs a first Flutter release on both stores.",
    includes: ["Scope and milestones in writing", "Clean architecture, tests, CI from day one", "Both store releases"],
  },
  website: {
    id: "website",
    name: "Business website",
    cta: "Scope a website",
    priceMinor: 14_999_00,
    from: true,
    duration: "2 weeks",
    payment: "50% to start, 50% on launch",
    fit: "A small business that needs a fast site with a form and a Google Business listing.",
    includes: ["Next.js, hosted, with analytics", "Contact form and SEO basics", "You own the domain and the code"],
  },
} as const satisfies Record<OfferId, Offer>;

export const offerIds = Object.keys(offers) as OfferId[];

/** "₹2,999", "from ₹74,999", "₹14,999/month". */
export function formatPrice(offer: Pick<Offer, "priceMinor" | "from" | "per">) {
  const rupees = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(offer.priceMinor / 100);
  return `${offer.from ? "from " : ""}₹${rupees}${offer.per ? `/${offer.per}` : ""}`;
}

export function isOfferId(value: string): value is OfferId {
  return (offerIds as string[]).includes(value);
}

/** Budget bands for the contact form. Labels use the same INR formatting as prices. */
export const budgets = [
  { id: "lt25k", label: `Under ${formatPrice({ priceMinor: 25_000_00 })}` },
  { id: "25k-75k", label: `${formatPrice({ priceMinor: 25_000_00 })}–${formatPrice({ priceMinor: 75_000_00 })}` },
  { id: "75k-2l", label: `${formatPrice({ priceMinor: 75_000_00 })}–${formatPrice({ priceMinor: 2_00_000_00 })}` },
  { id: "gt2l", label: `Over ${formatPrice({ priceMinor: 2_00_000_00 })}` },
  { id: "unsure", label: "Not sure yet" },
] as const;
