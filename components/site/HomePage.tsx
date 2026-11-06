"use client";

import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Big, Bento, CtaBand, Eyebrow, Faq, Glow, Panel, Section, SectionHeader, Tile, VersionJump } from "@/components/site/Blocks";
import { AuditScreen, FloatCard, Marquee, Phone, SprintScreen, sampleAudit } from "@/components/site/Proof";
import { WorkCards } from "@/components/site/WorkCards";
import { useHomeCopy } from "@/components/site/Remote";
import type { PackageEntry, Work } from "@/lib/store";

export function HomePage({ work, packages, appCount }: { work: Work[]; packages: PackageEntry[]; appCount: number }) {
  const copy = useHomeCopy();
  const points = packages.map((p) => p.points);
  const min = points.length ? Math.min(...points) : 0;
  const max = points.length ? Math.max(...points) : 0;
  return (
    <>
      <div className="relative grid items-center gap-10 pt-14 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[900px]:pt-22 min-[900px]:pb-14">
        <Glow className="top-130 -right-50 min-[900px]:top-10 min-[900px]:-right-30" />
        <div className="relative flex flex-col gap-7">
          <h1 className="text-display-2xl">
            {copy.hero.before}{" "}
            <span aria-hidden className="inline-flex h-[0.72em] translate-y-[-0.06em] items-center gap-2 rounded-pill border border-line-strong bg-paper-sunken px-[0.22em] align-middle">
              <i className="block size-[0.42em] rounded-full bg-brand" />
              <i className="block size-[0.42em] rounded-full bg-saffron" />
            </span>{" "}
            {copy.hero.after} <span className="text-brand">{copy.hero.accent}</span>
          </h1>
          <p className="max-w-[46ch] text-body-lg text-ink-muted">{copy.hero.lead}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/work" className={buttonStyles("primary", "lg")}>
              {copy.hero.primary} <Arrow />
            </Link>
            <Link href="/contact" className={buttonStyles("outline", "lg")}>
              {copy.hero.secondary}
            </Link>
          </div>
          <dl className="flex flex-wrap gap-7 pt-2">
            {copy.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="font-mono text-small text-ink-muted">{s.label}</dt>
                <dd className="text-h2 tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div role="img" aria-label="Two phones: a written report and a release checklist" className="relative mx-auto h-[560px] w-full max-w-[360px] min-[900px]:mx-0 min-[900px]:h-[620px] min-[900px]:max-w-none">
          <Phone className="top-10 -left-2.5 -rotate-6 min-[900px]:left-10">
            <SprintScreen />
          </Phone>
          <Phone className="top-0 left-[calc(100%-268px)] z-2 rotate-5 min-[900px]:left-65">
            <AuditScreen {...sampleAudit} />
          </Phone>
          <FloatCard className="bottom-7.5 left-0 w-52.5">
            <Eyebrow>{copy.floats.upgradeEyebrow}</Eyebrow>
            <div className="text-h1 tabular-nums">{copy.floats.upgradeValue}</div>
            <span className="font-mono text-small text-ink-muted">{copy.floats.upgradeCaption}</span>
          </FloatCard>
          <FloatCard className="top-37.5 right-0 hidden min-[900px]:block">
            <span className="flex items-center gap-2.5 font-mono text-small">
              <span aria-hidden className="size-2 rounded-full bg-brand" />
              {copy.floats.ci}
            </span>
          </FloatCard>
        </div>
      </div>

      <div className="mx-[calc(50%-50vw)]">
        <Marquee items={copy.stack} />
      </div>

      <Section aria-labelledby="why">
        <SectionHeader
          id="why"
          eyebrow="01 — What I ship"
          title="Production Flutter, written down."
          aside="Six years on fintech, e-commerce, telecom and enterprise apps — architecture through store release."
        />
        <Bento>
          <Tile span={3} tall brand>
            <Eyebrow>The work</Eyebrow>
            <h3 className="text-h1">Migrations, crash fixes, and releases.</h3>
            <p>SDK upgrades, root-cause crashes, clean architecture, CI/CD, Play Store and App Store releases.</p>
            <Big>6+ yrs</Big>
          </Tile>
          <Tile span={3}>
            <Eyebrow>Open source</Eyebrow>
            <h3 className="tabular-nums">
              {packages.length} packages. Scores {min}–{max}.
            </h3>
            <div className="mt-auto flex items-end gap-5">
              <div aria-hidden className="grid size-30 place-items-center rounded-full bg-brand">
                <b className="grid size-24 place-items-center rounded-full bg-night text-h2 tabular-nums">{max}</b>
              </div>
              <p className="font-mono text-small">
                {packages.map((p) => (
                  <span key={p.name} className="block">
                    {p.name}
                  </span>
                ))}
              </p>
            </div>
          </Tile>
          <Tile span={3}>
            <Eyebrow>Built from zero</Eyebrow>
            <h3>An in-house crash reporting platform that replaced a paid SaaS.</h3>
            <pre className="mt-auto rounded-md whitespace-pre-wrap border border-line bg-paper-sunken px-4.5 py-4 font-mono text-code leading-[1.7] text-ink-muted">
              <span className="text-brand">crash</span> → offline queue → <span className="text-brand">sync</span> → dashboard{"\n"}
              <span>no SaaS bill</span>
            </pre>
          </Tile>
          <Tile>
            <Eyebrow>Shipped</Eyebrow>
            <Big>{appCount} apps</Big>
            <p className="font-mono text-small">live on Google Play</p>
          </Tile>
          <Tile>
            <Eyebrow>Domains</Eyebrow>
            <h3>Fintech · e-commerce · telecom · real estate · enterprise</h3>
          </Tile>
        </Bento>
      </Section>

      <Section aria-labelledby="work">
        <SectionHeader id="work" eyebrow="02 — Work" title="The write-ups." />
        <WorkCards items={work} />
      </Section>

      <Section aria-label="Recent work">
        <Panel>
          <div className="relative flex flex-col gap-6">
            <Eyebrow>03 — Recent work · enterprise app</Eyebrow>
            <p className="text-[clamp(96px,14vw,220px)] leading-[0.8] font-semibold tracking-[-0.07em]">0</p>
            <p className="text-h1">regressions after a two-step Flutter upgrade.</p>
            <Link href="/work/flutter-3-47-upgrade" className={buttonStyles("outline", "md", "self-start")}>
              Read the case study <Arrow />
            </Link>
          </div>
          <div className="relative flex flex-col gap-5">
            <VersionJump from="Flutter 3.41" to="3.47" />
            <VersionJump from="CocoaPods" to="Swift PM" />
            <VersionJump from="AppDelegate" to="UIScene" />
            <p className="mt-2 text-ink-muted">A production app with live users, upgraded without pausing releases.</p>
          </div>
        </Panel>
      </Section>

      <Section>
        <Faq eyebrow="04 — FAQ" title="Questions, answered." items={copy.faq} />
      </Section>

      <Section>
        <CtaBand eyebrow="The rest is on the site" title="Read the work, or send a note." body="Case studies, Play apps, and the pub.dev packages.">
          <Link href="/contact" className={buttonStyles("inverse", "lg")}>
            Send a note <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </>
  );
}
