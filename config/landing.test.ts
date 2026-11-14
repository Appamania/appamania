import { describe, expect, it } from "vitest";
import snapshot from "@/content/snapshot.json";
import { formatPrice, isOfferId, offers } from "@/config/offers";
import { landingSlugs, landings } from "./landing";

describe("landings", () => {
  it("points each landing at a valid offer, with signs and faq", () => {
    for (const slug of landingSlugs) {
      expect(isOfferId(landings[slug].offer)).toBe(true);
      expect(landings[slug].signs.length).toBeGreaterThan(0);
      expect(landings[slug].faq.length).toBeGreaterThan(0);
    }
  });

  it("keeps every description within 160 characters", () => {
    for (const slug of landingSlugs) expect(landings[slug].description.length).toBeLessThanOrEqual(160);
  });

  it("keeps copy free of raw rupee signs, we/our, and the word I", () => {
    const prices = Object.values(offers).map((o) => formatPrice(o));
    for (const slug of landingSlugs) {
      const l = landings[slug];
      const texts: string[] = [
        l.title,
        l.description,
        l.eyebrow,
        l.h1,
        l.accent,
        l.lead,
        ...l.signs,
        ...l.faq.flatMap((f) => [f.q, f.a]),
      ];
      for (const raw of texts) {
        let text = raw;
        for (const p of prices) text = text.replaceAll(p, "");
        expect(text).not.toContain("₹");
        expect(text).not.toMatch(/\b(we|our)\s/i);
        expect(text).not.toContain(" I ");
      }
    }
  });

  it("points each case study at a work slug in the snapshot", () => {
    const slugs = snapshot.work.map((w) => w.slug);
    for (const slug of landingSlugs) expect(slugs).toContain(landings[slug].caseStudy);
  });

  it("keeps every title within 60 characters with the site suffix", () => {
    for (const slug of landingSlugs) expect(`${landings[slug].title} · Appamania`.length).toBeLessThanOrEqual(60);
  });

  it("builds prices with formatPrice", () => {
    expect(landings["flutter-app-audit"].description).toContain(formatPrice(offers.audit));
  });
});
