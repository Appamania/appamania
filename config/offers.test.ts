import { describe, expect, it } from "vitest";
import { offers } from "./offers";

describe("offers (PRD §2)", () => {
  it("every price is whole rupees ending in 9", () => {
    for (const o of Object.values(offers)) {
      if (o.priceMinor === null) continue;
      expect(o.priceMinor % 100, `${o.id} has paise`).toBe(0);
      expect((o.priceMinor / 100) % 10, `${o.id} = ₹${o.priceMinor / 100}`).toBe(9);
    }
  });

  it("retainer stays at or under the ₹15,000 UPI Autopay limit", () => {
    expect(offers.retainer.priceMinor).toBeLessThanOrEqual(15_000_00);
  });

  it("audit and sprint have milestone templates", () => {
    expect(offers.audit.milestones.length).toBeGreaterThan(0);
    expect(offers.sprint.milestones.length).toBeGreaterThan(0);
  });
});
