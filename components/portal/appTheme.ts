import "server-only";
import type { Viewport } from "next";
import { cookies } from "next/headers";
import { THEME_COOKIE, themeColor, type AppTheme } from "@/components/ui/theme";

/** Saved portal/admin theme, default dark (PRD §1). */
export async function appTheme(): Promise<AppTheme> {
  return (await cookies()).get(THEME_COOKIE)?.value === "light" ? "light" : "dark";
}

/** Portal/admin layouts re-export this so theme-color follows the saved theme. */
export async function generateViewport(): Promise<Viewport> {
  return { themeColor: themeColor[await appTheme()] };
}
