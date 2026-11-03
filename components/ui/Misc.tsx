import type { LucideIcon } from "lucide-react";
import { cx } from "@/lib/cx";

/** Empty state: names the space, one line, one action (design brief). */
export function EmptyState({ icon: Icon, title, body, action }: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid justify-items-center gap-3 rounded-lg border border-dashed border-line-strong px-6 py-12 text-center">
      <Icon aria-hidden className="size-6 text-ink-muted" />
      <h2 className="text-h3">{title}</h2>
      <p className="max-w-[44ch] text-small text-ink-muted">{body}</p>
      {action}
    </div>
  );
}

/** Skeleton block matching final layout. Pulse is off under reduced motion (tokens.css). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx("animate-pulse rounded-sm bg-paper-sunken", className)} />;
}
