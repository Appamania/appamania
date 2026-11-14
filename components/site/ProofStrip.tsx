import Link from "next/link";
import type { ProofFact } from "@/config/home";

// Desktop column count follows the item count (max 4). Full class strings so Tailwind sees them.
const gridCols: Record<number, string> = {
  1: "grid-cols-2",
  2: "grid-cols-2 min-[900px]:grid-cols-2",
  3: "grid-cols-2 min-[900px]:grid-cols-3",
  4: "grid-cols-2 min-[900px]:grid-cols-4",
};

/** Proof facts as a linked strip: the number first, the label under it. Renders nothing when empty. */
export function ProofStrip({ items }: { items: readonly ProofFact[] }) {
  if (!items.length) return null;
  return (
    <dl className={`reveal grid border-y border-line ${gridCols[Math.min(items.length, 4)]}`}>
      {items.map((f) => (
        <div
          key={f.label}
          className="flex flex-col-reverse border-line px-4 py-6 min-[900px]:border-l min-[900px]:first:border-l-0 [&:nth-child(even)]:border-l [&:nth-child(n+3)]:border-t min-[900px]:[&:nth-child(n+3)]:border-t-0"
        >
          <dt className="font-mono text-small text-ink-muted">{f.label}</dt>
          <dd className="text-display tabular-nums">
            <Link href={f.href} className="underline decoration-line-strong underline-offset-4 hover:text-brand">
              {f.value}
            </Link>
          </dd>
        </div>
      ))}
    </dl>
  );
}
