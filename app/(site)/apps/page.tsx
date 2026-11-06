import type { Metadata } from "next";
import Link from "next/link";
import { Chip, Eyebrow, PageHero, Section } from "@/components/site/Blocks";
import { InDevelopment } from "@/components/site/InDevelopment";
import { getApps } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apps",
  description: "Small Flutter apps on Google Play, built and shipped by Appamania.",
  alternates: { canonical: "/apps" },
};

export default async function Apps() {
  const apps = await getApps();
  return (
    <>
      <PageHero
        eyebrow="Apps"
        title="Products I build and"
        accent="ship myself."
        lead="Small Flutter apps on Google Play, built and shipped from Kolkata."
      />
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 min-[900px]:grid-cols-4">
        {apps.map((a) => (
          <li key={a.slug} className="flex flex-col gap-4 rounded-lg border border-line bg-paper-raised p-5">
            <div aria-hidden className="grid aspect-[4/5] place-items-center rounded-md border border-line bg-paper-sunken">
              <span className="grid size-22 place-items-center rounded-[24px] border border-line-strong bg-paper-raised text-[34px] font-semibold">{a.initial}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Eyebrow>{a.category}</Eyebrow>
              <Chip className="h-6.5 text-[12px]">{a.badge}</Chip>
            </div>
            <h2 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.03em]">
              <Link href={`/apps/${a.slug}`} className="hover:text-brand">
                {a.name}
              </Link>
            </h2>
            <p className="text-ink-muted">{a.summary}</p>
            <a href={a.url} className="mt-auto inline-flex min-h-11 items-center font-mono text-[13px] text-brand underline-offset-4 hover:underline">
              Get it on Google Play<span className="sr-only"> ({a.name})</span>
            </a>
          </li>
        ))}
      </ul>
      <Section aria-labelledby="dev">
        <InDevelopment />
      </Section>
    </>
  );
}
