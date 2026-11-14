import { describe, expect, it } from "vitest";
import { chooseList, WorkSchema } from "./schemas";

describe("schemas", () => {
  it("skips a bad document and falls back only when every document is bad", () => {
    const fallback = [{ slug: "kept" }];
    const schema = WorkSchema.pick({ slug: true });
    expect(chooseList([{ slug: "ok" }, { slug: "BAD SLUG" }], schema, [{ slug: "kept" }])).toEqual([{ slug: "ok" }]);
    expect(chooseList([{ slug: "BAD" }], schema, fallback)).toEqual(fallback);
    expect(chooseList(null, schema, fallback)).toEqual(fallback);
    expect(chooseList([], schema, fallback)).toEqual(fallback);
  });

  it("accepts media only from the Firebase Storage host", () => {
    expect(WorkSchema.shape.cover.safeParse("https://evil.example/a.png").success).toBe(false);
  });
});
