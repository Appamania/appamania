// Offers, prices and milestone templates (PRD §2). The only place these live. INR only for now.
// Prices are integer paise.

export type OfferId = "audit" | "sprint" | "retainer" | "mvp" | "website" | "custom";

export type Offer = {
  id: OfferId;
  name: string;
  /** Fixed price in paise; `from` marks an enquiry-only starting price; null = quoted. */
  priceMinor: number | null;
  from?: boolean;
  per?: "month";
  duration?: string;
  payment?: string;
  /** Milestone titles created for a new project of this offer (PRD E2.8). */
  milestones: readonly string[];
};

export const offers = {
  audit: {
    id: "audit",
    name: "App Health Audit",
    priceMinor: 2_999_00,
    duration: "48 hours",
    payment: "100% upfront",
    milestones: ["Access received", "Review", "Report delivered"],
  },
  sprint: {
    id: "sprint",
    name: "Rescue and Migration Sprint",
    priceMinor: 24_999_00,
    duration: "3–4 weeks",
    payment: "50% to start, 50% on release",
    milestones: ["Kickoff and access", "SDK upgrade", "Crash fixes", "CI/CD", "Store release"],
  },
  retainer: {
    id: "retainer",
    name: "Care Retainer",
    priceMinor: 14_999_00,
    per: "month",
    duration: "Monthly",
    payment: "Monthly in advance",
    milestones: [], // one "Release YYYY-MM" milestone per month, added by admin
  },
  mvp: { id: "mvp", name: "MVP build", priceMinor: 74_999_00, from: true, milestones: [] },
  website: { id: "website", name: "Business website", priceMinor: 14_999_00, from: true, milestones: [] },
  custom: { id: "custom", name: "Change request", priceMinor: null, milestones: [] },
} as const satisfies Record<OfferId, Offer>;

export const offerIds = Object.keys(offers) as OfferId[];
