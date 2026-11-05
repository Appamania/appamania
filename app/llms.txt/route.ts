import { priceText } from "@/components/site/Price";
import { packages } from "@/config/catalog";
import { offers } from "@/config/offers";
import { site } from "@/config/site";

// llms.txt for AI assistants (PRD E1.11), generated from config so prices never drift.
export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.name}

> ${site.tagline} Senior Flutter engineer ${site.owner}, ${site.location}. Works remotely worldwide.

## Offers (INR)
- ${offers.audit.name}: ${priceText("audit")}, ${offers.audit.duration}. Written report: architecture, crash root causes, performance, SDK debt, store compliance, fixed-price fix plan. Credited if a sprint follows within 30 days.
- ${offers.sprint.name}: ${priceText("sprint")}, ${offers.sprint.duration}. SDK upgrade, root-cause crash fixes, CI/CD, Play Store and App Store release. ${offers.sprint.payment}.
- ${offers.retainer.name}: ${priceText("retainer")}. Up to 8 hours a month of updates and one release a month.
- ${offers.mvp.name}: ${priceText("mvp")}. ${offers.website.name}: ${priceText("website")}. By enquiry.

## Proof
- Open-source Flutter/Dart packages on pub.dev: ${packages.map((p) => `${p.name} (${p.points} pts)`).join(", ")} (${site.links.pubPublisher})
- Apps on Google Play: ${site.url}/apps

## Pages
- [Services and prices](${site.url}/services)
- [Case studies](${site.url}/work)
- [Book an audit or enquire](${site.url}/contact)

## Contact
- Email: ${site.email}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
