import { HomePage } from "@/components/site/HomePage";
import { JsonLd } from "@/components/site/JsonLd";
import { homeCopy } from "@/config/home";
import { site } from "@/config/site";
import { getApps, getPackages, getWork } from "@/lib/content";
import { faqJsonLd, pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Appamania · Flutter app rescue, upgrades and releases",
  description: site.description,
  path: "/",
  absolute: true,
  rootImage: true,
});

export default async function Home() {
  const [work, packages, apps] = await Promise.all([getWork(), getPackages(), getApps()]);
  return (
    <>
      <JsonLd data={faqJsonLd(homeCopy.faq)} />
      <HomePage work={work} packages={packages} apps={apps} />
    </>
  );
}
