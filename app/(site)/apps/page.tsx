import Link from "next/link";
import { AppCard } from "@/components/site/AppCard";
import { PageHero, Section } from "@/components/site/Blocks";
import { InDevelopment } from "@/components/site/InDevelopment";
import { getApps } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Flutter apps on Google Play",
  description:
    "Spend Analytics, Medify, Minimalist Forecast, and Wally: Flutter apps that Appamania designs, builds, and publishes on Google Play.",
  path: "/apps",
  rootImage: true,
});

export default async function Apps() {
  const apps = await getApps();
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Apps Appamania builds and"
        accent="runs itself."
        lead="Flutter apps designed, built, and published by Appamania on Google Play."
      />
      <ul className="mt-10 grid grid-cols-1 gap-4 min-[600px]:grid-cols-2 min-[900px]:grid-cols-4">
        {apps.map((a) => (
          <AppCard key={a.slug} app={a} />
        ))}
      </ul>
      <Section aria-labelledby="dev">
        <InDevelopment />
      </Section>
      <p className="mt-10 text-ink-muted">
        Need the same for your app?{" "}
        <Link href="/services" className="text-ink underline underline-offset-4 hover:text-brand">
          See the services
        </Link>
        .
      </p>
    </>
  );
}
