import { describe, expect, it } from "vitest";
import { mediaUrl, objectName } from "./storage";

describe("storage", () => {
  it("builds a safe object name and a public URL", () => {
    expect(objectName("Flutter 3.47!", "Shot one.PNG", 42)).toBe("media/flutter-3-47-42.png");
    expect(objectName("", "noext", 1)).toBe("media/file-1");
    expect(mediaUrl("my-bucket", "media/a-1.png")).toBe(
      "https://firebasestorage.googleapis.com/v0/b/my-bucket/o/media%2Fa-1.png?alt=media",
    );
  });
});
