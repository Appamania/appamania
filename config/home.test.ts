import { describe, expect, it } from "vitest";
import { proofFacts } from "./home";

describe("proofFacts", () => {
  it("shows one point value when all packages score the same", () => {
    const facts = proofFacts({ points: [150, 150], appCount: 4 });
    expect(facts[2]).toEqual({ value: "150", label: "pub points, 2 packages", href: "/open-source" });
  });

  it("shows a range when scores differ", () => {
    const facts = proofFacts({ points: [150, 160, 155], appCount: 4 });
    expect(facts[2]).toEqual({ value: "150–160", label: "pub points, 3 packages", href: "/open-source" });
  });

  it("drops the apps fact at zero and the points fact with no packages", () => {
    const facts = proofFacts({ points: [], appCount: 0 });
    expect(facts.map((f) => f.href)).toEqual(["/about", "/work/flutter-3-47-upgrade"]);
  });

  it("keeps the order: years, regressions, points, apps", () => {
    const facts = proofFacts({ points: [150], appCount: 4 });
    expect(facts.map((f) => f.value)).toEqual(["6+ yrs", "0", "150", "4"]);
    expect(facts[1].label).toBe("regressions in the 3.47 upgrade");
    expect(facts[3]).toEqual({ value: "4", label: "apps on Google Play", href: "/apps" });
  });
});
