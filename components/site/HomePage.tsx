import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import {
  Big,
  Bento,
  Chip,
  Code,
  CtaBand,
  Eyebrow,
  Faq,
  Glow,
  Panel,
  Section,
  SectionHeader,
  Steps,
  Tile,
  VersionJump,
} from "@/components/site/Blocks";
import { FounderCard } from "@/components/site/FounderCard";
import { ProofStrip } from "@/components/site/ProofStrip";
import { AuditScreen, FloatCard, Phone, SprintScreen, sampleAudit } from "@/components/site/Proof";
import { Plans } from "@/components/site/Plans";
import { WorkCards } from "@/components/site/WorkCards";
import { homeCopy as copy, proofFacts, steps } from "@/config/home";
import { formatPrice, offers } from "@/config/offers";
import { site } from "@/config/site";
import type { AppEntry, PackageEntry, Work } from "@/lib/schemas";

export function HomePage({ work, packages, apps }: { work: Work[]; packages: PackageEntry[]; apps: AppEntry[] }) {
  const points = packages.map((p) => p.points);
  const min = points.length ? Math.min(...points) : 0;
  const max = points.length ? Math.max(...points) : 0;
  return (
    <>
      <div className="relative grid items-center gap-10 pt-14 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[900px]:pt-22 min-[900px]:pb-14">
        <Glow className="top-130 -right-50 min-[900px]:top-10 min-[900px]:-right-30" />
        <div className="enter relative flex flex-col gap-7">
          <Chip dot className="self-start">
            {site.descriptor} · {site.location}
          </Chip>
          <h1 className="text-display-2xl">
            {copy.hero.before}{" "}
            <span
              aria-hidden
              className="inline-flex h-[0.72em] translate-y-[-0.06em] items-center gap-2 rounded-pill border border-line-strong bg-paper-sunken px-[0.22em] align-middle"
            >
              <i className="block size-[0.42em] rounded-full bg-brand" />
              <i className="block size-[0.42em] rounded-full bg-saffron" />
            </span>{" "}
            {copy.hero.after} <span className="text-brand">{copy.hero.accent}</span>
          </h1>
          <p className="max-w-[46ch] text-body-lg text-ink-muted">{copy.hero.lead}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact?offer=audit"
              data-cta="hero_primary"
              data-offer="audit"
              className={buttonStyles("primary", "lg")}
            >
              {copy.hero.primary} <Arrow />
            </Link>
            <Link href="/work" data-cta="hero_secondary" className={buttonStyles("outline", "lg")}>
              {copy.hero.secondary}
            </Link>
          </div>
        </div>
        <div
          role="img"
          aria-label="Two phones: a written report and a release checklist"
          className="enter relative mx-auto h-[560px] w-full max-w-[360px] min-[900px]:mx-0 min-[900px]:h-[620px] min-[900px]:max-w-none"
        >
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
        <div className="wrap">
          <ProofStrip items={proofFacts({ points, appCount: apps.length })} />
        </div>
      </div>

      <Section aria-labelledby="why">
        <SectionHeader
          id="why"
          eyebrow="01 — What Appamania fixes"
          title="Four problems, one fix list."
          aside="Every job starts with a written audit and ends with a release you can see."
        />
        <Bento>
          <Tile span={3} tall brand>
            <Eyebrow>The work</Eyebrow>
            <h3>Upgrades, crash fixes, and releases.</h3>
            <p>SDK upgrades, root-cause crashes, clean architecture, CI/CD, Play Store and App Store releases.</p>
            <Big>6+ yrs</Big>
          </Tile>
          <Tile
            span={3}
            className="has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand"
          >
            <h3>
              <Link href="/services/flutter-upgrade" className="after:absolute after:inset-0">
                Stuck on an old SDK
              </Link>
            </h3>
            <VersionJump from="Flutter 3.41" to="3.47" />
            <p>Upgrade on a branch, merged when green.</p>
          </Tile>
          <Tile
            span={3}
            className="has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand"
          >
            <h3>
              <Link href="/services/flutter-app-rescue" className="after:absolute after:inset-0">
                Crashes in production
              </Link>
            </h3>
            <Code aria-hidden className="mt-auto whitespace-pre-wrap">
              crash → root cause → fix → release
            </Code>
          </Tile>
          <Tile
            span={2}
            className="has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand"
          >
            <h3>
              <Link href="/services#plans" className="after:absolute after:inset-0">
                No CI, manual releases
              </Link>
            </h3>
            <p>CI/CD on GitHub Actions: tests, builds, signed artifacts.</p>
          </Tile>
          <Tile
            span={2}
            className="has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand"
          >
            <h3>
              <Link href="/services/flutter-app-audit" className="after:absolute after:inset-0">
                Not sure what is wrong
              </Link>
            </h3>
            <p className="font-mono text-small">Audit {formatPrice(offers.audit)}, report in 48 hours.</p>
          </Tile>
          <Tile span={2}>
            <Eyebrow>Domains</Eyebrow>
            <h3>Fintech · e-commerce · telecom · real estate · enterprise</h3>
          </Tile>
        </Bento>
      </Section>

      <Section aria-labelledby="plans">
        <SectionHeader
          id="plans"
          eyebrow="02 — Plans"
          title="Fixed prices. No surprises."
          aside="Audit in 48 hours or it is free. The fee is credited to the sprint."
        />
        <Plans />
      </Section>

      <Section aria-labelledby="how">
        <SectionHeader id="how" eyebrow="03 — How it works" title="Four steps, one owner." />
        <Steps items={steps} />
      </Section>

      {work.length > 0 && (
        <Section aria-labelledby="work">
          <SectionHeader id="work" eyebrow="04 — Work" title="The write-ups." />
          <WorkCards items={work} />
          <div className="mt-4">
            <Panel>
              <div className="relative flex flex-col gap-6">
                <Eyebrow>Recent work · enterprise app</Eyebrow>
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
                <p className="mt-2 text-ink-muted">
                  A production app with live users, upgraded without pausing releases.
                </p>
              </div>
            </Panel>
          </div>
        </Section>
      )}

      {(apps.length > 0 || packages.length > 0) && (
        <Section aria-labelledby="built">
          <SectionHeader id="built" eyebrow="05 — Products" title="Built and run by Appamania." />
          <Bento>
            {apps.length > 0 && (
              <Tile span={apps.length > 0 && packages.length > 0 ? 3 : 6}>
                <Eyebrow>Apps</Eyebrow>
                <h3 className="tabular-nums">
                  {apps.length === 1 ? "1 app on Google Play." : `${apps.length} apps on Google Play.`}
                </h3>
                <p className="font-mono text-small">{apps.map((a) => a.name).join(" · ")}</p>
                <Link href="/apps" className={buttonStyles("outline", "md", "mt-auto self-start")}>
                  See the apps <Arrow />
                </Link>
              </Tile>
            )}
            {packages.length > 0 && (
              <Tile span={apps.length > 0 && packages.length > 0 ? 3 : 6}>
                <Eyebrow>Open source</Eyebrow>
                <h3 className="tabular-nums">
                  {packages.length === 1 ? "1 package on pub.dev." : `${packages.length} packages on pub.dev.`}
                </h3>
                <p className="font-mono text-small tabular-nums">
                  {min === max ? `${max}` : `${min}–${max}`} pub points · {packages.map((p) => p.name).join(" · ")}
                </p>
                <Link href="/open-source" className={buttonStyles("outline", "md", "mt-auto self-start")}>
                  See the packages <Arrow />
                </Link>
              </Tile>
            )}
          </Bento>
        </Section>
      )}

      <Section aria-labelledby="who">
        <SectionHeader id="who" eyebrow="06 — Who runs it" title="Run by the founder." />
        <FounderCard compact />
      </Section>

      <Section>
        <Faq eyebrow="07 — FAQ" title="Questions, answered." items={copy.faq} />
      </Section>

      <Section>
        <CtaBand
          eyebrow="Start"
          title="Send the repo. Get a report."
          body="48 hours, written down, with the top fix first."
        >
          <Link
            href="/contact?offer=audit"
            data-cta="cta_band"
            data-offer="audit"
            className={buttonStyles("inverse", "lg")}
          >
            Book the audit <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </>
  );
}
