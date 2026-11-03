"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonStyles } from "@/components/ui/Button";

// One primary action per view: pages whose hero already has the primary audit CTA get an outline nav button.
const heroHasPrimary = new Set(["/", "/contact", "/services"]);

export function NavCta() {
  const primary = !heroHasPrimary.has(usePathname());
  return (
    <Link href="/contact" className={buttonStyles(primary ? "primary" : "outline", "sm")}>
      Book audit
    </Link>
  );
}
