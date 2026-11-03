import { describe, expect, it } from "vitest";
import { qualify } from "./rules";
import { LeadSchema } from "./schema";

describe("lead qualification (PRD §2.1)", () => {
  it("conflict industry is auto-declined", () => {
    expect(qualify("Fintech", ["Fintech"])).toEqual({ conflict: true, stage: "declined_auto" });
  });
  it("other industries stay new", () => {
    expect(qualify("Health", ["Fintech"])).toEqual({ conflict: false, stage: "new" });
    expect(qualify("Health", [])).toEqual({ conflict: false, stage: "new" });
  });
});

describe("LeadSchema (PRD §18.2)", () => {
  const base = { name: "Asha", email: "ASHA@Example.com ", industry: "Health", need: "audit", message: "x".repeat(20) };
  it("accepts a minimal lead, normalises email, drops empty optionals", () => {
    const r = LeadSchema.parse({ ...base, company: "", repo_url: "" });
    expect(r.email).toBe("asha@example.com");
    expect(r.company).toBeUndefined();
    expect(r.repo_url).toBeUndefined();
  });
  it("rejects short messages, unknown industries and needs, non-http links", () => {
    expect(LeadSchema.safeParse({ ...base, message: "too short" }).success).toBe(false);
    expect(LeadSchema.safeParse({ ...base, industry: "Crypto" }).success).toBe(false);
    expect(LeadSchema.safeParse({ ...base, need: "free" }).success).toBe(false);
    expect(LeadSchema.safeParse({ ...base, repo_url: "javascript:alert(1)" }).success).toBe(false);
  });
});
