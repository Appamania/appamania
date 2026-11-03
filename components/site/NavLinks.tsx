"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";

export const navItems = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/open-source", label: "Open source" },
  { href: "/apps", label: "Apps" },
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
            className={cx("text-ink-muted hover:text-ink aria-[current=page]:text-ink", linkClass)}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
