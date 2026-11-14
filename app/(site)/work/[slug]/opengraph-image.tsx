import { notFound } from "next/navigation";
import { getWork } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getWork()).map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = (await getWork()).find((x) => x.slug === slug);
  if (!w) notFound();
  return ogImage({ eyebrow: w.teaser.label, title: w.teaser.title });
}
