"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";

export const navItems = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/apps", label: "Apps" },
  { href: "/open-source", label: "Open source" },
  { href: "/about", label: "About" },
] as const;

/** Desktop nav links with aria-current (needs the pathname, so a client leaf). */
export function NavLinks({ className, linkClass }: { className?: string; linkClass?: string }) {
  const path = usePathname();
  return (
    <div className={className}>
      {navItems.map(({ href, label }) => {
        const current = path === href || path.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={current ? "page" : undefined}
            className={cx(
              "text-ink-muted underline-offset-8 hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline",
              linkClass,
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
