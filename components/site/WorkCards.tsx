import Link from "next/link";
import type { Work } from "@/lib/schemas";
import { Eyebrow } from "./Blocks";

/** Case-study teaser cards (canvas Work "More work"). Whole card is the link. */
export function WorkCards({ items }: { items: Work[] }) {
  return (
    <ul className="grid gap-4 min-[900px]:grid-cols-3">
      {items.map((w) => (
        <li key={w.slug}>
          <Link
            href={`/work/${w.slug}`}
            className="flex h-full flex-col gap-4.5 rounded-lg border border-line bg-paper-raised p-8 transition-[transform,box-shadow] duration-(--dur) hover:-translate-y-0.5 hover:shadow-card"
          >
            <Eyebrow>{w.teaser.label}</Eyebrow>
            <h3 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.02em]">{w.teaser.title}</h3>
            <p className="text-ink-muted">{w.teaser.summary}</p>
            <span className="mt-auto font-mono text-[13px] text-brand">Read the case study</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
