import "server-only";
import { verifyWebhookSignature as verify } from "@/lib/razorpay-verify";

const API = "https://api.razorpay.com/v1";

function authHeader(): string {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing");
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

export type CreatePaymentLinkInput = {
  amountMinor: number;
  currency?: string;
  referenceId: string;
  description: string;
  customer: { name: string; email: string; contact?: string | null };
  invoiceId: string;
  callbackUrl: string;
  expireByUnix: number;
};

export type RazorpayPaymentLink = {
  id: string;
  short_url: string;
};

export async function createPaymentLink(input: CreatePaymentLinkInput): Promise<RazorpayPaymentLink> {
  const res = await fetch(`${API}/payment_links`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountMinor,
      currency: input.currency ?? "INR",
      accept_partial: false,
      reference_id: input.referenceId,
      description: input.description,
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        contact: input.customer.contact ?? undefined,
      },
      notify: { email: false, sms: false },
      reminder_enable: true,
      notes: { invoice_id: input.invoiceId },
      callback_url: input.callbackUrl,
      callback_method: "get",
      expire_by: input.expireByUnix,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay payment link failed: ${res.status} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as RazorpayPaymentLink;
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  return verify(rawBody, signature, process.env.RAZORPAY_WEBHOOK_SECRET);
}
