import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Big, Bento, Chip, CtaBand, Eyebrow, Faq, Glow, Panel, Section, SectionHeader, Steps, Tile, VersionJump } from "@/components/site/Blocks";
import { JsonLd } from "@/components/site/JsonLd";
import { PlanCard } from "@/components/site/PlanCard";
import { priceText } from "@/components/site/Price";
import { AuditScreen, FloatCard, Marquee, Phone, SprintScreen, sampleAudit } from "@/components/site/Proof";
import { packages, stack } from "@/config/catalog";
import { offers } from "@/config/offers";
import { site } from "@/config/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const audit = priceText("audit");

const faq = [
  { q: "Do I own the code?", a: "Yes. All work happens in your repository from day one." },
  { q: "What if the audit finds nothing serious?", a: "You still get the written report, and it says so. That's a good outcome." },
  {
    q: "How do payments work?",
    a: `Razorpay: UPI, cards or netbanking. The audit is paid upfront; sprints are 50% to start and 50% on release; the retainer is monthly in advance.`,
  },
  { q: "Will you sign an NDA?", a: "Yes — yours or mine, before repo access." },
  { q: "How do we talk?", a: "WhatsApp for daily updates, one call a week, email for anything formal." },
] as const;

// Home (canvas board Main, PRD E1.1–E1.2): hero → marquee → bento → pricing → case → process → FAQ → CTA.
export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: site.name,
          url: site.url,
          email: site.email,
          description: site.tagline,
          areaServed: "Worldwide",
          address: { "@type": "PostalAddress", addressLocality: "Kolkata", addressCountry: "IN" },
          founder: { "@type": "Person", name: site.owner, jobTitle: "Senior Flutter engineer", sameAs: [site.links.linkedin, site.links.github] },
          makesOffer: (["audit", "sprint", "retainer"] as const).map((id) => ({
            "@type": "Offer",
            name: offers[id].name,
            price: offers[id].priceMinor / 100,
            priceCurrency: "INR",
          })),
        }}
      />

      <div className="relative grid items-center gap-10 pt-14 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[900px]:pt-22 min-[900px]:pb-14">
        <Glow className="top-130 -right-50 min-[900px]:top-10 min-[900px]:-right-30" />
        <div className="relative flex flex-col gap-7">
          <Chip dot className="self-start">{site.availability}</Chip>
          <h1 className="text-display-2xl">
            Flutter apps{" "}
            <span aria-hidden className="inline-flex h-[0.72em] translate-y-[-0.06em] items-center gap-2 rounded-pill border border-line-strong bg-paper-sunken px-[0.22em] align-middle">
              <i className="block size-[0.42em] rounded-full bg-brand" />
              <i className="block size-[0.42em] rounded-full bg-saffron" />
            </span>{" "}
            that actually <span className="text-brand">ship.</span>
          </h1>
          <p className="max-w-[46ch] text-body-lg text-ink-muted min-[900px]:text-[20px] min-[900px]:leading-[1.55]">
            Slow, crashing, stuck on an old SDK — or the developer left? I rescue, migrate and release production Flutter apps. Fixed price. You own the code.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className={buttonStyles("primary", "lg")}>
              Book a {audit} audit <Arrow />
            </Link>
            <Link href="/work" className={buttonStyles("outline", "lg")}>
              See the work
            </Link>
          </div>
          <dl className="flex flex-wrap gap-7 pt-2">
            {[
              ["6+ yrs", "production Flutter"],
              ["4 × 160", "pub.dev points"],
              ["4 apps", "live on Play"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col-reverse">
                <dt className="font-mono text-[13px] text-ink-muted">{l}</dt>
                <dd className="text-[28px] leading-none font-semibold tracking-[-0.03em]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div role="img" aria-label="Two phones: a sample audit report and a rescue sprint checklist" className="relative mx-auto h-[560px] w-full max-w-[360px] min-[900px]:mx-0 min-[900px]:h-[620px] min-[900px]:max-w-none">
          <Phone className="top-10 -left-2.5 -rotate-6 min-[900px]:left-10">
            <SprintScreen />
          </Phone>
          <Phone className="top-0 left-[calc(100%-268px)] z-2 rotate-5 min-[900px]:left-65">
            <AuditScreen {...sampleAudit} />
          </Phone>
          <FloatCard className="bottom-7.5 left-0 w-52.5">
            <Eyebrow className="text-[10px]">Delivered in</Eyebrow>
            <div className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em]">{offers.audit.duration}</div>
            <span className="font-mono text-[13px] text-ink-muted">written report + plan</span>
          </FloatCard>
          <FloatCard className="top-37.5 right-0 hidden min-[900px]:block">
            <span className="flex items-center gap-2.5 font-mono text-[13px]">
              <span aria-hidden className="size-2 rounded-full bg-brand" />
              You own the repo
            </span>
          </FloatCard>
        </div>
      </div>

      <div className="mx-[calc(50%-50vw)]">
        <Marquee items={stack} />
      </div>

      <Section aria-labelledby="why">
        <SectionHeader
          id="why"
          eyebrow="01 — Why teams hire me"
          title="Senior Flutter, without the agency overhead."
          aside="Six years shipping fintech, e-commerce, telecom and enterprise apps — architecture to store release."
        />
        <Bento>
          <Tile span={3} tall brand>
            <Eyebrow>What I do</Eyebrow>
            <h3 className="text-[34px]!">Rescue, migrate and ship production Flutter apps.</h3>
            <p>SDK upgrades, crash fixes, clean architecture, CI/CD, Play Store and App Store releases.</p>
            <Big>6+ yrs</Big>
          </Tile>
          <Tile span={3}>
            <Eyebrow>Open source</Eyebrow>
            <h3>{packages.length} packages. Every one 160/160.</h3>
            <div className="mt-auto flex items-end gap-5">
              <div aria-hidden className="grid size-30 place-items-center rounded-full bg-brand">
                <b className="grid size-24 place-items-center rounded-full bg-night text-[24px] font-semibold">160</b>
              </div>
              <p className="font-mono text-[13px]">
                {packages.map((p) => (
                  <span key={p.name} className="block">{p.name}</span>
                ))}
              </p>
            </div>
          </Tile>
          <Tile span={3}>
            <Eyebrow>Built from zero</Eyebrow>
            <h3>An in-house crash reporting platform that replaced a paid SaaS.</h3>
            <pre className="mt-auto rounded-[16px] whitespace-pre-wrap border border-line bg-paper-sunken px-4.5 py-4 font-mono text-[13px] leading-[1.7] text-ink-muted">
              <span className="text-brand">crash</span> → offline queue → <span className="text-brand">sync</span> → dashboard{"\n"}
              <span>no SaaS bill</span>
            </pre>
          </Tile>
          <Tile>
            <Eyebrow>Start here</Eyebrow>
            <Big>{audit}</Big>
            <p className="font-mono text-[13px]">{offers.audit.duration} audit</p>
          </Tile>
          <Tile>
            <Eyebrow>Shipped</Eyebrow>
            <Big>4 apps</Big>
            <p className="font-mono text-[13px]">live on Google Play</p>
          </Tile>
          <Tile>
            <Eyebrow>Domains</Eyebrow>
            <h3>Fintech · e-commerce · telecom · real estate · enterprise</h3>
          </Tile>
        </Bento>
      </Section>

      <Section aria-labelledby="pricing">
        <SectionHeader id="pricing" eyebrow="02 — Pricing" title="Fixed scope. Fixed price." aside={<span className="font-mono text-[13px]">INR · UPI, cards or netbanking</span>} />
        <div className="grid gap-4 min-[900px]:grid-cols-3">
          <PlanCard
            id="audit"
            eyebrow="Start here"
            summary="A written report in 48 hours, with a fixed-price plan."
            points={["Architecture and crash risks", "Performance and SDK debt", "Store compliance gaps", "Credited if you continue"]}
            cta={<Link href="/contact" className={buttonStyles("primary")}>Book audit <Arrow /></Link>}
          />
          <PlanCard
            id="sprint"
            featured
            eyebrow="Most chosen"
            badge={<Chip className="h-6.5 text-[12px]">{offers.sprint.duration}</Chip>}
            summary="A current, stable app released to both stores."
            points={["Flutter and Dart SDK upgrade", "Crash fixes at the root", "CI/CD with GitHub Actions", "Play Store and App Store release", offers.sprint.payment]}
            cta={<Link href="/services#sprint" className={buttonStyles("outline")}>How the sprint works</Link>}
          />
          <PlanCard
            id="retainer"
            eyebrow="Stay healthy"
            summary="Your app stays current while you build the business."
            points={["Up to 8 hours a month", "OS, SDK and policy updates", "One release per month", "Cancel anytime"]}
            cta={<Link href="/services#retainer" className={buttonStyles("outline")}>Retainer details</Link>}
          />
        </div>
      </Section>

      <Section aria-label="Recent work">
        <Panel>
          <div className="relative flex flex-col gap-6">
            <Eyebrow>03 — Recent work · enterprise app</Eyebrow>
            <p className="text-[clamp(96px,14vw,220px)] leading-[0.8] font-semibold tracking-[-0.07em]">0</p>
            <p className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em]">regressions after a two-step Flutter upgrade.</p>
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

      <Section aria-labelledby="process">
        <SectionHeader id="process" eyebrow="04 — Process" title="From repo to release." />
        <Steps
          items={[
            { title: "Book the audit", body: "Pay online, share repo access. NDA on request." },
            { title: "Get the report", body: "In 48 hours: scores, root causes, a fixed price." },
            { title: "Ship the fix", body: "Optional sprint. Daily updates, weekly call." },
            { title: "Stay healthy", body: "Optional retainer keeps it current." },
          ]}
        />
      </Section>

      {/* ponytail: 05 — Clients (quotes) renders once real quotes exist (PRD App. A, A6); no placeholder quotes in public. */}

      <Section>
        <Faq eyebrow="05 — FAQ" title="Questions, answered." items={faq} />
      </Section>

      <Section>
        <CtaBand eyebrow="Ready when you are" title="Send me the repo." body="I'll tell you what's wrong in 48 hours.">
          <Link href="/contact" className={buttonStyles("inverse", "lg")}>
            Book a {audit} audit <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </>
  );
}
