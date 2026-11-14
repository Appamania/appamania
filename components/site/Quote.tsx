import type { Testimonial } from "@/config/proof";

/** Testimonials. Renders nothing until config/proof.ts has real, permitted quotes. */
export function Quote({ items }: { items: readonly Testimonial[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-4 min-[900px]:grid-cols-2">
      {items.map((t) => (
        <figure key={t.quote} className="rounded-lg border border-line bg-paper-raised p-7">
          <blockquote className="text-body-lg">&ldquo;{t.quote}&rdquo;</blockquote>
          <figcaption className="mt-5 font-mono text-small text-ink-muted">
            {[t.name, t.role, t.company].filter(Boolean).join(", ")}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
