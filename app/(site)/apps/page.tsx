import type { Metadata } from "next";
import { AppCard } from "@/components/site/AppCard";
import { PageHero, Section } from "@/components/site/Blocks";
import { InDevelopment } from "@/components/site/InDevelopment";
import { getApps } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Apps",
  description: "Small Flutter apps on Google Play, built and shipped by Appamania.",
  alternates: { canonical: "/apps" },
};

export default async function Apps() {
  const apps = await getApps();
  return (
    <>
      <PageHero
        eyebrow="Apps"
        title="Products I build and"
        accent="ship myself."
        lead="Small Flutter apps on Google Play, built and shipped from Kolkata."
      />
      <ul className="mt-10 grid grid-cols-1 gap-4 min-[900px]:grid-cols-4 sm:grid-cols-2">
        {apps.map((a) => (
          <AppCard key={a.slug} app={a} />
        ))}
      </ul>
      <Section aria-labelledby="dev">
        <InDevelopment />
      </Section>
    </>
  );
}
