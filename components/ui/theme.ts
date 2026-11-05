// Shared by server and client. Must not live in a "use client" module (a value imported from one
// becomes a client reference on the server) and must not import server-only APIs.
import { themeColor as colors } from "@/styles/theme-color";

export type AppTheme = "dark" | "light";
export const THEME_COOKIE = "theme";
export const themeColor = { dark: colors.dark, light: colors.light } as const;
