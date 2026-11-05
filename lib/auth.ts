import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Route guards (PRD §12). RLS is the real boundary; these are UX redirects.
export type Role = "admin" | "client";
export type Viewer = { id: string; role: Role; fullName: string | null; aal: "aal1" | "aal2" };

export const LOGIN = "/portal/login";
export const MFA = "/portal/login/mfa";
export const homeFor = (role: Role) => (role === "admin" ? "/admin" : "/portal");

/** Signed-in, active user with a profile, or null. Cached per request. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, status")
    .eq("id", claims.sub)
    .maybeSingle();
  if (!profile || profile.status !== "active") return null;
  return { id: claims.sub, role: profile.role, fullName: profile.full_name, aal: claims.aal === "aal2" ? "aal2" : "aal1" };
});

export async function requireClient(): Promise<Viewer> {
  const v = await getViewer();
  if (v?.role === "admin") redirect("/admin");
  if (v?.role !== "client") redirect(LOGIN);
  return v;
}

/** Admin routes and every admin server action require MFA (aal2, E3.3). */
export async function requireAdmin(): Promise<Viewer> {
  const v = await getViewer();
  if (v?.role !== "admin") redirect(LOGIN);
  if (v.aal !== "aal2") redirect(MFA);
  return v;
}
