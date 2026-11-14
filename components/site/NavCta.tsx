"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonStyles } from "@/components/ui/Button";

// One primary action per view: pages whose hero already has the primary audit CTA get an outline nav button.
export function NavCta() {
  const path = usePathname();
  const primary = !(path === "/" || path === "/contact" || path === "/about" || path.startsWith("/services"));
  return (
    <Link href="/contact?offer=audit" className={buttonStyles(primary ? "primary" : "outline", "sm")}>
      Book an audit
    </Link>
  );
}
