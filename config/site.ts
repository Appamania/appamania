// Site constants. Only place these live.

export const site = {
  name: "Appamania",
  /** Brand descriptor after the name (titles, hero chip, footer). */
  descriptor: "Flutter rescue studio",
  tagline: "Stuck Flutter apps, upgraded and shipped. Written audit first, fixed price after.",
  /** Home meta description. */
  description:
    "Flutter rescue studio in Kolkata. A written audit in 48 hours, then a fixed-price sprint to upgrade the SDK, fix crashes, and ship to both stores.",
  url: "https://appamania.in",
  owner: "Sumit Pal",
  founderRole: "Founder",
  /** /media/… path of a real founder photo. Empty shows the mark. */
  founderPhoto: "" as string,
  location: "Kolkata, India",
  email: "sumit@appamania.in",
  /** Legal name as on the Udyam certificate. Empty hides the line. */
  legalName: "" as string,
  /** Udyam registration number. Empty shows "Udyam-registered" without a number. */
  udyam: "" as string,
  /** Footer and invoices. */
  identity: "Appamania · Sumit Pal · Udyam-registered",
  billing: "Invoiced in INR. USD on request.",
  /** Banner above the nav. Empty hides it. */
  notice: "" as string,
  /** Footer line, e.g. "Taking one sprint from January". Empty hides it. */
  availability: "" as string,
  links: {
    github: "https://github.com/Appamania",
    linkedin: "https://www.linkedin.com/in/sumit-dev-flutter",
    x: "https://x.com/SumitMobileDev",
    play: "" as string,
    linkedinCompany: "" as string,
    pubPublisher: "https://pub.dev/publishers/appamania.in",
    /** Google Calendar appointment page on the Workspace account. Empty hides the link. */
    booking: "https://calendar.app.google/52jDyd3Gt5ScQYxs9",
  },
} as const;
