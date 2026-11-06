import { Check } from "lucide-react";
import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { formatPrice, offers, type Offer, type OfferId } from "@/config/offers";
import { cx } from "@/lib/cx";

const featured: OfferId = "sprint";
const cards: OfferId[] = ["audit", "sprint", "retainer"];
const quoted: OfferId[] = ["mvp", "website"];

/** Three plan cards, middle featured with shadow-glow (design brief). Prices from config/offers.ts only. Buttons are outline: the page hero holds the one primary. */
export function Plans({ detail }: { detail?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-4 min-[900px]:grid-cols-3">
        {cards.map((id) => {
          const o: Offer = offers[id];
          const hot = id === featured;
          return (
            <li
              key={id}
              className={cx(
                "reveal flex flex-col gap-5 rounded-lg border border-line bg-paper-raised p-7 transition-colors duration-(--dur) hover:border-line-strong min-[900px]:p-8",
                hot && "shadow-glow",
              )}
            >
              <h3 className="eyebrow text-brand">{o.name}</h3>
              <p className="font-mono text-display tabular-nums">{formatPrice(o)}</p>
              <p className="font-mono text-small text-ink-muted">
                {o.duration} · {o.payment}
              </p>
              <p className="text-ink-muted">{o.fit}</p>
              {detail && (
                <ul className="flex flex-col gap-2 text-body">
                  {o.includes.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                      {line}
                    </li>
                  ))}
                </ul>
              )}
              {o.guarantee && <p className="text-small text-ink">{o.guarantee}</p>}
              <Link href={`/contact?offer=${id}`} className={buttonStyles("outline", "md", "mt-auto self-start")}>
                {o.cta} <Arrow />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="font-mono text-small text-ink-muted">
        Also:{" "}
        {quoted.map((id, i) => (
          <span key={id}>
            {i > 0 && " · "}
            <Link href={`/contact?offer=${id}`} className="text-ink underline underline-offset-4 hover:text-brand">
              {offers[id].name}
            </Link>{" "}
            {formatPrice(offers[id])}
          </span>
        ))}
        . INR; USD on request.
      </p>
    </div>
  );
}
