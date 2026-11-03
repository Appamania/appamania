import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

// PRD §8. Borders over shadows; shadow-card only on hover (link cards) or the featured plan.
const base = "rounded-lg border border-line bg-paper-raised p-6";

export function Card({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cx(base, className)} {...rest} />;
}

/** Whole card is a link: lift −2px and shadow on hover, focus ring on the card. */
export function CardLink({ className, ...rest }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cx(
        base,
        "block text-ink transition-[transform,box-shadow] duration-(--dur) ease-out hover:-translate-y-0.5 hover:shadow-card",
        className,
      )}
      {...rest}
    />
  );
}

/** Stat card (portal/admin): mono label, large tabular value. */
export function StatCard({ label, value, note }: { label: string; value: React.ReactNode; note?: React.ReactNode }) {
  return (
    <Card className="grid gap-2 p-5">
      <span className="eyebrow text-ink-muted">{label}</span>
      <span className="text-h1 tabular-nums">{value}</span>
      {note && <span className="text-small text-ink-muted">{note}</span>}
    </Card>
  );
}
