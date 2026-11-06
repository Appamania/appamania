import { site } from "@/config/site";
import { getApps, getPackages, getPosts } from "@/lib/content";

export const revalidate = 60;

export async function GET() {
  const [apps, packages, posts] = await Promise.all([getApps(), getPackages(), getPosts()]);
  const body = `# ${site.name}

> ${site.tagline} ${site.owner}, ${site.location}.

## Work
- Case studies: ${site.url}/work
- Apps on Google Play: ${apps.map((a) => a.name).join(", ")} (${site.url}/apps)
- Open-source packages: ${packages.map((p) => `${p.name} (${p.points} pts)`).join(", ")} (${site.links.pubPublisher})
- Blog: ${posts.map((p) => p.title).join(", ") || "No posts yet."} (${site.url}/blog)

## Pages
- [Work](${site.url}/work)
- [Apps](${site.url}/apps)
- [Open source](${site.url}/open-source)
- [Blog](${site.url}/blog)
- [Send a note](${site.url}/contact)

## Contact
- Email: ${site.email}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
