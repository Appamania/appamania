import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { CtaBand, PageHero, Section, SectionHeader, Steps } from "@/components/site/Blocks";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FounderCard } from "@/components/site/FounderCard";
import { ProofStrip } from "@/components/site/ProofStrip";
import { Quote } from "@/components/site/Quote";
import { aboutCopy } from "@/config/about";
import { proofFacts } from "@/config/home";
import { formatPrice, offers } from "@/config/offers";
import { site } from "@/config/site";
import { testimonials } from "@/config/proof";
import { getApps, getPackages } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: `About Appamania and founder ${site.owner}` },
  description: `Appamania is a Flutter rescue studio in Kolkata, founded and run by ${site.owner}, a Flutter engineer with 6+ years of production apps. Udyam-registered.`,
  alternates: { canonical: "/about" },
};

// Live pub.dev points.
export const revalidate = 3600;

export default async function About() {
  const [packages, apps] = await Promise.all([getPackages(), getApps()]);
  const points = packages.map((p) => p.points);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <PageHero
        eyebrow={aboutCopy.hero.eyebrow}
        title={aboutCopy.hero.title}
        accent={aboutCopy.hero.accent}
        lead={aboutCopy.hero.lead}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact?offer=audit" className={buttonStyles("primary", "lg")}>
            Book the {formatPrice(offers.audit)} audit <Arrow />
          </Link>
          {site.links.booking && (
            <a href={site.links.booking} className={buttonStyles("outline", "lg")}>
              Book a 20-minute call
            </a>
          )}
        </div>
      </PageHero>

      <Section className="min-[900px]:pt-16">
        <FounderCard />
      </Section>

      <Section aria-labelledby="how">
        <SectionHeader id="how" eyebrow="01 — How Appamania works" title="Principles." />
        <Steps items={aboutCopy.principles} />
      </Section>

      <Section aria-labelledby="record">
        <SectionHeader id="record" eyebrow="02 — The record" title="Checkable facts." />
        <ProofStrip items={proofFacts({ points, appCount: apps.length })} />
      </Section>

      <Section aria-labelledby="details">
        <SectionHeader id="details" eyebrow="03 — Business details" title="Who invoices you." />
        <dl className="grid gap-4 min-[900px]:grid-cols-2">
          {site.legalName && (
            <div className="rounded-md border border-line bg-paper-raised p-6">
              <dt className="font-mono text-small text-ink-muted">Legal name</dt>
              <dd className="text-body-lg">{site.legalName}</dd>
            </div>
          )}
          <div className="rounded-md border border-line bg-paper-raised p-6">
            <dt className="font-mono text-small text-ink-muted">Registration</dt>
            <dd className="text-body-lg">{site.udyam ? `Udyam ${site.udyam}` : "Udyam-registered"}</dd>
          </div>
          {site.location && (
            <div className="rounded-md border border-line bg-paper-raised p-6">
              <dt className="font-mono text-small text-ink-muted">Location</dt>
              <dd className="text-body-lg">{site.location}</dd>
            </div>
          )}
          {site.billing && (
            <div className="rounded-md border border-line bg-paper-raised p-6">
              <dt className="font-mono text-small text-ink-muted">Billing</dt>
              <dd className="text-body-lg">{site.billing}</dd>
            </div>
          )}
        </dl>
      </Section>

      {testimonials.length > 0 && (
        <Section aria-labelledby="quotes">
          <SectionHeader id="quotes" eyebrow="04 — In their words" title="What clients say." />
          <Quote items={testimonials} />
        </Section>
      )}

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
