import { describe, expect, it } from "vitest";
import { WorkSchema } from "./schemas";

describe("schemas", () => {
  it("accepts media only from /media/", () => {
    const cover = WorkSchema.shape.cover;
    expect(cover.safeParse("/media/a.png").success).toBe(true);
    expect(cover.safeParse("/media/work/cover-1.webp").success).toBe(true);
    for (const bad of [
      "https://evil.example/a.png",
      "/media/../x",
      "//evil.example/a.png",
      "/media/a b.png",
      "/media/a.png?x=1",
      "/media/",
      "/media//x",
      "/media/x/",
      "/media/%2e%2e/x",
      "/media/a\\b",
      "/media/ü.png",
    ])
      expect(cover.safeParse(bad).success).toBe(false);
  });
});
