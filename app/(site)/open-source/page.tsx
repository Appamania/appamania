import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Chip, Code, CtaBand, Section, SectionHeader } from "@/components/site/Blocks";
import { priceText } from "@/components/site/Price";
import { packages, pubUrl } from "@/config/catalog";
import { site } from "@/config/site";
import { cx } from "@/lib/cx";

export const metadata: Metadata = {
  title: "Open source",
  description: "Flutter and Dart packages from a pub.dev verified publisher. Every one 160/160 pub points.",
  alternates: { canonical: "/open-source" },
};

// Open source (canvas board OpenSource, PRD E1.5): featured package + all packages.
export default function OpenSource() {
  return (
    <>
      <div className="relative grid items-center gap-10 pt-14 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[900px]:pt-22 min-[900px]:pb-14">
        <div className="relative flex flex-col gap-6">
          <Chip dot className="self-start">pub.dev verified publisher · appamania.in</Chip>
          <h1 className="text-display-2xl">envified</h1>
          <p className="max-w-[46ch] text-body-lg text-ink-muted">
            Runtime environment switching for Flutter. Swap dev and prod without rebuilding — SHA-256 integrity checks, biometric gating, zero production overhead.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={pubUrl("envified")} className={buttonStyles("primary")}>View on pub.dev <Arrow /></a>
            <a href={site.links.github} className={buttonStyles("outline")}>GitHub</a>
          </div>
          <dl className="flex flex-wrap gap-7 pt-2">
            {[["160", "pub points"], ["MIT", "license"]].map(([v, l]) => (
              <div key={l} className="flex flex-col-reverse">
                <dt className="font-mono text-[13px] text-ink-muted">{l}</dt>
                <dd className="text-[28px] leading-none font-semibold tracking-[-0.03em]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Code className="relative p-7 text-[15px]">
          <span className="text-ink-muted"># pubspec.yaml</span>
          {"\n"}dependencies:{"\n"}  <span className="k">envified</span>: <span className="s">^3.0.0</span>
        </Code>
      </div>

      <Section aria-labelledby="all">
        <SectionHeader id="all" eyebrow="01 — All packages" title={`${packages.length} packages. Every one 160/160.`} />
        <ul className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
          {packages.map((p, i) => (
            <li key={p.name}>
              <a
                href={pubUrl(p.name)}
                className={cx(
                  "flex min-h-55 flex-col gap-3 rounded-lg border p-7 transition-transform duration-(--dur) hover:-translate-y-0.5",
                  i === 0 ? "border-brand bg-brand text-on-brand" : "border-line bg-paper-raised",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[16px] font-medium">{p.name}</span>
                  <span className={cx("rounded-pill border px-3 py-1 font-mono text-[12px]", i === 0 ? "border-on-brand/30" : "border-line-strong text-ink-muted")}>
                    {p.points} / 160
                  </span>
                </div>
                <p className={i === 0 ? undefined : "text-ink-muted"}>{p.summary}</p>
                <span className={cx("mt-auto font-mono text-[13px]", i === 0 ? undefined : "text-brand")}>pub.dev</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <CtaBand eyebrow="Same standards" title="Your codebase next." body="Tested, documented, analyzer-clean. Start with a 48-hour audit.">
          <Link href="/contact" className={buttonStyles("inverse", "lg")}>
            Book a {priceText("audit")} audit <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </>
  );
}
