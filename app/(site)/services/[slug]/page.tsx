import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand, Faq, PageHero, Section, SectionHeader, Steps } from "@/components/site/Blocks";
import { JsonLd } from "@/components/site/JsonLd";
import { Plans } from "@/components/site/Plans";
import { WorkCards } from "@/components/site/WorkCards";
import { steps } from "@/config/home";
import { landingSlugs, landings, type LandingSlug } from "@/config/landing";
import { formatPrice, offers } from "@/config/offers";
import { getWork } from "@/lib/content";
import { faqJsonLd, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return landingSlugs.map((slug) => ({ slug }));
}

function find(slug: string) {
  return landingSlugs.includes(slug as LandingSlug) ? landings[slug as LandingSlug] : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = find(slug);
  return l ? pageMeta({ title: l.title, description: l.description, path: `/services/${l.slug}` }) : {};
}

export default async function ServiceLanding({ params }: { params: Promise<{ slug: string }> }) {
  const l = find((await params).slug);
  if (!l) notFound();
  const work = (await getWork()).filter((w) => w.slug === l.caseStudy);
  let n = 0;
  const num = (label: string) => `${String(++n).padStart(2, "0")} — ${label}`;
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: l.eyebrow, href: `/services/${l.slug}` },
        ]}
      />
      <PageHero eyebrow={l.eyebrow} title={l.h1} accent={l.accent} lead={l.lead}>
        <Link
          href={`/contact?offer=${l.offer}`}
          data-cta="landing_primary"
          data-offer={l.offer}
          className={buttonStyles("primary", "lg", "self-start")}
        >
          Book the {formatPrice(offers[l.offer])} audit <Arrow />
        </Link>
      </PageHero>

      <Section aria-labelledby="signs">
        <SectionHeader id="signs" eyebrow={num("Signs you need this")} title="Does this sound like your app?" />
        <ul className="flex flex-col gap-3 text-body-lg">
          {l.signs.map((s) => (
            <li key={s} className="flex gap-2.5">
              <Check aria-hidden className="mt-1.5 size-4 shrink-0 text-brand" />
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="how">
        <SectionHeader id="how" eyebrow={num("What happens")} title="Four steps, one owner." />
        <Steps items={steps} />
      </Section>

      {work.length > 0 && (
        <Section aria-labelledby="proof">
          <SectionHeader id="proof" eyebrow={num("Proof")} title="The closest case study." />
          <WorkCards items={work} />
        </Section>
      )}

      <Section aria-labelledby="price">
        <SectionHeader id="price" eyebrow={num("Price")} title="Fixed prices." />
        <Plans ids={["audit", "sprint"]} />
      </Section>

      <JsonLd data={faqJsonLd(l.faq)} />
      <Section>
        <Faq eyebrow={num("FAQ")} title="Questions, answered." items={l.faq} />
      </Section>

      <Section>
        <CtaBand eyebrow="Start" title="Send the repo." body="One form, one working day, one honest answer.">
          <Link
            href={`/contact?offer=${l.offer}`}
            data-cta="cta_band"
            data-offer={l.offer}
            className={buttonStyles("inverse", "lg")}
          >
            Book the audit <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </>
  );
}
