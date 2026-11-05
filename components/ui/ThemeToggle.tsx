"use client";

import { Moon, Sun } from "lucide-react";
import { THEME_COOKIE, themeColor } from "./theme";

// Portal/admin Light/Dark (PRD E4.8). Saved in a cookie so the server renders the right theme: no flash.
// Stateless: the current theme is read from #app-theme, and the icon follows it via CSS, so every
// instance (sidebar, mobile header) stays in sync.
export function ThemeToggle() {
  function toggle() {
    const shell = document.getElementById("app-theme");
    const next = shell?.dataset.theme === "light" ? "dark" : "light";
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    shell?.setAttribute("data-theme", next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor[next]);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch light or dark theme"
      className="grid size-9 place-items-center rounded-pill text-ink-muted hover:bg-paper-sunken hover:text-ink pointer-coarse:size-11"
    >
      <Sun aria-hidden className="size-5 in-data-[theme=light]:hidden" />
      <Moon aria-hidden className="size-5 in-data-[theme=dark]:hidden" />
    </button>
  );
}
