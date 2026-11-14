import { describe, expect, it } from "vitest";
import { decodeValue, encodeValue } from "./firestore";

describe("firestore", () => {
  it("round-trips a document through Firestore values", () => {
    const doc = { slug: "flutter", order: 1, ok: true, tags: ["a"] };
    expect(decodeValue(encodeValue(doc))).toEqual(doc);
  });
});
