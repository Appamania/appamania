import type { Metadata } from "next";
import { PageHero, Section } from "@/components/site/Blocks";
import { WorkCards } from "@/components/site/WorkCards";
import { getWork } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Flutter migrations, crash fixes and internal platforms. Names stay off the page unless someone asked to be named.",
  alternates: { canonical: "/work" },
};

export default async function WorkIndex() {
  const work = await getWork();
  return (
    <>
      <PageHero eyebrow="Work" title="Real apps, real deadlines." accent="Anonymised by default." lead="Migrations, crash fixes, and platforms built from zero. Names stay off the page unless someone asked to be named." />
      <Section className="min-[900px]:pt-16">
        <WorkCards items={work} />
      </Section>
    </>
  );
}
