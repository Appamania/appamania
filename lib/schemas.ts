import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const paragraphs = z.array(z.string().min(1));
/** Repo file under public/media/. Local paths only, so a bad row cannot point next/image or <video> elsewhere. */
const media = z
  .string()
  .regex(/^\/media\/[A-Za-z0-9._/-]*[A-Za-z0-9]$/)
  .refine((s) => !s.includes("..") && !s.includes("//"));

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
