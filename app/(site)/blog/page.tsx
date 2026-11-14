import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { PageHero, Section } from "@/components/site/Blocks";
import { getPosts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

// Noindex until a post exists.
export async function generateMetadata() {
  const empty = (await getPosts()).length === 0;
  return pageMeta({
    title: "Blog",
    description: "Notes on Flutter, releases, and the packages.",
    path: "/blog",
    noindex: empty,
    rootImage: true,
  });
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

export default async function Blog() {
  const posts = await getPosts();
  return (
    <>
      <PageHero eyebrow="Blog" title="Notes from the work." lead="Short write-ups. No schedule." />
      {posts.length === 0 ? (
        <p className="flex flex-col items-start gap-4 text-ink-muted">
          No posts yet.
          <Link href="/work" className={buttonStyles("outline")}>
            See the work
          </Link>
        </p>
      ) : (
        <Section className="min-[900px]:pt-16">
          <ul className="grid gap-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-lg border border-line bg-paper-raised p-7 hover:border-line-strong"
                >
                  <span className="font-mono text-small text-ink-muted tabular-nums">{posted(post.date)}</span>
                  <h2 className="mt-2 text-h2">{post.title}</h2>
                  <p className="mt-2 text-ink-muted">{post.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
