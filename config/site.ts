// Site constants (PRD §2, §2.1, §17, §18.2). Only place these live.

export const industries = [
  "Fintech",
  "E-commerce",
  "Health",
  "Education",
  "Media",
  "Games",
  "Logistics",
  "Real estate",
  "SaaS / B2B",
  "Other",
] as const;
export type Industry = (typeof industries)[number];

export const site = {
  name: "Appamania",
  tagline: "Flutter app rescue, migration and launch. Fixed price. Code you own.",
  url: "https://appamania.in",
  owner: "Sumit Pal",
  location: "Kolkata, India",
  email: "sumit@appamania.in",
  emailFrom: "Appamania <hello@mail.appamania.in>",
  // TODO(content): WhatsApp number and call link (PRD App. A, A8).
  whatsapp: "",
  callUrl: "",
  availability: "Taking 2 audits in December",
  links: {
    github: "https://github.com/Sam21-39",
    linkedin: "https://www.linkedin.com/in/sumit-dev-flutter",
    play: "https://play.google.com/store/apps/dev?id=5165842851838633785",
    pubPublisher: "https://pub.dev/publishers/appamania.in",
  },
  // TODO(HR): fill once HR confirms which industries count as "same domain" (PRD §2.1, App. A A5).
  // Empty list = no industry is blocked. Launch blocker.
  conflictIndustries: [] as readonly Industry[],
  responseSlaBusinessDays: 1,
  /** Runbook: flip to show the "pay by bank transfer" banner in the portal. */
  paymentsDown: false,
} as const;
