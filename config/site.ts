// Site constants. Only place these live.

export const site = {
  name: "Appamania",
  tagline: "Flutter rescue, upgrades, and releases. Fixed price, written report, shipped.",
  url: "https://appamania.in",
  owner: "Sumit Pal",
  location: "Kolkata, India",
  email: "sumit@appamania.in",
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
    play: "",
    pubPublisher: "https://pub.dev/publishers/appamania.in",
    /** Google Calendar appointment page on the Workspace account. Empty hides the link. */
    booking: "https://calendar.app.google/52jDyd3Gt5ScQYxs9",
  },
} as const;
