import type { Metadata } from "next";
import { HomePage } from "@/components/site/HomePage";
import { getApps, getPackages, getWork } from "@/lib/content";

export const revalidate = 3600;
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [work, packages, apps] = await Promise.all([getWork(), getPackages(), getApps()]);
  return <HomePage work={work} packages={packages} apps={apps} />;
}
