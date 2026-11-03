import { offers, type OfferId } from "@/config/offers";
import { formatMinor } from "@/lib/money";
import { cx } from "@/lib/cx";

/** "₹2,999" or "from ₹74,999" or "₹14,999 / mo", straight from config/offers.ts (PRD §2). */
export function priceText(id: OfferId) {
  const o = offers[id];
  if (o.priceMinor === null) return "Quoted";
  const amount = formatMinor(o.priceMinor, "INR", { trim: true });
  return `${"from" in o && o.from ? "from " : ""}${amount}${"per" in o && o.per ? " / mo" : ""}`;
}

/** Large price with an optional mono suffix ("/ mo"). */
export function Amount({ id, className }: { id: OfferId; className?: string }) {
  const o = offers[id];
  if (o.priceMinor === null) return null;
  return (
    <div className={cx("text-[52px] leading-none font-semibold tracking-[-0.05em] tabular-nums", className)}>
      {formatMinor(o.priceMinor, "INR", { trim: true })}
      {"per" in o && o.per && <small className="ml-2 font-mono text-[14px] font-normal tracking-normal text-ink-muted">/ month</small>}
    </div>
  );
}
