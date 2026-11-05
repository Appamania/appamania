import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyWebhookSignature } from "./razorpay-verify";

describe("verifyWebhookSignature", () => {
  it("accepts a valid HMAC", () => {
    const body = '{"event":"payment_link.paid"}';
    const sig = createHmac("sha256", "whsec_test").update(body).digest("hex");
    expect(verifyWebhookSignature(body, sig, "whsec_test")).toBe(true);
  });

  it("rejects a bad signature", () => {
    expect(verifyWebhookSignature("{}", "deadbeef", "whsec_test")).toBe(false);
  });

  it("rejects when secret missing", () => {
    expect(verifyWebhookSignature("{}", "anything", undefined)).toBe(false);
  });
});
