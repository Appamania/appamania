import { describe, expect, it } from "vitest";
import { formatPrice, isOfferId, offers } from "./offers";

describe("offers", () => {
  it("formats INR with Indian grouping, from, and per", () => {
    expect(formatPrice(offers.audit)).toBe("₹2,999");
    expect(formatPrice(offers.mvp)).toBe("from ₹74,999");
    expect(formatPrice(offers.retainer)).toBe("₹14,999/month");
    expect(formatPrice({ priceMinor: 1_50_000_00 })).toBe("₹1,50,000");
  });

  it("knows its ids", () => {
    expect(isOfferId("audit")).toBe(true);
    expect(isOfferId("custom")).toBe(false);
  });
});
