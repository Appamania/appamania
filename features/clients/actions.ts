"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { FormState } from "@/features/auth/schema";
import { audit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClientIdSchema, InviteSchema, OnboardSchema } from "./schema";

const invalid = (e: z.ZodError): FormState => ({ fieldErrors: z.flattenError(e).fieldErrors });
const redirectTo = () => `${env().NEXT_PUBLIC_SITE_URL}/auth/callback`;

/** Invite a user and add them to a client. The profile row comes from the handle_new_user trigger. */
async function invite(actor: string, clientId: string, name: string, email: string): Promise<FormState> {
  const db = createAdminClient();
  const { data, error } = await db.auth.admin.inviteUserByEmail(email, { data: { full_name: name }, redirectTo: redirectTo() });
  // ponytail: an email that already has an account (same person, second client) is refused; add a lookup when it happens.
  if (error) return { formError: `Invite couldn't be sent: ${error.message}. Check the email and try again.` };
  const { error: e2 } = await db.from("client_members").insert({ client_id: clientId, profile_id: data.user.id });
  if (e2) return { formError: "Invite sent, but the membership couldn't be saved. Add the user again." };
  await audit(actor, "client.invite", "clients", clientId, { email });
  return { ok: true };
}

/** E3.4: new client company plus its first user. */
export async function onboardClient(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = OnboardSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const { data: client, error } = await createAdminClient()
    .from("clients")
    .insert({ name: d.company, billing_email: d.email, phone: d.phone || null, industry: d.industry })
    .select("id")
    .single();
  if (error) return { formError: "Client couldn't be saved. Try again." };
  await audit(admin.id, "client.onboard", "clients", client.id);
  const result = await invite(admin.id, client.id, d.name, d.email);
  revalidatePath("/admin");
  return result;
}

/** E3.4: another user on an existing client. */
export async function inviteClientUser(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = InviteSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return invalid(parsed.error);
  return invite(admin.id, parsed.data.clientId, parsed.data.name, parsed.data.email);
}

/** E3.5: status flip + ban. RLS helpers check status, so access ends immediately. Unpaid invoices stay open. */
async function setClientStatus(form: FormData, offboard: boolean): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = ClientIdSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return invalid(parsed.error);
  const db = createAdminClient();
  const { data: client } = await db
    .from("clients")
    .select("id, name, client_members(profile_id)")
    .eq("id", parsed.data.clientId)
    .single();
  if (!client) return { formError: "Client not found." };
  if (offboard && parsed.data.confirm !== client.name)
    return { fieldErrors: { confirm: [`Type ${client.name} to confirm`] } };

  const status = offboard ? "offboarded" : "active";
  const ids = client.client_members.map((m) => m.profile_id);
  // ponytail: a person who also belongs to another active client is offboarded too; split when that happens.
  const { error } = await db
    .from("clients")
    .update({ status, offboarded_at: offboard ? new Date().toISOString() : null })
    .eq("id", client.id);
  if (error) return { formError: "Status couldn't be changed. Try again." };
  if (ids.length) await db.from("profiles").update({ status }).in("id", ids);
  const failed: string[] = [];
  for (const id of ids) {
    const { error: banError } = await db.auth.admin.updateUserById(id, { ban_duration: offboard ? "876000h" : "none" });
    if (banError) failed.push(id);
  }
  await audit(admin.id, offboard ? "client.offboard" : "client.reactivate", "clients", client.id, { banFailed: failed });
  revalidatePath("/admin");
  // Data access already changed (RLS checks status); only sign-in blocking may be incomplete.
  if (failed.length)
    return { formError: `Status changed, but sign-in ${offboard ? "blocking" : "unblocking"} failed for ${failed.length} user(s). Try again.` };
  return { ok: true };
}

export async function offboardClient(_: FormState, form: FormData) {
  return setClientStatus(form, true);
}

export async function reactivateClient(_: FormState, form: FormData) {
  return setClientStatus(form, false);
}
