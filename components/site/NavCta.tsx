"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonStyles } from "@/components/ui/Button";

// One primary action per view: pages whose hero or CtaBand already has the primary CTA get an outline nav button.
export function NavCta() {
  const path = usePathname();
  const primary = !(
    path === "/" ||
    path === "/contact" ||
    path === "/about" ||
    path.startsWith("/services") ||
    path.startsWith("/work") ||
    path.startsWith("/open-source")
  );
  return (
    <Link
      href="/contact?offer=audit"
      data-cta="nav"
      data-offer="audit"
      className={buttonStyles(primary ? "primary" : "outline", "sm")}
    >
      Book an audit
    </Link>
  );
}
