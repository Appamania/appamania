import { notFound } from "next/navigation";
import { landingSlugs, landings, type LandingSlug } from "@/config/landing";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export const dynamicParams = false;

export function generateStaticParams() {
  return landingSlugs.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!landingSlugs.includes(slug as LandingSlug)) notFound();
  const l = landings[slug as LandingSlug];
  return ogImage({ eyebrow: l.eyebrow, title: l.title });
}
