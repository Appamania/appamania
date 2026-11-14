import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe as suite, expect, it } from "vitest";
import { JsonLd } from "@/components/site/JsonLd";
import { site } from "@/config/site";
import { describe, faqJsonLd, orgJsonLd, pageMeta } from "@/lib/seo";

suite("pageMeta", () => {
  it("sets the canonical path and the suffixed Open Graph title", () => {
    const m = pageMeta({ title: "Services", description: "d", path: "/services" });
    expect(m.alternates).toEqual({ canonical: "/services" });
    expect(m.title).toBe("Services");
    expect((m.openGraph as { title: string }).title).toBe("Services · Appamania");
    expect(m).not.toHaveProperty("robots");
  });

  it("keeps an absolute title as is", () => {
    const m = pageMeta({ title: "Appamania · Home", description: "d", path: "/", absolute: true });
    expect(m.title).toEqual({ absolute: "Appamania · Home" });
    expect((m.openGraph as { title: string }).title).toBe("Appamania · Home");
  });

  it("adds noindex only when asked", () => {
    const off = pageMeta({ title: "Blog", description: "d", path: "/blog" });
    expect(off.robots).toBeUndefined();
    const on = pageMeta({ title: "Blog", description: "d", path: "/blog", noindex: true });
    expect(on.robots).toEqual({ index: false, follow: true });
  });

  it("adds the root Open Graph image only when rootImage is set", () => {
    const off = pageMeta({ title: "Blog", description: "d", path: "/blog" });
    expect((off.openGraph as { images?: unknown }).images).toBeUndefined();
    const on = pageMeta({ title: "Blog", description: "d", path: "/blog", rootImage: true });
    expect((on.openGraph as { images?: unknown }).images).toEqual(["/opengraph-image"]);
  });
});

suite("orgJsonLd", () => {
  it("filters empty sameAs links and omits legalName when unset", () => {
    const org = orgJsonLd();
    expect(org["@id"]).toBe(`${site.url}/#org`);
    expect(org.sameAs).not.toContain("");
    expect(org).not.toHaveProperty("legalName");
    expect(org.founder.sameAs).toEqual([site.links.linkedin, site.links.x]);
  });
});

suite("faqJsonLd", () => {
  it("maps each item to a Question with an Answer", () => {
    expect(faqJsonLd([{ q: "Why?", a: "Because." }])).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Why?", acceptedAnswer: { "@type": "Answer", text: "Because." } }],
    });
  });
});

suite("describe", () => {
  it("joins parts that fit", () => {
    expect(describe(["One.", "Two."], 160)).toBe("One. Two.");
  });

  it("drops trailing parts that would push it over max", () => {
    expect(describe(["One.", "Two is longer.", "Three."], 15)).toBe("One.");
  });

  it("cuts a long first part at a word boundary and adds an ellipsis", () => {
    const out = describe(["alpha beta gamma delta epsilon"], 20);
    expect(out).toBe("alpha beta gamma…");
    expect(out.length).toBeLessThanOrEqual(20);
  });
});

suite("JsonLd", () => {
  it("escapes < so content cannot close the script tag", () => {
    const html = renderToStaticMarkup(createElement(JsonLd, { data: { name: "</script><b>" } }));
    expect(html).toContain("\\u003c/script>");
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });
});
