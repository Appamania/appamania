import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getApps, getPackages, getPosts, getWork } from "@/lib/content";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [work, posts, apps, packages] = await Promise.all([getWork(), getPosts(), getApps(), getPackages()]);
  const pages = [
    "",
    "/work",
    "/apps",
    "/open-source",
    "/blog",
    "/contact",
    "/legal/privacy",
    ...work.map((w) => `/work/${w.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
    ...apps.map((a) => `/apps/${a.slug}`),
    ...packages.map((p) => `/open-source/${p.slug}`),
  ];
  return pages.map((p) => ({ url: `${site.url}${p}` }));
}
