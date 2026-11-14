import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const paragraphs = z.array(z.string().min(1));
/** Uploaded in the Firebase console to Storage `media/`. Only that host renders, so a bad row cannot point next/image elsewhere. */
const media = z.string().startsWith("https://firebasestorage.googleapis.com/");

export const WorkSchema = z.object({
  slug,
  order: z.number().int(),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  accent: z.string().min(1),
  lead: z.string().min(1),
  teaser: z.object({ label: z.string().min(1), title: z.string().min(1), summary: z.string().min(1) }),
  stats: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).length(3),
  problemTitle: z.string().min(1),
  problem: paragraphs.min(1),
  steps: z
    .array(z.object({ title: z.string().min(1), body: z.string().min(1) }))
    .min(2)
    .max(4),
  checks: z.array(z.string().min(1)).optional(),
  result: z.object({ title: z.string().min(1), body: z.string().min(1) }),
  versions: z.array(z.object({ from: z.string().min(1), to: z.string().min(1) })).min(1),
  stack: z.array(z.string().min(1)).min(1),
  cover: media.optional(),
  video: media.optional(),
});

export const PostSchema = z.object({
  slug,
  date: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  body: paragraphs.min(1),
});

export const AppSchema = z.object({
  slug,
  order: z.number().int(),
  name: z.string().min(1),
  initial: z.string().min(1).max(3),
  category: z.string().min(1),
  badge: z.string().min(1),
  summary: z.string().min(1),
  url: z.string().regex(/^https?:\/\//),
  body: paragraphs.min(1),
  icon: media.optional(),
  screens: z.array(media).max(8).optional(),
});

export const PackageSchema = z.object({
  slug,
  order: z.number().int(),
  name: z.string().min(1),
  summary: z.string().min(1),
  points: z.number().int().nonnegative(),
  body: paragraphs.min(1),
});

export type Work = z.infer<typeof WorkSchema>;
export type Post = z.infer<typeof PostSchema>;
export type AppEntry = z.infer<typeof AppSchema>;
export type PackageEntry = z.infer<typeof PackageSchema>;

/** Skip a bad document. If every document is bad, keep the snapshot so one broken row does not blank the page. */
export function chooseList<T>(remote: unknown[] | null, schema: z.ZodType<T>, fallback: T[]): T[] {
  // An empty collection means "not seeded yet", so the snapshot shows instead of a blank page.
  if (!remote || remote.length === 0) return fallback;
  const parsed = remote.flatMap((doc) => {
    const result = schema.safeParse(doc);
    return result.success ? [result.data] : [];
  });
  if (parsed.length === 0) return fallback;
  return parsed;
}
