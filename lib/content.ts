import "server-only";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import { z } from "zod";

// Case studies as MDX (PRD §9, E1.4). Each file exports `meta` (validated: a bad file fails the build);
// the MDX body is the "problem" prose. Clients are described generically unless they agreed to be named.
const WorkMeta = z.object({
  eyebrow: z.string(), // "Case study · enterprise · migration"
  title: z.string(),
  accent: z.string(), // brand-coloured end of the headline
  lead: z.string(),
  teaser: z.object({ label: z.string(), title: z.string(), summary: z.string() }),
  stats: z.array(z.object({ label: z.string(), value: z.string() })).length(3), // last one renders on brand
  problemTitle: z.string(),
  steps: z.array(z.object({ title: z.string(), body: z.string() })).min(2).max(4),
  checks: z.array(z.string()).optional(), // CI commands shown under the steps
  result: z.object({ title: z.string(), body: z.string() }),
  versions: z.array(z.object({ from: z.string(), to: z.string() })),
  stack: z.array(z.string()).min(1),
  order: z.number(),
});

export type WorkMeta = z.infer<typeof WorkMeta>;
export type Work = { slug: string; meta: WorkMeta; Body: ComponentType };

export async function getWork(): Promise<Work[]> {
  const slugs = readdirSync(join(process.cwd(), "content", "work"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -4));
  const all = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/work/${slug}.mdx`);
      const r = WorkMeta.safeParse(mod.meta);
      if (!r.success) throw new Error(`content/work/${slug}.mdx: ${z.prettifyError(r.error)}`);
      return { slug, meta: r.data, Body: mod.default as ComponentType };
    }),
  );
  return all.sort((a, b) => a.meta.order - b.meta.order);
}
