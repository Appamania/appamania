"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { portalEnabled } from "@/lib/flags";
import { navItems } from "./NavLinks";

// Native <dialog> menu below 900px (design brief): Esc closes, focus returns to the trigger.
export function MobileMenu() {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  const showLogin = portalEnabled();
  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => ref.current?.showModal()}
        className="grid size-10 place-items-center rounded-pill border border-line-strong text-ink min-[900px]:hidden pointer-coarse:size-11"
      >
        <Menu aria-hidden className="size-5" />
      </button>
      <dialog
        ref={ref}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-6 text-ink backdrop:bg-overlay"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="grid size-11 place-items-center rounded-pill border border-line-strong"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-8 grid gap-2">
          {[{ href: "/", label: "Home" }, ...navItems, { href: "/contact", label: "Contact" }].map(({ href, label }) => (
            <Link key={href} href={href} onClick={close} className="py-2 text-h1">
              {label}
            </Link>
          ))}
          {showLogin ? (
            <Link href="/portal/login" onClick={close} className="mt-6 py-2 text-body-lg text-ink-muted">
              Client login
            </Link>
          ) : null}
        </nav>
      </dialog>
    </>
  );
}
