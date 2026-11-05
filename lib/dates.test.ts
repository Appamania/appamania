import { describe, expect, it } from "vitest";
import { formatAbsolute, formatRelative, fyLabel } from "./dates";

describe("dates", () => {
  const now = new Date("2026-10-01T06:00:00Z");

  it("formats absolute dates; plain dates never shift", () => {
    expect(formatAbsolute("2026-10-12")).toBe("12 Oct 2026");
  });

  it("is relative under 7 days, absolute beyond", () => {
    expect(formatRelative("2026-10-04T06:00:00Z", now)).toBe("in 3 days");
    expect(formatRelative("2026-09-29T06:00:00Z", now)).toBe("2 days ago");
    expect(formatRelative("2026-10-01T04:00:00Z", now)).toBe("2 hours ago");
    expect(formatRelative("2026-10-20", now)).toBe("20 Oct 2026");
  });

  it("labels the Indian FY by IST date", () => {
    expect(fyLabel(new Date("2026-04-01T00:00:00+05:30"))).toBe("26-27");
    expect(fyLabel(new Date("2026-03-31T23:59:00+05:30"))).toBe("25-26");
    // 1 Apr 02:00 IST is still 31 Mar in UTC: must be the new FY (resolution #3).
    expect(fyLabel(new Date("2026-03-31T20:30:00Z"))).toBe("26-27");
    expect(fyLabel(new Date("2027-01-15T12:00:00Z"))).toBe("26-27");
  });
});
