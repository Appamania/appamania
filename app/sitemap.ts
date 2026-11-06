import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getWork } from "@/lib/content";

// Public routes and case studies.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/work", "/apps", "/open-source", "/contact", "/legal/privacy"];
  const work = (await getWork()).map((w) => `/work/${w.slug}`);
  return [...pages, ...work].map((p) => ({ url: `${site.url}${p}` }));
}
