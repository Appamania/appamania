"use server";
import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { site } from "@/config/site";
import { LeadAck } from "@/emails/LeadAck";
import { LeadAlert } from "@/emails/LeadAlert";
import { send } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import { verifyTurnstile } from "@/lib/turnstile";
import { LIMITS, qualify } from "./rules";
import { LeadSchema, type LeadFormState } from "./schema";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** PRD §18.1: honeypot → zod → Turnstile → rate limit → conflict check → insert → emails after the response. */
export async function createLead(_: LeadFormState, form: FormData): Promise<LeadFormState> {
  if (form.get("website")) return { ok: true }; // honeypot: pretend success, store nothing

  const raw = Object.fromEntries(
    [...form.entries()].filter(([k]) => !["website", "cf-turnstile-response"].includes(k)),
  ) as Record<string, string>;
  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values: raw };
  const d = parsed.data;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await verifyTurnstile(form.get("cf-turnstile-response") as string | null, ip)))
    return { formError: "The spam check didn't pass. Wait a moment and send again.", values: raw };

  const salt = process.env.LEAD_SALT;
  if (!salt) throw new Error("LEAD_SALT is not set");
  const ipHash = sha256(ip + salt);
  const db = createAdminClient();
  const since = (ms: number) => new Date(Date.now() - ms).toISOString();
  const [{ count: byIp }, { count: byEmail }] = await Promise.all([
    db.from("leads").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since(3_600_000)),
    db.from("leads").select("id", { count: "exact", head: true }).eq("email", d.email).gte("created_at", since(LIMITS.perEmailMinutes * 60_000)),
  ]);
  if ((byIp ?? 0) >= LIMITS.perIpPerHour || (byEmail ?? 0) > 0)
    return { formError: `Got it already — or too many messages from this network. Email ${site.email} if it's urgent.`, values: raw };

  const q = qualify(d.industry, site.conflictIndustries);
  const { data: lead, error } = await db
    .from("leads")
    .insert({
      name: d.name,
      email: d.email,
      company: d.company,
      industry: d.industry,
      need: d.need === "unsure" ? null : (d.need as Database["public"]["Enums"]["offer_id"]),
      repo_url: d.repo_url,
      message: d.message,
      ip_hash: ipHash,
      conflict_flag: q.conflict,
      stage: q.stage,
    })
    .select("id")
    .single();
  if (error || !lead) {
    console.error("lead insert failed", error?.message);
    return { formError: `Your message couldn't be sent. Try again or email ${site.email}.`, values: raw };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  after(async () => {
    // E2.2: ack within a minute, after the response is sent. Each email independent; send() never throws.
    await Promise.all([
      send(d.email, q.conflict ? "Thanks for reaching out" : "Got your message", LeadAck({ name: d.name, conflict: q.conflict, siteUrl }), `lead-ack-${lead.id}`),
      send(
        process.env.ADMIN_EMAIL ?? site.email,
        `${q.conflict ? "[auto-declined] " : ""}New lead: ${d.name}${d.company ? `, ${d.company}` : ""}`,
        LeadAlert({
          rows: [
            ["Name", d.name],
            ["Email", d.email],
            ["Company", d.company],
            ["Industry", d.industry],
            ["Need", d.need],
            ["Repo", d.repo_url],
            ["Conflict", q.conflict ? "yes" : "no"],
          ],
          message: d.message,
          url: `${siteUrl}/admin/leads`,
        }),
        `lead-alert-${lead.id}`,
      ),
    ]);
  });

  return { ok: true, declined: q.conflict };
}
