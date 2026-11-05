import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { appTheme } from "./appTheme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { signOut } from "@/features/auth/actions";

export type NavItem = { href: string; label: string; icon: LucideIcon };

// Portal/admin frame (PRD §8, E4.9). Theme from cookie, default dark; layouts export generateViewport. Sidebar ≥ 900px, bottom tabs below.
// ponytail: active-item highlight comes with the D4/D5 screens (needs a client leaf for the pathname).
export async function AppShell({ nav, children }: { nav: NavItem[]; children: React.ReactNode }) {
  const theme = await appTheme();
  return (
    <div id="app-theme" data-theme={theme} className="min-h-dvh min-[900px]:grid min-[900px]:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-line p-4 min-[900px]:flex min-[900px]:flex-col min-[900px]:gap-6">
        <Link href="/" className="px-2 py-1">
          <Logo />
        </Link>
        <nav aria-label="Main" className="grid gap-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex h-10 items-center gap-3 rounded-pill px-3 text-small text-ink-muted hover:bg-paper-raised hover:text-ink"
            >
              <Icon aria-hidden className="size-5" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between">
          <SignOut />
          <ThemeToggle />
        </div>
      </aside>
      <div className="flex min-w-0 flex-col pb-20 min-[900px]:pb-0">
        <header className="flex h-14 items-center justify-between border-b border-line px-4 min-[900px]:hidden">
          <Logo />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <SignOut />
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-[1280px] flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-(--z-nav) grid auto-cols-fr grid-flow-col border-t border-line bg-paper-raised pb-[env(safe-area-inset-bottom)] min-[900px]:hidden"
      >
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="grid min-h-14 place-items-center gap-0.5 py-2 text-label text-ink-muted hover:text-ink">
            <Icon aria-hidden className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function SignOut() {
  return (
    <form action={signOut}>
      <button className="h-9 rounded-pill px-3 text-small text-ink-muted hover:bg-paper-raised hover:text-ink pointer-coarse:h-11">
        Sign out
      </button>
    </form>
  );
}
