import { notFound } from "next/navigation";
import { getApps } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getApps()).map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = (await getApps()).find((a) => a.slug === slug);
  if (!app) notFound();
  return ogImage({ eyebrow: app.category, title: app.name });
}
