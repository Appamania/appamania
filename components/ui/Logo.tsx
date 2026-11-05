import { cx } from "@/lib/cx";

// Chai Studio mark (rounded green square, "a", saffron dot) + wordmark set in Geist 600.
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cx("size-8 shrink-0", className)}>
      <rect width="64" height="64" rx="16" fill="var(--brand)" />
      <circle cx="29" cy="37" r="10.5" fill="none" stroke="var(--on-brand)" strokeWidth="7" />
      <rect x="36.5" y="22" width="7" height="26" rx="3.5" fill="var(--on-brand)" />
      <circle cx="47" cy="17" r="5" fill="var(--saffron)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <Mark />
      <span className="text-[22px] leading-none font-semibold tracking-[-0.04em]">appamania</span>
    </span>
  );
}
