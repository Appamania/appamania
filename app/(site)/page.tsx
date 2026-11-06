import type { Metadata } from "next";
import { HomePage } from "@/components/site/HomePage";
import { JsonLd } from "@/components/site/JsonLd";
import { site } from "@/config/site";
import { getApps, getPackages, getWork } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [work, packages, apps] = await Promise.all([getWork(), getPackages(), getApps()]);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.owner,
          url: site.url,
          email: site.email,
          jobTitle: "Flutter engineer",
          address: { "@type": "PostalAddress", addressLocality: "Kolkata", addressCountry: "IN" },
          sameAs: [site.links.linkedin, site.links.github, site.links.x],
        }}
      />
      <HomePage work={work} packages={packages} appCount={apps.length} />
    </>
  );
}
