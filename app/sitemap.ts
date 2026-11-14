import type { MetadataRoute } from "next";
import { landingSlugs } from "@/config/landing";
import { site } from "@/config/site";
import { getApps, getPackages, getPosts, getWork } from "@/lib/content";

// lastModified comes only from snapshot `updated` (or `date` for work). No build-time dates.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [work, posts, apps, packages] = await Promise.all([getWork(), getPosts(), getApps(), getPackages()]);
  const pages = [
    "",
    "/services",
    ...landingSlugs.map((s) => `/services/${s}`),
    "/work",
    "/apps",
    "/open-source",
    "/about",
    "/contact",
    "/legal/privacy",
    ...(posts.length > 0 ? ["/blog", ...posts.map((p) => `/blog/${p.slug}`)] : []),
  ];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...work.map((w) => ({ url: `${site.url}/work/${w.slug}`, lastModified: w.updated ?? w.date })),
    ...apps.map((a) => ({ url: `${site.url}/apps/${a.slug}`, lastModified: a.updated })),
    ...packages.map((p) => ({ url: `${site.url}/open-source/${p.slug}`, lastModified: p.updated })),
  ];
}
