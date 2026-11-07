import { describe, expect, it } from "vitest";
import { decodeValue, encodeValue, readToken } from "./firestore";

describe("firestore", () => {
  it("round-trips a document through Firestore values", () => {
    const doc = { slug: "flutter", order: 1, ok: true, tags: ["a"] };
    expect(decodeValue(encodeValue(doc))).toEqual(doc);
  });

  it("reads the email claim from an id token", () => {
    const body = Buffer.from(JSON.stringify({ email: "sumit@appamania.in", exp: 1 })).toString("base64url");
    expect(readToken(`x.${body}.y`)).toEqual({ email: "sumit@appamania.in", exp: 1 });
    expect(readToken("nope")).toBeNull();
  });
});
