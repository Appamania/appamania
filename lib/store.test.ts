import { describe, expect, it } from "vitest";
import { homeCopy } from "@/config/home";
import {
  chooseList,
  decideRemote,
  decodeValue,
  encodeValue,
  isAdmin,
  NoteSchema,
  readToken,
  StaticCopy,
  WorkSchema,
} from "./store";

describe("store", () => {
  it("parses the checked-in home copy", () => {
    expect(StaticCopy.parse(homeCopy).hero.accent).toBe("ship.");
  });

  it("round-trips a document through Firestore values", () => {
    const doc = { slug: "flutter", order: 1, ok: true, tags: ["a"] };
    expect(decodeValue(encodeValue(doc))).toEqual(doc);
  });

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

  it("allows only one admin email", () => {
    expect(isAdmin(" Sumit@Appamania.in ")).toBe(true);
    expect(isAdmin("other@appamania.in")).toBe(false);
  });

  it("reads the email claim from an id token", () => {
    const body = Buffer.from(JSON.stringify({ email: "sumit@appamania.in", exp: 1 })).toString("base64url");
    expect(readToken(`x.${body}.y`)).toEqual({ email: "sumit@appamania.in", exp: 1 });
    expect(readToken("nope")).toBeNull();
  });

  it("ignores a bad static blob, reloads once per version, then shows the banner", () => {
    const base = { version: "2", notice: "", staticJson: "{", refresh: "false", built: "1", reloadedFor: null };
    expect(decideRemote(base)).toMatchObject({ copy: null, reload: true, mark: "2", notice: "" });
    expect(decideRemote({ ...base, reloadedFor: "2" })).toMatchObject({
      reload: false,
      notice: "This page has a newer version.",
    });
    expect(decideRemote({ ...base, version: "1", refresh: "true", staticJson: "" })).toMatchObject({ reload: true, mark: "1" });
    expect(decideRemote({ ...base, version: "1", refresh: "true", reloadedFor: "1" })).toMatchObject({ reload: false, notice: "" });
  });
});
