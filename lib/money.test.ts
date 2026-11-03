import { describe, expect, it } from "vitest";
import { exponent, formatMinor, toMinor } from "./money";

describe("money", () => {
  it("derives exponents from Intl", () => {
    expect([exponent("INR"), exponent("USD"), exponent("JPY"), exponent("KWD")]).toEqual([2, 2, 0, 3]);
  });

  it("formats INR with Indian grouping", () => {
    expect(formatMinor(123450, "INR")).toBe("₹1,234.50");
    expect(formatMinor(14999900, "INR", { trim: true })).toBe("₹1,49,999");
  });

  it("formats USD, JPY, KWD", () => {
    expect(formatMinor(69900, "USD", { trim: true })).toBe("$699");
    expect(formatMinor(499, "USD", { trim: true })).toBe("$4.99");
    expect(formatMinor(1500, "JPY")).toBe("¥1,500");
    expect(formatMinor(1234, "KWD")).toMatch(/1\.234/);
  });

  it("uses parentheses for negatives in accounting mode", () => {
    expect(formatMinor(-5000, "USD", { accounting: true })).toBe("($50.00)");
  });

  it("parses to minor units without float error", () => {
    expect(toMinor("1,234.5", "INR")).toBe(123450);
    expect(toMinor("0.29", "USD")).toBe(29);
    expect(toMinor("1500", "JPY")).toBe(1500);
    expect(toMinor("1.234", "KWD")).toBe(1234);
    expect(() => toMinor("1.234", "INR")).toThrow();
    expect(() => toMinor("abc", "INR")).toThrow();
  });
});
