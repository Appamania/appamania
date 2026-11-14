// Client checks for the note form. Firestore rules repeat the length caps.
import { budgets, isOfferId } from "@/config/offers";

export const platforms = [
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
  { id: "both", label: "Android and iOS" },
  { id: "web", label: "Web" },
  { id: "unsure", label: "Not sure" },
] as const;

export const timelines = [
  { id: "now", label: "This month" },
  { id: "soon", label: "In 1–3 months" },
  { id: "later", label: "Later" },
  { id: "exploring", label: "Just exploring" },
] as const;

// 200 left for the details footer; firestore.rules caps message at 4000.
const LIMITS = { name: 200, email: 200, message: 3800, link: 500 } as const;

export type NoteFields = {
  name: string;
  email: string;
  message: string;
  link: string;
  offer: string;
  platform: string;
  timeline: string;
  budget: string;
  website: string;
};

export type NoteField = "name" | "email" | "message" | "link";

export type NoteBody = { name: string; email: string; message: string; link: string; offer: string };

export type PreparedNote =
  | { ok: true; drop: true }
  | { ok: true; drop: false; body: NoteBody; details: { platform: string; timeline: string; budget: string } }
  | { ok: false; field: NoteField; error: string };

export function prepareNote(input: NoteFields): PreparedNote {
  if (input.website.trim()) return { ok: true, drop: true };
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const link = input.link.trim();
  // An unknown offer becomes "" rather than an error: the select only offers known ids.
  const offer = isOfferId(input.offer) ? input.offer : "";
  if (!name) return { ok: false, field: "name", error: "Enter your name" };
  if (name.length > LIMITS.name) return { ok: false, field: "name", error: "Name is too long" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > LIMITS.email)
    return { ok: false, field: "email", error: "Enter a valid email address" };
  if (!message) return { ok: false, field: "message", error: "Enter a message" };
  if (message.length > LIMITS.message) return { ok: false, field: "message", error: "Message is too long" };
  if (link.length > LIMITS.link) return { ok: false, field: "link", error: "Link is too long" };
  if (link && !/^https?:\/\//i.test(link))
    return { ok: false, field: "link", error: "Link must start with http:// or https://" };
  // Known platform, timeline, and budget ids go into the message as a footer. Unknown ids are skipped.
  const platform = platforms.find((p) => p.id === input.platform);
  const timeline = timelines.find((t) => t.id === input.timeline);
  const budget = budgets.find((b) => b.id === input.budget);
  const footer = [
    platform && `Platform: ${platform.label}`,
    timeline && `Timeline: ${timeline.label}`,
    budget && `Budget: ${budget.label}`,
  ].filter(Boolean);
  const body = footer.length ? `${message}\n\n---\n${footer.join("\n")}` : message;
  return {
    ok: true,
    drop: false,
    body: { name, email, message: body, link, offer },
    details: { platform: platform?.id ?? "", timeline: timeline?.id ?? "", budget: budget?.id ?? "" },
  };
}

/** Blur check for one field. Other fields are filled so the first-error order does not hide this one. */
export function fieldError(input: NoteFields, field: NoteField): string | undefined {
  const prepared = prepareNote({
    name: "Asha",
    email: "asha@example.com",
    message: "Hello",
    link: "",
    offer: "",
    platform: "",
    timeline: "",
    budget: "",
    website: "",
    [field]: input[field],
  });
  return prepared.ok ? undefined : prepared.error;
}
