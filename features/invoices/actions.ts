"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { site } from "@/config/site";
import { requireAdmin } from "@/lib/auth";
import { formatMinor } from "@/lib/money";
import { createPaymentLink } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { CreateInvoiceSchema, type InvoiceFormState } from "./schema";

export async function createInvoice(_: InvoiceFormState, form: FormData): Promise<InvoiceFormState> {
  await requireAdmin();
  const raw = Object.fromEntries(form.entries()) as Record<string, string>;
  const parsed = CreateInvoiceSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values: raw };
  const d = parsed.data;
  const unitPriceMinor = Math.round(d.unitPriceRupees * 100);

  const db = await createClient();
  const { data: inv, error } = await db
    .from("invoices")
    .insert({
      client_id: d.clientId,
      project_id: d.projectId || null,
      title: d.title,
      status: "draft",
    })
    .select("id")
    .single();
  if (error || !inv) return { formError: "Could not create draft.", values: raw };

  const { error: itemErr } = await db.from("invoice_items").insert({
    invoice_id: inv.id,
    description: d.description,
    unit_price_minor: unitPriceMinor,
    qty: 1,
  });
  if (itemErr) return { formError: itemErr.message, values: raw };

  revalidatePath("/admin/invoices");
  return { ok: true, id: inv.id };
}

export async function sendInvoice(invoiceId: string): Promise<InvoiceFormState> {
  await requireAdmin();
  const db = await createClient();

  const { data: before, error: loadErr } = await db
    .from("invoices")
    .select("id, status, clients(name, billing_email, phone)")
    .eq("id", invoiceId)
    .maybeSingle();
  if (loadErr || !before) return { formError: "Invoice not found." };
  if (before.status !== "draft") return { formError: "Only drafts can be sent." };

  const { data: number, error: rpcErr } = await db.rpc("send_invoice", { p_id: invoiceId });
  if (rpcErr || !number) return { formError: rpcErr?.message ?? "Send failed." };

  const { data: inv, error: afterErr } = await db
    .from("invoices")
    .select("id, number, title, total_minor, paid_minor, due_date, clients(name, billing_email, phone)")
    .eq("id", invoiceId)
    .single();
  if (afterErr || !inv) return { formError: "Invoice sent but reload failed." };

  const due = inv.due_date ? new Date(`${inv.due_date}T23:59:59+05:30`) : new Date(Date.now() + 7 * 86_400_000);
  const expireBy = Math.floor(due.getTime() / 1000) + 7 * 86_400;
  const client = inv.clients as { name: string; billing_email: string; phone: string | null } | null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

  try {
    const link = await createPaymentLink({
      amountMinor: inv.total_minor - inv.paid_minor,
      referenceId: inv.number!,
      description: `${inv.number} · ${inv.title}`,
      customer: {
        name: client?.name ?? "Client",
        email: client?.billing_email ?? site.email,
        contact: client?.phone,
      },
      invoiceId: inv.id,
      callbackUrl: `${siteUrl}/portal/invoices?paid=${encodeURIComponent(inv.number!)}`,
      expireByUnix: expireBy,
    });

    const { error: upErr } = await db
      .from("invoices")
      .update({ razorpay_link_id: link.id, razorpay_short_url: link.short_url })
      .eq("id", inv.id);
    if (upErr) return { formError: `Link created but save failed: ${upErr.message}` };
  } catch (e) {
    console.error("payment link", e instanceof Error ? e.message : e);
    return {
      formError: `Invoice ${number} sent (${formatMinor(inv.total_minor, "INR", { trim: true })}) but Razorpay link failed. Check keys.`,
      values: { number },
    };
  }

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/portal/invoices");
  return { ok: true, id: invoiceId, number };
}
