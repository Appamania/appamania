// Client checks for the note form. Firestore rules repeat the length caps.
import { isOfferId } from "@/config/offers";

const LIMITS = { name: 200, email: 200, message: 4000, link: 500 } as const;

export type NoteFields = {
  name: string;
  email: string;
  message: string;
  link: string;
  offer: string;
  website: string;
};

export type NoteField = "name" | "email" | "message" | "link";

export type NoteBody = { name: string; email: string; message: string; link: string; offer: string };

export type PreparedNote =
  { ok: true; drop: true } | { ok: true; drop: false; body: NoteBody } | { ok: false; field: NoteField; error: string };

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
  return { ok: true, drop: false, body: { name, email, message, link, offer } };
}

/** Blur check for one field. Other fields are filled so the first-error order does not hide this one. */
export function fieldError(input: NoteFields, field: NoteField): string | undefined {
  const prepared = prepareNote({
    name: "Asha",
    email: "asha@example.com",
    message: "Hello",
    link: "",
    offer: "",
    website: "",
    [field]: input[field],
  });
  return prepared.ok ? undefined : prepared.error;
}
