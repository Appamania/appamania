import { describe, expect, it } from "vitest";
import { chooseList, isAdmin, NoteSchema, SettingsSchema, WorkSchema } from "./schemas";

describe("schemas", () => {
  it("skips a bad document and falls back only when every document is bad", () => {
    const fallback = [{ slug: "kept" }];
    const schema = WorkSchema.pick({ slug: true });
    expect(chooseList([{ slug: "ok" }, { slug: "BAD SLUG" }], schema, [{ slug: "kept" }])).toEqual([{ slug: "ok" }]);
    expect(chooseList([{ slug: "BAD" }], schema, fallback)).toEqual(fallback);
    expect(chooseList(null, schema, fallback)).toEqual(fallback);
    expect(chooseList([], schema, fallback)).toEqual(fallback);
  });

  it("drops note links that are not http", () => {
    const note = { id: "n", name: "A", email: "a@b.co", message: "Hi", received: "" };
    expect(NoteSchema.parse({ ...note, link: "javascript:alert(1)" }).link).toBe("");
    expect(NoteSchema.parse({ ...note, link: "HTTPS://example.com" }).link).toBe("HTTPS://example.com");
  });

  it("defaults missing settings to empty strings", () => {
    expect(SettingsSchema.parse({})).toEqual({ notice: "", availability: "" });
  });

  it("allows only one admin email", () => {
    expect(isAdmin(" Sumit@Appamania.in ")).toBe(true);
    expect(isAdmin("other@appamania.in")).toBe(false);
  });
});
