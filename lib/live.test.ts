import { describe, expect, it } from "vitest";
import { compact, parseScore } from "./live";

describe("live", () => {
  it("reads a pub.dev score and ignores junk", () => {
    expect(parseScore({ grantedPoints: 150, likeCount: 12, downloadCount30Days: 3400 })).toEqual({
      points: 150,
      likes: 12,
      downloads: 3400,
    });
    expect(parseScore({ grantedPoints: 150 })).toEqual({ points: 150, likes: 0, downloads: 0 });
    expect(parseScore({ likeCount: 1 })).toBeNull();
    expect(parseScore("nope")).toBeNull();
  });

  it("formats compact counts", () => {
    expect(compact(950)).toBe("950");
    expect(compact(12400)).toBe("12.4K");
  });
});
