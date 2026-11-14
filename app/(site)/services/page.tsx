import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Chip, CtaBand, Eyebrow, Faq, PageHero, Section, SectionHeader, Steps } from "@/components/site/Blocks";
import { JsonLd } from "@/components/site/JsonLd";
import { Plans } from "@/components/site/Plans";
import { steps } from "@/config/home";
import { landingSlugs, landings } from "@/config/landing";
import { formatPrice, offers, type Offer } from "@/config/offers";
import { site } from "@/config/site";
import { faqJsonLd, orgId, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Flutter services and fixed prices",
  description: `Flutter app audit ${formatPrice(offers.audit)} in 48 hours, rescue sprint ${formatPrice(offers.sprint)}, care retainer ${formatPrice(offers.retainer)}. Fixed prices in INR from a Udyam-registered business.`,
  path: "/services",
});

const faq = [
  {
    q: "Why start with a paid audit?",
    a: `It makes the quote honest. Appamania reads the code before it names a price, and the ${formatPrice(offers.audit)} is credited to the sprint.`,
  },
  {
    q: "How do you bill?",
    a: "Invoice from a Udyam-registered business. Bank transfer or UPI in INR. USD on request for teams outside India.",
  },
  {
    q: "Who owns the code?",
    a: "You do, from the first commit. Work happens in your repo or moves there at hand-over.",
  },
  {
    q: "What if the app is not Flutter?",
    a: "Native Android and iOS apps moving to Flutter are a fit. Other stacks are not.",
  },
  { q: "Can you work with my team?", a: "Yes. Sprints run on your repo and CI, with your reviewers on every PR." },
] as const;

export default function Services() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "@id": `${site.url}/services#service`,
          name: site.name,
          url: `${site.url}/services`,
          provider: { "@id": orgId },
          makesOffer: (Object.values(offers) as Offer[]).map((o) => ({
            "@type": "Offer",
            name: o.name,
            description: o.fit,
            ...(o.per
              ? {
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: o.priceMinor / 100,
                    priceCurrency: "INR",
                    unitText: "MONTH",
                  },
                }
              : o.from
                ? {
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      minPrice: o.priceMinor / 100,
                      priceCurrency: "INR",
                    },
                  }
                : { price: o.priceMinor / 100, priceCurrency: "INR" }),
          })),
        }}
      />
      <PageHero
        eyebrow="Services"
        title="Read first."
        accent="Fixed price."
        lead="Every engagement starts with code Appamania has read and ends with a release you can see."
      >
        <div className="flex flex-col gap-5">
          <Link
            href="/contact?offer=audit"
            data-cta="services_primary"
            data-offer="audit"
            className={buttonStyles("primary", "lg", "self-start")}
          >
            Book the {formatPrice(offers.audit)} audit <Arrow />
          </Link>
          <ul className="flex flex-wrap gap-2">
            {["Udyam-registered", "Invoiced in INR", "You own the code", offers.audit.guarantee]
              .filter(Boolean)
              .map((c) => (
                <li key={c}>
                  <Chip>{c}</Chip>
                </li>
              ))}
          </ul>
        </div>
      </PageHero>
      <Section aria-labelledby="plans" className="min-[900px]:pt-16">
        <SectionHeader
          id="plans"
          eyebrow="01 — Plans"
          title="Pick the size of the problem."
          aside="Prices are fixed before work starts. Scope changes get a written quote, not a surprise."
        />
        <Plans detail />
      </Section>
      <Section aria-labelledby="problems">
        <SectionHeader id="problems" eyebrow="02 — Common problems" title="Which problem is yours?" />
        <ul className="grid gap-4 min-[900px]:grid-cols-3">
          {landingSlugs.map((slug) => {
            const l = landings[slug];
            return (
              <li key={slug} className="reveal">
                <Link
                  href={`/services/${slug}`}
                  className="flex h-full flex-col gap-4.5 rounded-lg border border-line bg-paper-raised p-8 transition-[transform,box-shadow] duration-(--dur) hover:-translate-y-0.5 hover:shadow-card"
                >
                  <Eyebrow>{l.eyebrow}</Eyebrow>
                  <h3 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.02em]">
                    {l.h1} <span className="text-brand">{l.accent}</span>
                  </h3>
                  <p className="text-ink-muted">{l.lead}</p>
                  <span className="mt-auto font-mono text-[13px] text-brand">See the service</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
      <Section aria-labelledby="how">
        <SectionHeader id="how" eyebrow="03 — How it works" title="Four steps, one owner." />
        <Steps items={steps} />
      </Section>
      <JsonLd data={faqJsonLd(faq)} />
      <Section>
        <Faq eyebrow="04 — FAQ" title="Money, code, and fit." items={faq} />
      </Section>
      <Section>
        <CtaBand eyebrow="Start" title="Send the repo." body="One form, one working day, one honest answer.">
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
