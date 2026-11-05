import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

type PaidPayload = {
  event?: string;
  payload?: {
    payment_link?: { entity?: { id?: string; notes?: { invoice_id?: string } } };
    payment?: {
      entity?: {
        id?: string;
        amount?: number;
        currency?: string;
        method?: string;
        fee?: number;
        tax?: number;
        created_at?: number;
      };
    };
  };
};

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature");
  if (!verifyWebhookSignature(raw, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let body: PaidPayload;
  try {
    body = JSON.parse(raw) as PaidPayload;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (body.event !== "payment_link.paid") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const link = body.payload?.payment_link?.entity;
  const payment = body.payload?.payment?.entity;
  const invoiceId = link?.notes?.invoice_id;
  const linkId = link?.id;
  const paymentId = payment?.id;
  const amount = payment?.amount;

  if (!invoiceId || !linkId || !paymentId || !amount || amount <= 0) {
    console.error("razorpay webhook: missing fields");
    return NextResponse.json({ ok: true });
  }

  const db = createAdminClient();
  const { data: invoice, error: invErr } = await db
    .from("invoices")
    .select("id, razorpay_link_id, status")
    .eq("id", invoiceId)
    .maybeSingle();

  if (invErr) {
    console.error("razorpay webhook: invoice load", invErr.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  if (!invoice || invoice.razorpay_link_id !== linkId) {
    // Mismatch: ack 200, no write (PRD §16.3).
    console.error("razorpay webhook: invoice/link mismatch", invoiceId, linkId);
    return NextResponse.json({ ok: true });
  }

  const paidAt = payment.created_at
    ? new Date(payment.created_at * 1000).toISOString()
    : new Date().toISOString();

  const { error } = await db.from("payments").upsert(
    {
      kind: "invoice" as const,
      invoice_id: invoiceId,
      source: "razorpay" as const,
      amount_minor: amount,
      currency: payment.currency ?? "INR",
      fee_minor: payment.fee ?? 0,
      tax_on_fee_minor: payment.tax ?? 0,
      method: payment.method ?? null,
      razorpay_payment_id: paymentId,
      paid_at: paidAt,
      raw: body as never,
    },
    { onConflict: "razorpay_payment_id", ignoreDuplicates: true },
  );

  if (error) {
    console.error("razorpay webhook: payment insert", error.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
