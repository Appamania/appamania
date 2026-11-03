import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getViewer, homeFor, LOGIN, MFA } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Email links (token_hash) and Google OAuth (code) land here (PRD §12). Then route by role.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const tokenHash = url.searchParams.get("token_hash");
  const type = (["invite", "magiclink", "email"] as const).find((t) => t === url.searchParams.get("type")) as
    | EmailOtpType
    | undefined;
  const code = url.searchParams.get("code");
  const supabase = await createClient();

  const { error } =
    tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : { error: new Error("missing token") };
  if (error) return NextResponse.redirect(new URL(`${LOGIN}?error=${code ? "google" : "link"}`, url));

  const viewer = await getViewer();
  if (!viewer) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL(`${LOGIN}?error=access`, url));
  }
  const next = viewer.role === "admin" && viewer.aal !== "aal2" ? MFA : homeFor(viewer.role);
  return NextResponse.redirect(new URL(next, url));
}
