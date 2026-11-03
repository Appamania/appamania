import { cx } from "@/lib/cx";

// PRD §8: brand fill only (overdue shows a separate badge, never a red bar). Width set once, no animation library.
export function Progress({ value, label, className }: { value: number; label: string; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cx("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 flex-1 overflow-hidden rounded-pill bg-paper-sunken"
      >
        <div className="h-full origin-left rounded-pill bg-brand" style={{ width: `${v}%` }} />
      </div>
      <span className="font-mono text-code tabular-nums">{v}%</span>
    </div>
  );
}
