import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getWork } from "@/lib/content";

// PRD E1.11: public routes + case studies. Portal and admin are excluded (robots.ts too).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/services", "/work", "/apps", "/open-source", "/contact", "/legal/privacy", "/legal/terms", "/legal/refunds"];
  const work = (await getWork()).map((w) => `/work/${w.slug}`);
  return [...pages, ...work].map((p) => ({ url: `${site.url}${p}` }));
}
