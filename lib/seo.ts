import type { Metadata } from "next";
import { site } from "@/config/site";

export const orgId = `${site.url}/#org`;

/** Joins parts with spaces, dropping trailing parts that would push past max. Cuts a lone long part at a word. */
export function describe(parts: string[], max = 160): string {
  let out = "";
  for (const part of parts) {
    const next = out ? `${out} ${part}` : part;
    if (next.length > max) break;
    out = next;
  }
  if (out || parts.length === 0) return out;
  const first = parts[0]!;
  if (first.length <= max) return first;
  const at = first.slice(0, max).lastIndexOf(" ");
  return `${first.slice(0, at > 0 ? at : max - 1)}…`;
}

/** Page metadata. Next merges `openGraph` shallowly, so every page sets its own through here. */
export function pageMeta(p: {
  title: string;
  description: string;
  path: string;
  absolute?: boolean;
  noindex?: boolean;
  /** Pages without their own opengraph-image route. Next's shallow merge would drop the root image otherwise. */
  rootImage?: boolean;
}): Metadata {
  return {
    title: p.absolute ? { absolute: p.title } : p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: {
      title: p.absolute ? p.title : `${p.title} · ${site.name}`,
      description: p.description,
      url: p.path,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
      ...(p.rootImage && { images: ["/opengraph-image"] }),
    },
    twitter: { card: "summary_large_image" },
    ...(p.noindex && { robots: { index: false, follow: true } }),
  };
}

export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: site.location.split(",")[0]?.trim(), addressCountry: "IN" },
    founder: {
      "@type": "Person",
      name: site.owner,
      jobTitle: site.founderRole,
      sameAs: [site.links.linkedin, site.links.x].filter(Boolean),
    },
    sameAs: [site.links.github, site.links.pubPublisher, site.links.linkedinCompany, site.links.play].filter(Boolean),
    ...(site.legalName && { legalName: site.legalName }),
  };
}

export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
