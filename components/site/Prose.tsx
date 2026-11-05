import type { ReactNode } from "react";
import { Eyebrow } from "./Blocks";

/** Legal page frame: readable measure, token prose (PRD E1.7). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="max-w-[68ch] pt-14 min-[900px]:pt-24">
      <Eyebrow>Legal · updated {updated}</Eyebrow>
      <h1 className="mt-3 text-display">{title}</h1>
      <div className="mt-8 flex flex-col gap-4 text-ink-muted [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-6 [&_h2]:text-h2 [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-brand">
        {children}
      </div>
    </article>
  );
}
