import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Chip, Code, CtaBand, PageHero, Section, SectionHeader } from "@/components/site/Blocks";
import { pubUrl } from "@/config/catalog";
import { site } from "@/config/site";
import { getPackages } from "@/lib/content";
import { cx } from "@/lib/cx";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Open source",
  description: "Flutter and Dart packages from a pub.dev verified publisher under appamania.in.",
  alternates: { canonical: "/open-source" },
};

export default async function OpenSource() {
  const packages = await getPackages();
  const featured = packages[0];
  if (!featured) {
    return (
      <PageHero eyebrow="Open source" title="No packages yet.">
        <Link href="/contact" className={buttonStyles("outline")}>
          Send a note
        </Link>
      </PageHero>
    );
  }
  return (
    <>
      <div className="relative grid items-center gap-10 pt-14 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[900px]:pt-22 min-[900px]:pb-14">
        <div className="relative flex flex-col gap-6">
          <Chip dot className="self-start">pub.dev verified publisher · appamania.in</Chip>
          <h1 className="text-display-2xl">
            <Link href={`/open-source/${featured.slug}`}>{featured.name}</Link>
          </h1>
          <p className="max-w-[46ch] text-body-lg text-ink-muted">{featured.summary}</p>
          <div className="flex flex-wrap gap-3">
            <a href={pubUrl(featured.name)} className={buttonStyles("primary")}>
              View on pub.dev <Arrow />
            </a>
            <a href={site.links.github} className={buttonStyles("outline")}>
              View on GitHub
            </a>
          </div>
          <dl className="flex flex-wrap gap-7 pt-2">
            {[[String(featured.points), "pub points"]].map(([v, l]) => (
              <div key={l} className="flex flex-col-reverse">
                <dt className="font-mono text-small text-ink-muted">{l}</dt>
                <dd className="text-h2 tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Code className="relative p-7 text-code">
          <span className="text-ink-muted"># pubspec.yaml</span>
          {"\n"}dependencies:{"\n"}  <span className="k">{featured.name}</span>:
        </Code>
      </div>

      <Section aria-labelledby="all">
        <SectionHeader id="all" eyebrow="01 — All packages" title={`${packages.length} packages on pub.dev.`} />
        <ul className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
          {packages.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/open-source/${p.slug}`}
                className={cx(
                  "flex min-h-55 flex-col gap-3 rounded-lg border p-7 transition-transform duration-(--dur) hover:-translate-y-0.5",
                  i === 0 ? "border-brand bg-brand text-on-brand" : "border-line bg-paper-raised",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-body font-medium">{p.name}</span>
                  <span className={cx("rounded-pill border px-3 py-1 font-mono text-label tabular-nums", i === 0 ? "border-on-brand/30" : "border-line-strong text-ink-muted")}>
                    {p.points} / 160
                  </span>
                </div>
                <p className={i === 0 ? undefined : "text-ink-muted"}>{p.summary}</p>
                <span className={cx("mt-auto font-mono text-small", i === 0 ? undefined : "text-brand")}>Read the package</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <CtaBand eyebrow="A question" title="Something about a package?" body="Send a note. I read every one.">
          <Link href="/contact" className={buttonStyles("inverse", "lg")}>
            Send a note <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </>
  );
}
