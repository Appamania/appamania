import { describe, expect, it } from "vitest";
import { encodeFields } from "./firestore";

describe("firestore", () => {
  it("encodes note fields and drops undefined", () => {
    expect(encodeFields({ name: "a", n: 1, skip: undefined })).toEqual({
      name: { stringValue: "a" },
      n: { integerValue: "1" },
    });
  });
});
