import { describe, expect, it } from "vitest";
import { blockingAdvisories } from "./audit-prod.mjs";

const deepmerge = {
  severity: "high",
  via: [
    {
      url: "https://github.com/advisories/GHSA-gcqx-w48m-w2h4",
      severity: "high",
    },
  ],
};

describe("production audit exception", () => {
  it("allows only the unfixed deepmerge advisory and packages that depend on it", () => {
    expect(
      blockingAdvisories({
        vulnerabilities: {
          deepmerge,
          "html-to-text": { severity: "high", via: ["deepmerge"] },
          "@react-email/render": { severity: "high", via: ["html-to-text"] },
          "@react-email/components": { severity: "high", via: ["@react-email/render"] },
        },
      }),
    ).toEqual([]);
  });

  it("still fails on any other high or critical advisory", () => {
    const blocking = blockingAdvisories({
      vulnerabilities: {
        deepmerge,
        next: {
          severity: "critical",
          via: [{ url: "https://github.com/advisories/GHSA-673q-mjm6-r5xr", severity: "critical" }],
        },
        zod: {
          severity: "high",
          via: [{ url: "https://github.com/advisories/GHSA-mrhx-c7xc-m3w5", severity: "high" }],
        },
      },
    });
    expect(blocking.map((item) => item.name).sort()).toEqual(["next", "zod"]);
  });

  it("does not treat a second advisory on deepmerge as allowed", () => {
    const blocking = blockingAdvisories({
      vulnerabilities: {
        deepmerge: {
          severity: "critical",
          via: [
            { url: "https://github.com/advisories/GHSA-gcqx-w48m-w2h4", severity: "high" },
            { url: "https://github.com/advisories/GHSA-xxxx-yyyy-zzzz", severity: "critical" },
          ],
        },
      },
    });
    expect(blocking.map((item) => item.name)).toEqual(["deepmerge"]);
  });

  it("ignores low findings, including deepmerge at its current severity", () => {
    expect(
      blockingAdvisories({
        vulnerabilities: {
          deepmerge: {
            severity: "low",
            via: [{ url: "https://github.com/advisories/GHSA-gcqx-w48m-w2h4", severity: "low" }],
          },
          "html-to-text": { severity: "low", via: ["deepmerge"] },
        },
      }),
    ).toEqual([]);
  });
});
