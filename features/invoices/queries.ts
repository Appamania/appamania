import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function listAdminInvoices() {
  const db = await createClient();
  const { data, error } = await db
    .from("invoices")
    .select("id, number, title, status, total_minor, paid_minor, due_date, razorpay_short_url, clients(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminInvoice(id: string) {
  const db = await createClient();
  const { data, error } = await db
    .from("invoices")
    .select("*, invoice_items(*), clients(name, billing_email, phone)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function listClientInvoices() {
  const db = await createClient();
  const { data, error } = await db
    .from("invoices")
    .select("id, number, title, status, total_minor, paid_minor, due_date, razorpay_short_url, issue_date")
    .neq("status", "draft")
    .order("issue_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
