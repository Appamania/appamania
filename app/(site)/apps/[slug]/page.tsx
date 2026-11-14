import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHero } from "@/components/site/Blocks";
import { getApps } from "@/lib/content";

export const dynamicParams = false;

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
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Apps", href: "/apps" },
          { name: app.name, href: `/apps/${app.slug}` },
        ]}
      />
      <PageHero eyebrow={app.category} title={app.name} lead={app.summary} />
      {app.screens?.length ? (
        <ul aria-label="Screenshots" tabIndex={0} className="mb-10 flex snap-x gap-4 overflow-x-auto pb-2">
          {app.screens.map((src, i) => (
            <li key={src} className="shrink-0 snap-start">
              <Image
                src={src}
                alt={`${app.name} screen ${i + 1}`}
                width={270}
                height={585}
                sizes="270px"
                className="h-[585px] w-auto rounded-md border border-line bg-paper-sunken object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}
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
        {app.outcome && <p className="text-h2">{app.outcome}</p>}
        <Link href="/services" className={buttonStyles("outline", "md", "self-start")}>
          See the services <Arrow />
        </Link>
      </div>
    </article>
  );
}
