import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Bento, Code, CtaBand, Eyebrow, PageHero, Panel, Section, SectionHeader, Tile } from "@/components/site/Blocks";
import { Amount, priceText } from "@/components/site/Price";
import { AuditScreen, Phone, sampleAudit } from "@/components/site/Proof";
import { offers } from "@/config/offers";

export const metadata: Metadata = {
  title: "Services and prices",
  description: `Flutter App Health Audit ${priceText("audit")}, Rescue and Migration Sprint ${priceText("sprint")}, Care Retainer ${priceText("retainer")}. Fixed price, you own the code.`,
  alternates: { canonical: "/services" },
};

const audit = priceText("audit");
const h2 = "mt-3 max-w-[16ch] text-[clamp(40px,5vw,72px)] leading-none font-semibold tracking-[-0.045em]";

function OfferHead({ n, id, title, note }: { n: string; id: "sprint" | "retainer"; title: string; note: string }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
      <div>
        <Eyebrow>
          {n} — {offers[id].name}
        </Eyebrow>
        <h2 id={`${id}-h`} className={h2}>
          {title}
        </h2>
      </div>
      <div className="min-[900px]:text-right">
        <Amount id={id} />
        <p className="mt-2 font-mono text-[13px] text-ink-muted">{note}</p>
      </div>
    </div>
  );
}

// Services (canvas board Services, PRD E1.3): three offers, compare table, enquiry line, terms and refunds.
export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Fixed scope. Fixed price."
        accent="Your code."
        lead="Start with a 48-hour audit. If you like the plan, I fix it in a sprint. If you want it to stay healthy, I look after it monthly."
      />

      <Section id="audit" aria-labelledby="audit-h" className="min-[900px]:pt-16">
        <Panel className="min-[900px]:grid-cols-2">
          <div className="relative flex flex-col gap-5">
            <Eyebrow>01 — {offers.audit.name}</Eyebrow>
            <h2 id="audit-h" className="text-[clamp(36px,4vw,60px)] leading-none font-semibold tracking-[-0.045em]">
              A written report in 48 hours.
            </h2>
            <Amount id="audit" />
            <p className="text-ink-muted">
              You share the repo and store listing. I read the code, run it, check crash history and store pages, and send
              the report.
            </p>
            <ul className="grid grid-cols-1 gap-2.5 text-[15px] text-ink-muted sm:grid-cols-2">
              {["Architecture and state", "Crash root causes", "Startup, jank, memory", "Flutter and package debt", "Store compliance", "Fixed-price fix plan"].map(
                (i) => (
                  <li key={i}>· {i}</li>
                ),
              )}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/contact" className={buttonStyles("primary")}>
                Book the audit <Arrow />
              </Link>
              <span className="font-mono text-[13px] text-ink-muted">credited in full if you start a sprint within 30 days</span>
            </div>
          </div>
          <div role="img" aria-label="Sample audit report on a phone" className="relative h-[560px]">
            <Phone className="top-0 left-1/2 -ml-33.5 rotate-3">
              <AuditScreen {...sampleAudit} />
            </Phone>
          </div>
        </Panel>
      </Section>

      <Section id="sprint" aria-labelledby="sprint-h">
        <OfferHead n="02" id="sprint" title="A current, stable app on both stores." note={`${offers.sprint.duration} · 50% / 50%`} />
        <Bento>
          <Tile brand>
            <Eyebrow>Upgrade</Eyebrow>
            <h3>Flutter, Dart, Gradle, Xcode, UIScene, Swift PM.</h3>
          </Tile>
          <Tile>
            <Eyebrow>Stabilise</Eyebrow>
            <h3>Top crashes fixed at the root — not wrapped in try/catch.</h3>
          </Tile>
          <Tile>
            <Eyebrow>Automate</Eyebrow>
            <h3>GitHub Actions: build, test, signed release.</h3>
            <Code className="mt-auto">
              <span className="k">on</span>: push → analyze → test → <span className="s">ship</span>
            </Code>
          </Tile>
          <Tile span={3}>
            <Eyebrow>Ship</Eyebrow>
            <h3>Play Store and App Store submissions handled, review notes answered.</h3>
          </Tile>
          <Tile span={3}>
            <Eyebrow>Communication</Eyebrow>
            <h3>Daily WhatsApp update, weekly call, written handover.</h3>
          </Tile>
        </Bento>
      </Section>

      <Section id="retainer" aria-labelledby="retainer-h">
        <OfferHead n="03" id="retainer" title="Stays current while you build." note="cancel anytime" />
        <div className="grid gap-4 min-[900px]:grid-cols-3">
          {[
            ["8 h", "OS, SDK and package updates before they break the build.", "text-brand"],
            ["1 ×", "Release a month with fixes and small features, both stores.", ""],
            ["0", "Missed store-policy deadlines. Handled before the warning email.", ""],
          ].map(([n, t, c]) => (
            <div key={n} className="flex flex-col gap-3 rounded-lg border border-line bg-paper-raised p-7">
              <span className={`text-[56px] leading-[0.9] font-semibold tracking-[-0.06em] ${c}`}>{n}</span>
              <p className="text-ink-muted">{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section aria-labelledby="compare">
        <SectionHeader id="compare" eyebrow="04 — Compare" title="Side by side." />
        <div className="overflow-x-auto rounded-lg border border-line bg-paper-raised" role="region" aria-label="Offer comparison" tabIndex={0}>
          <table className="w-full min-w-[680px] border-collapse text-[15px] [&_td]:border-t [&_td]:border-line [&_td]:px-4 [&_td]:py-4.5 [&_tbody_th]:border-t [&_tbody_th]:border-line [&_tbody_th]:px-4 [&_tbody_th]:py-4.5">
            <thead>
              <tr className="text-left [&>*]:px-4 [&>*]:py-5">
                <td className="border-t-0!" />
                <th scope="col" className="font-semibold">Audit</th>
                <th scope="col" className="font-semibold text-brand">Sprint</th>
                <th scope="col" className="font-semibold">Retainer</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Price", priceText("audit"), priceText("sprint"), priceText("retainer")],
                ["Time", offers.audit.duration, offers.sprint.duration, offers.retainer.duration],
                ["You get", "Report and fixed-price plan", "Fixed, released app", "A healthy app, kept that way"],
                ["Payment", offers.audit.payment, "50 / 50", offers.retainer.payment],
              ].map(([k, ...v]) => (
                <tr key={k}>
                  <th scope="row" className="text-left font-normal text-ink-muted">
                    {k}
                  </th>
                  {v.map((x, i) => (
                    <td key={i} className={k === "Price" ? "font-mono tabular-nums" : undefined}>
                      {x}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[13px] text-ink-muted">
          Also: MVP builds {priceText("mvp")} · business websites {priceText("website")} ·{" "}
          <Link href="/contact" className="text-brand underline underline-offset-4">
            enquire
          </Link>
        </p>
      </Section>

      <Section aria-labelledby="terms">
        <SectionHeader id="terms" eyebrow="05 — Terms" title="The fine print, in plain words." />
        <div className="grid gap-4 min-[900px]:grid-cols-2">
          <div className="rounded-lg border border-line bg-paper-raised p-7">
            <h3 className="text-h3">How we work</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted marker:text-brand">
              <li>Fixed price against a written scope. Anything outside it is a change request, quoted before work starts.</li>
              <li>All work happens in your repository. Code and IP are yours on payment.</li>
              <li>You own every account (stores, Firebase, Supabase). I&apos;m invited as a member.</li>
              <li>NDA on request, before repo access.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-paper-raised p-7">
            <h3 className="text-h3">Refunds</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted marker:text-brand">
              <li>Audit: full refund if you cancel before work starts.</li>
              <li>Sprint: pro-rata refund for milestones not yet delivered.</li>
              <li>Retainer: cancel anytime; the current month runs to its end.</li>
            </ul>
            <Link href="/legal/refunds" className="mt-4 inline-block text-brand underline underline-offset-4">
              Full refund and cancellation policy
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <CtaBand eyebrow="Not sure which?" title="Start with the audit." body="I'll tell you what's wrong in 48 hours.">
          <Link href="/contact" className={buttonStyles("inverse", "lg")}>
            Book a {audit} audit <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </>
  );
}
