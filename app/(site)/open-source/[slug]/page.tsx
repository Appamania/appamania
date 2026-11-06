import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { PageHero } from "@/components/site/Blocks";
import { pubUrl } from "@/config/catalog";
import { getPackages } from "@/lib/content";

export const dynamic = "force-dynamic";

async function find(slug: string) {
  return (await getPackages()).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const pkg = await find((await params).slug);
  return pkg ? { title: pkg.name, description: pkg.summary, alternates: { canonical: `/open-source/${pkg.slug}` } } : {};
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const pkg = await find((await params).slug);
  if (!pkg) notFound();
  return (
    <article>
      <PageHero eyebrow={`${pkg.points} pub points`} title={pkg.name} lead={pkg.summary}>
        <a href={pubUrl(pkg.name)} className={buttonStyles("primary")}>
          View on pub.dev <Arrow />
        </a>
      </PageHero>
      <div className="flex max-w-[66ch] flex-col gap-5 text-body-lg text-ink-muted">
        {pkg.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
