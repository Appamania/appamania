import { formatPrice, offers } from "@/config/offers";
import { landingSlugs, landings } from "@/config/landing";
import { site } from "@/config/site";
import { getApps, getPackages, getPosts } from "@/lib/content";

export const revalidate = 3600;

export async function GET() {
  const [apps, packages, posts] = await Promise.all([getApps(), getPackages(), getPosts()]);
  const blog = posts.length > 0;
  const body = `# ${site.name}: ${site.descriptor}

> ${site.tagline}

## About
Founded and run by ${site.owner}, ${site.location}. Udyam-registered.
- [About](${site.url}/about)

## Problems Appamania fixes
${landingSlugs.map((s) => `- [${landings[s].title}](${site.url}/services/${s})`).join("\n")}

## Services (${site.url}/services)
${Object.values(offers)
  .map((o) => `- ${o.name}: ${formatPrice(o)}, ${o.duration}, ${o.payment}. ${o.fit}`)
  .join("\n")}
- ${site.billing}

## Work
- Case studies: ${site.url}/work
- Apps on Google Play: ${apps.map((a) => a.name).join(", ")} (${site.url}/apps)
- Open-source packages: ${packages.map((p) => `${p.name} (${p.points} pts)`).join(", ")} (${site.links.pubPublisher})${
    blog ? `\n- Blog: ${posts.map((p) => p.title).join(", ")} (${site.url}/blog)` : ""
  }

## Pages
- [Services](${site.url}/services)
- [Work](${site.url}/work)
- [Apps](${site.url}/apps)
- [Open source](${site.url}/open-source)${blog ? `\n- [Blog](${site.url}/blog)` : ""}
- [Start a project](${site.url}/contact)

## Contact
- Email: ${site.email}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
