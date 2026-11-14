import { Arrow, buttonStyles } from "@/components/ui/Button";
import Link from "next/link";
import { CtaBand, PageHero, Section } from "@/components/site/Blocks";
import { WorkCards } from "@/components/site/WorkCards";
import { getWork } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Flutter case studies: upgrades and rescues",
  description:
    "Flutter SDK migrations, a Flutter 2 to 3 move for a telecom app, and an in-house crash platform. Anonymised by default, with the steps and results.",
  path: "/work",
  rootImage: true,
});

export default async function WorkIndex() {
  const work = await getWork();
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Real apps, real deadlines."
        accent="Anonymised by default."
        lead="Migrations, crash fixes, and platforms built from zero. Names stay off the page unless someone asked to be named."
      />
      {work.length > 0 ? (
        <Section className="min-[900px]:pt-16">
          <WorkCards items={work} />
        </Section>
      ) : (
        <Section className="min-[900px]:pt-16">
          <p className="text-ink-muted">No case studies yet.</p>
          <Link href="/contact" className={buttonStyles("outline", "md", "mt-6 self-start")}>
            Send a note
          </Link>
        </Section>
      )}
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
