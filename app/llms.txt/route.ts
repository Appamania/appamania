import { apps, packages } from "@/config/catalog";
import { site } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.name}

> ${site.tagline} ${site.owner}, ${site.location}.

## Work
- Case studies: ${site.url}/work
- Apps on Google Play: ${apps.map((a) => a.name).join(", ")} (${site.url}/apps)
- Open-source packages: ${packages.map((p) => `${p.name} (${p.points} pts)`).join(", ")} (${site.links.pubPublisher})

## Pages
- [Work](${site.url}/work)
- [Apps](${site.url}/apps)
- [Open source](${site.url}/open-source)
- [Send a note](${site.url}/contact)

## Contact
- Email: ${site.email}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
