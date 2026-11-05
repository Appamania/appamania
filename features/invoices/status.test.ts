import { describe, expect, it } from "vitest";
import { invoiceDisplayStatus } from "./status";

describe("invoiceDisplayStatus", () => {
  const now = new Date("2026-11-05T12:00:00+05:30");

  it("marks sent past due as overdue", () => {
    expect(invoiceDisplayStatus("sent", "2026-11-04", now)).toBe("overdue");
  });

  it("keeps sent when due today or later", () => {
    expect(invoiceDisplayStatus("sent", "2026-11-05", now)).toBe("sent");
    expect(invoiceDisplayStatus("sent", "2026-11-10", now)).toBe("sent");
  });

  it("never overdues paid or void", () => {
    expect(invoiceDisplayStatus("paid", "2026-01-01", now)).toBe("paid");
    expect(invoiceDisplayStatus("void", "2026-01-01", now)).toBe("void");
  });

  it("overdues partially_paid past due", () => {
    expect(invoiceDisplayStatus("partially_paid", "2026-10-01", now)).toBe("overdue");
  });
});
