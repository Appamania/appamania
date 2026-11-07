import Image from "next/image";
import Link from "next/link";
import { Chip, Eyebrow } from "@/components/site/Blocks";
import type { AppEntry } from "@/lib/schemas";

/** App teaser card. Icon from Storage when uploaded, else the initial. */
export function AppCard({ app: a }: { app: AppEntry }) {
  return (
    <li className="reveal flex flex-col gap-4 rounded-lg border border-line bg-paper-raised p-5 transition-colors duration-(--dur) hover:border-line-strong">
      <div aria-hidden className="grid aspect-[4/5] place-items-center rounded-md border border-line bg-paper-sunken">
        {a.icon ? (
          <Image
            src={a.icon}
            alt=""
            width={176}
            height={176}
            sizes="176px"
            className="size-22 rounded-md border border-line-strong object-cover"
          />
        ) : (
          <span className="grid size-22 place-items-center rounded-md border border-line-strong bg-paper-raised text-h1">
            {a.initial}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Eyebrow>{a.category}</Eyebrow>
        <Chip className="h-6.5 text-label">{a.badge}</Chip>
      </div>
      <h2 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.03em]">
        <Link href={`/apps/${a.slug}`} className="hover:text-brand">
          {a.name}
        </Link>
      </h2>
      <p className="text-ink-muted">{a.summary}</p>
      <a
        href={a.url}
        className="mt-auto inline-flex min-h-11 items-center font-mono text-[13px] text-brand underline-offset-4 hover:underline"
      >
        Get it on Google Play<span className="sr-only"> ({a.name})</span>
      </a>
    </li>
  );
}
