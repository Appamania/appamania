import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/Blocks";
import { site } from "@/config/site";
import { getPosts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((row) => ({ slug: row.slug }));
}

function posted(date: string) {
  const parsed = new Date(date.includes("T") ? date : `${date}T00:00:00+05:30`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function find(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await find((await params).slug);
  return post
    ? pageMeta({ title: post.title, description: post.summary, path: `/blog/${post.slug}`, rootImage: true })
    : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await find((await params).slug);
  if (!post) notFound();
  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          author: { "@type": "Person", name: site.owner },
          url: `${site.url}/blog/${post.slug}`,
        }}
      />
      <PageHero
        eyebrow={<span className="tabular-nums">{posted(post.date)}</span>}
        title={post.title}
        lead={post.summary}
      />
      <div className="flex max-w-[66ch] flex-col gap-5 text-body-lg text-ink-muted">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
