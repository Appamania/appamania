"use server";
import "server-only";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LOGIN } from "@/lib/auth";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { EmailSchema, type FormState } from "./schema";

/** Magic link for invited users only: never creates accounts (E3.1). Same answer for unknown emails. */
export async function sendMagicLink(_: FormState, form: FormData): Promise<FormState> {
  const parsed = EmailSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values: { email: String(form.get("email") ?? "") } };
  const supabase = await createClient();
  await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: false, emailRedirectTo: `${env().NEXT_PUBLIC_SITE_URL}/auth/callback` },
  });
  return { ok: true };
}

/** Google OAuth (PKCE). Sign-ups are off in Supabase, so an uninvited Google account gets no session. */
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${env().NEXT_PUBLIC_SITE_URL}/auth/callback` },
  });
  redirect(error || !data.url ? `${LOGIN}?error=google` : data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(LOGIN);
}
