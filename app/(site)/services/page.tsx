import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { CtaBand, Faq, PageHero, Section, SectionHeader, Steps } from "@/components/site/Blocks";
import { JsonLd } from "@/components/site/JsonLd";
import { Plans } from "@/components/site/Plans";
import { formatPrice, offers, type Offer } from "@/config/offers";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Services and prices",
  description: `Flutter app audit for ${formatPrice(offers.audit)} in 48 hours. Rescue and migration sprints, care retainers, and MVP builds at fixed prices.`,
  alternates: { canonical: "/services" },
};

const steps = [
  { title: "Audit", body: "Send the repo or the APK. In 48 hours you get a written report with the top fix first." },
  { title: "Quote", body: "The report ends in a fixed price and a dated plan. No hourly meter." },
  { title: "Build", body: "Work happens on a branch with CI. You see every PR and every build." },
  { title: "Release", body: "Signed builds go to both stores. Hand-over notes. You own the code." },
] as const;

const faq = [
  { q: "Why start with a paid audit?", a: `It makes the quote honest. I read the code before I name a price, and the ${formatPrice(offers.audit)} is credited to the sprint.` },
  { q: "How do you bill?", a: "Invoice from a Udyam-registered business. Bank transfer or UPI in INR. USD on request for teams outside India." },
  { q: "Who owns the code?", a: "You do, from the first commit. Work happens in your repo or moves there at hand-over." },
  { q: "What if the app is not Flutter?", a: "Native Android and iOS apps moving to Flutter are a fit. Other stacks are not." },
  { q: "Can you work with my team?", a: "Yes. Sprints run on your repo and CI, with your reviewers on every PR." },
] as const;

export default function Services() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: site.name,
          url: `${site.url}/services`,
          areaServed: "IN",
          priceRange: "₹₹",
          makesOffer: (Object.values(offers) as Offer[]).map((o) => ({
            "@type": "Offer",
            name: o.name,
            description: o.fit,
            ...(o.from
              ? { priceSpecification: { "@type": "PriceSpecification", minPrice: o.priceMinor / 100, priceCurrency: "INR" } }
              : { price: o.priceMinor / 100, priceCurrency: "INR" }),
          })),
        }}
      />
      <PageHero eyebrow="Services" title="Fixed price." accent="Written report. Shipped." lead="Three ways to work with me on a Flutter app. Every one starts with code I have read and ends with a release you can see.">
        <Link href="/contact?offer=audit" className={buttonStyles("primary", "lg", "self-start")}>
          Book the {formatPrice(offers.audit)} audit <Arrow />
        </Link>
      </PageHero>
      <Section aria-labelledby="plans" className="min-[900px]:pt-16">
        <SectionHeader id="plans" eyebrow="01 — Plans" title="Pick the size of the problem." aside="Prices are fixed before work starts. Scope changes get a written quote, not a surprise." />
        <Plans detail />
      </Section>
      <Section aria-labelledby="how">
        <SectionHeader id="how" eyebrow="02 — How it works" title="Four steps, one owner." />
        <Steps items={steps} />
      </Section>
      <Section>
        <Faq eyebrow="03 — FAQ" title="Money, code, and fit." items={faq} />
      </Section>
      <Section>
        <CtaBand eyebrow="Start" title="Send the repo." body="One form, one working day, one honest answer.">
          <Link href="/contact?offer=audit" className={buttonStyles("inverse", "lg")}>
            Book the audit <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </>
  );
}
