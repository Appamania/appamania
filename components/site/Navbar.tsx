import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "./MobileMenu";
import { NavCta } from "./NavCta";
import { NavLinks } from "./NavLinks";

// Floating pill nav with glass blur (design brief: the one place glass is allowed).
export function Navbar() {
  return (
    <header className="sticky top-[max(16px,env(safe-area-inset-top))] z-(--z-nav) flex justify-center px-4 pt-4 sm:px-5">
      <nav
        aria-label="Main"
        className="flex w-full max-w-[860px] items-center justify-between gap-7 rounded-pill border border-line-strong bg-paper-raised/75 py-2 pr-2 pl-5 backdrop-blur-md"
      >
        <Link href="/" aria-label="Appamania home">
          <Logo />
        </Link>
        <NavLinks className="hidden gap-6 text-small min-[900px]:flex" />
        <div className="flex items-center gap-2">
          <NavCta />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
