import { NextResponse, type NextRequest } from "next/server";
import { portalEnabled } from "@/lib/flags";
import { updateSession } from "@/lib/supabase/session";

// PRD §12: refresh the session, then send signed-out visitors of /portal and /admin to sign-in.
// Roles and MFA are checked in layouts and server actions; RLS is the real boundary.
// When portal flag is off (marketing-only deploy), all matched routes redirect home.
export async function proxy(request: NextRequest) {
  if (!portalEnabled()) return NextResponse.redirect(new URL("/", request.url));
  const { response, signedIn } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const open = path.startsWith("/portal/login") || path.startsWith("/auth/");
  if (!signedIn && !open) return NextResponse.redirect(new URL("/portal/login", request.url));
  return response;
}

export const config = { matcher: ["/portal/:path*", "/admin/:path*", "/auth/:path*"] };
