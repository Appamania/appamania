import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { offers, type OfferId } from "@/config/offers";
import { cx } from "@/lib/cx";
import { Eyebrow } from "./Blocks";
import { Amount } from "./Price";

// Plan card (canvas Pricing). `featured` = the one shadow-glow on the page (design brief).
export function PlanCard({ id, eyebrow, badge, summary, points, featured, cta }: {
  id: OfferId;
  eyebrow: string;
  badge?: ReactNode;
  summary: string;
  points: readonly string[];
  featured?: boolean;
  cta: ReactNode;
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4.5 rounded-lg border p-8",
        featured ? "border-brand/50 bg-brand-tint shadow-glow" : "border-line bg-paper-raised",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        {badge}
      </div>
      <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{offers[id].name}</h3>
      <Amount id={id} />
      <p className="text-ink-muted">{summary}</p>
      <ul className="flex flex-col gap-2.5 border-t border-line pt-4.5 text-[15px] text-ink-muted">
        {points.map((p) => (
          <li key={p} className="flex gap-2.5">
            <span aria-hidden className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
              <Check className="size-3" />
            </span>
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-2 [&>a]:w-full">{cta}</div>
    </div>
  );
}
