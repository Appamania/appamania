import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/Blocks";
import { getApps } from "@/lib/content";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getApps()).map((row) => ({ slug: row.slug }));
}

async function find(slug: string) {
  return (await getApps()).find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const app = await find((await params).slug);
  return app ? { title: app.name, description: app.summary, alternates: { canonical: `/apps/${app.slug}` } } : {};
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const app = await find((await params).slug);
  if (!app) notFound();
  return (
    <article>
      <PageHero eyebrow={app.category} title={app.name} lead={app.summary} />
      <div className="flex max-w-[66ch] flex-col gap-5 text-body-lg text-ink-muted">
        {app.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <a
          href={app.url}
          className="inline-flex min-h-11 items-center font-mono text-[13px] text-brand underline-offset-4 hover:underline"
        >
          Get it on Google Play
        </a>
      </div>
    </article>
  );
}
