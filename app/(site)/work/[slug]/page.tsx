import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Bento, Big, Code, CtaBand, Eyebrow, PageHero, Panel, Section, SectionHeader, Steps, Tile, VersionJump } from "@/components/site/Blocks";
import { JsonLd } from "@/components/site/JsonLd";
import { WorkCards } from "@/components/site/WorkCards";
import { site } from "@/config/site";
import { getWork } from "@/lib/content";

export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getWork()).map((w) => ({ slug: w.slug }));
}

async function find(slug: string) {
  return (await getWork()).find((w) => w.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const w = await find((await params).slug);
  return w ? { title: w.meta.teaser.title, description: w.meta.lead, alternates: { canonical: `/work/${w.slug}` } } : {};
}

// Case study (canvas board Work, PRD E1.4): problem, what I did, result with a real number, more work.
export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const all = await getWork();
  const w = all.find((x) => x.slug === slug);
  if (!w) notFound();
  const { meta, Body } = w;
  const others = all.filter((x) => x.slug !== slug);
  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.teaser.title,
          description: meta.lead,
          author: { "@type": "Person", name: site.owner },
          url: `${site.url}/work/${w.slug}`,
        }}
      />
      <PageHero eyebrow={meta.eyebrow} title={meta.title} accent={meta.accent} lead={meta.lead} />
      <Bento className="mt-10">
        {meta.stats.map((s, i) => (
          <Tile key={s.label} brand={i === meta.stats.length - 1} className="min-h-45">
            <Eyebrow>{s.label}</Eyebrow>
            <Big className="text-[56px]!">{s.value}</Big>
          </Tile>
        ))}
      </Bento>

      <Section>
        <div className="grid gap-12 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div>
            <Eyebrow>01 — The problem</Eyebrow>
            <h2 className="mt-3 text-[clamp(36px,4vw,56px)] leading-none font-semibold tracking-[-0.045em]">{meta.problemTitle}</h2>
          </div>
          <div className="flex flex-col gap-5">
            <Body />
          </div>
        </div>
      </Section>

      <Section aria-labelledby="did">
        <SectionHeader id="did" eyebrow="02 — What I did" title={`${["", "", "Two", "Three", "Four"][meta.steps.length]} steps, all reversible.`} />
        <Steps items={meta.steps} />
        {meta.checks && (
          <Code className="mt-4 px-7 py-6 text-[14px]">
            <span className="text-ink-muted"># checks on every pull request</span>
            {meta.checks.map((c) => (
              <span key={c} className="block">
                <span className="k">{c.split(" ")[0]}</span> {c.slice(c.indexOf(" ") + 1)}
              </span>
            ))}
          </Code>
        )}
      </Section>

      <Section aria-label="Result">
        <Panel>
          <div className="relative flex flex-col gap-5">
            <Eyebrow>03 — Result</Eyebrow>
            <p className="text-[clamp(40px,5vw,72px)] leading-[0.95] font-semibold tracking-[-0.05em]">{meta.result.title}</p>
            <p className="text-ink-muted">{meta.result.body}</p>
          </div>
          <div className="relative flex flex-col gap-4">
            {meta.versions.map((v) => (
              <VersionJump key={v.from} from={v.from} to={v.to} />
            ))}
            <p className="mt-2 font-mono text-[13px] text-ink-muted">{meta.stack.join(" · ")}</p>
          </div>
        </Panel>
      </Section>

      {others.length > 0 && (
        <Section aria-labelledby="more">
          <SectionHeader id="more" eyebrow="04 — More work" title="Anonymised by default." />
          <WorkCards items={others} />
        </Section>
      )}

      <Section>
        <CtaBand eyebrow="A question" title="Something in this write-up?" body="Send a note. I read every row.">
          <Link href="/contact" className={buttonStyles("inverse", "lg")}>
            Send a note <Arrow />
          </Link>
        </CtaBand>
      </Section>
    </article>
  );
}
