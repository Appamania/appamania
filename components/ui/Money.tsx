import { formatMinor } from "@/lib/money";
import { cx } from "@/lib/cx";

// Money display (PRD §8). Paise in, tabular mono out. `trim` drops ".00" on marketing prices.
export function Money({ minor, currency = "INR", trim, accounting, className }: {
  minor: number;
  currency?: string;
  trim?: boolean;
  accounting?: boolean;
  className?: string;
}) {
  return <span className={cx("font-mono tabular-nums", className)}>{formatMinor(minor, currency, { trim, accounting })}</span>;
}
