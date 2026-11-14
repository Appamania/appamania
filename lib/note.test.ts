import { describe, expect, it } from "vitest";
import { budgets } from "@/config/offers";
import { fieldError, platforms, prepareNote, timelines } from "./note";

const valid = {
  name: "Asha Rao",
  email: "asha@example.com",
  message: "The Flutter 3.47 write-up was useful.",
  link: "https://example.com",
  offer: "audit",
  platform: "",
  timeline: "",
  budget: "",
  website: "",
};

describe("prepareNote", () => {
  it("returns a trimmed body", () => {
    expect(prepareNote({ ...valid, name: "  Asha  " })).toEqual({
      ok: true,
      drop: false,
      body: { name: "Asha", email: valid.email, message: valid.message, link: valid.link, offer: "audit" },
      details: { platform: "", timeline: "", budget: "" },
    });
  });

  it("drops honeypot hits without a body", () => {
    expect(prepareNote({ ...valid, website: "https://spam.example" })).toEqual({ ok: true, drop: true });
  });

  it("rejects a bad email and a non-http link", () => {
    expect(prepareNote({ ...valid, email: "not-an-email" })).toMatchObject({ ok: false, field: "email" });
    expect(prepareNote({ ...valid, link: "ftp://files.example" })).toMatchObject({ ok: false, field: "link" });
  });

  it("blanks an unknown offer instead of failing", () => {
    expect(prepareNote({ ...valid, offer: "custom" })).toMatchObject({ ok: true, body: { offer: "" } });
  });

  it("appends a footer with the labels of known platform, timeline, and budget ids", () => {
    expect(prepareNote({ ...valid, platform: "ios", timeline: "soon", budget: "unsure" })).toMatchObject({
      ok: true,
      body: { message: `${valid.message}\n\n---\nPlatform: iOS\nTimeline: In 1–3 months\nBudget: Not sure yet` },
      details: { platform: "ios", timeline: "soon", budget: "unsure" },
    });
  });

  it("ignores unknown ids and adds no footer when all are empty", () => {
    expect(prepareNote({ ...valid, platform: "symbian", timeline: "", budget: "gt9" })).toMatchObject({
      ok: true,
      body: { message: valid.message },
      details: { platform: "", timeline: "", budget: "" },
    });
  });

  it("keeps a 3800-character message with the worst-case footer under 4000", () => {
    const longest = <T extends { id: string; label: string }>(items: readonly T[]) =>
      items.reduce((a, b) => (b.label.length > a.label.length ? b : a)).id;
    const message = "a".repeat(3800);
    const res = prepareNote({
      ...valid,
      message,
      platform: longest(platforms),
      timeline: longest(timelines),
      budget: longest(budgets),
    });
    expect(res.ok && !res.drop && res.body.message.length).toBeLessThanOrEqual(4000);
  });

  it("rejects a 3801-character message", () => {
    expect(prepareNote({ ...valid, message: "a".repeat(3801) })).toMatchObject({ ok: false, field: "message" });
  });

  it("checks one field on blur without blaming an earlier empty field", () => {
    expect(fieldError({ ...valid, name: "", email: "nope" }, "email")).toBe("Enter a valid email address");
  });
});
