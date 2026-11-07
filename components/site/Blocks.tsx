import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

// Site layout blocks from the Chai Studio canvas (PRD §8). Tokens only.

/** Soft brand glow; one behind the hero and one behind the case panel (design brief). */
export function Glow({ className, saffron }: { className?: string; saffron?: boolean }) {
  return (
    <div
      aria-hidden
      className={cx(
        "pointer-events-none absolute rounded-full",
        saffron
          ? "size-[360px] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--saffron)_16%,transparent),transparent_70%)]"
          : "size-[520px] bg-[radial-gradient(closest-side,var(--glow),color-mix(in_oklab,var(--brand)_5%,transparent)_55%,transparent_72%)] min-[900px]:size-[720px]",
        className,
      )}
    />
  );
}

export function Eyebrow({ className, ...rest }: ComponentProps<"span">) {
  return <span className={cx("eyebrow text-brand", className)} {...rest} />;
}

/** Pill chip; `dot` adds the live dot (availability, verified). */
export function Chip({ dot, className, children }: { dot?: boolean; className?: string; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex h-8 items-center gap-2 rounded-pill border border-line-strong px-3.5 text-[13px] font-medium text-ink-muted",
        className,
      )}
    >
      {dot && <span aria-hidden className="size-2 rounded-full bg-brand ring-4 ring-brand-tint" />}
      {children}
    </span>
  );
}

export function Section({ className, ...rest }: ComponentProps<"section">) {
  return <section className={cx("pt-16 min-[900px]:pt-24", className)} {...rest} />;
}

/** Numbered section header: "01 — Pricing", heading, optional right-hand note. */
export function SectionHeader({
  eyebrow,
  title,
  aside,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2
          id={id}
          className="mt-3 max-w-[16ch] text-[clamp(40px,5vw,72px)] leading-none font-semibold tracking-[-0.045em]"
        >
          {title}
        </h2>
      </div>
      {aside && <div className="max-w-[36ch] text-ink-muted">{aside}</div>}
    </div>
  );
}

/** Inner-page hero: eyebrow, big heading with a brand-coloured accent, lead line. */
export function PageHero({
  eyebrow,
  title,
  accent,
  lead,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  accent?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="relative flex max-w-[980px] flex-col gap-6 pt-14 pb-6 min-[900px]:pt-24">
      <Eyebrow className="relative">{eyebrow}</Eyebrow>
      <h1 className="relative text-[clamp(52px,7.4vw,112px)] leading-[0.92] font-semibold tracking-[-0.055em]">
        {title} {accent && <span className="text-brand">{accent}</span>}
      </h1>
      {lead && (
        <p className="relative max-w-[46ch] text-body-lg text-ink-muted min-[900px]:text-[20px] min-[900px]:leading-[1.55]">
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}

/** Bento grid: 6 columns desktop, 2 below 900px. Spans via `span`. */
export function Bento({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cx("grid grid-cols-2 gap-4 min-[900px]:grid-cols-6", className)} {...rest} />;
}

const spans = {
  2: "col-span-2",
  3: "col-span-2 min-[900px]:col-span-3",
  6: "col-span-2 min-[900px]:col-span-6",
} as const;

export function Tile({
  span = 2,
  tall,
  brand,
  className,
  ...rest
}: ComponentProps<"div"> & {
  span?: keyof typeof spans;
  tall?: boolean;
  brand?: boolean;
}) {
  return (
    <div
      className={cx(
        "reveal relative flex min-h-60 flex-col gap-3 overflow-hidden rounded-lg border p-7 [&_h3]:text-[26px] [&_h3]:leading-[1.15] [&_h3]:font-semibold [&_h3]:tracking-[-0.03em]",
        brand
          ? "border-brand bg-brand text-on-brand [&_.eyebrow]:text-on-brand"
          : "border-line bg-night text-on-night [&_p]:text-on-night-muted",
        spans[span],
        tall && "min-[900px]:row-span-2",
        className,
      )}
      {...rest}
    />
  );
}

/** Giant number at the bottom of a tile. */
export function Big({ className, ...rest }: ComponentProps<"span">) {
  return (
    <span
      className={cx("mt-auto text-[clamp(56px,6vw,96px)] leading-[0.9] font-semibold tracking-[-0.06em]", className)}
      {...rest}
    />
  );
}

/** Code block on paper-sunken; `k` / `s` spans colour keywords and strings. */
export function Code({ className, ...rest }: ComponentProps<"pre">) {
  return (
    <pre
      // Scrollable on narrow screens, so keyboard users need to reach it (WCAG 2.1.1); decorative blocks stay out.
      tabIndex={rest["aria-hidden"] ? undefined : 0}
      className={cx(
        "m-0 overflow-x-auto rounded-[16px] border border-line bg-paper-sunken px-4.5 py-4 font-mono text-[13px] leading-[1.7] text-ink-muted [&_.k]:text-brand [&_.s]:text-ink",
        className,
      )}
      {...rest}
    />
  );
}

/** Version-jump chips: "Flutter 3.41 → 3.47". */
export function VersionJump({ from, to, done = true }: { from: string; to: string; done?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex h-11 items-center rounded-pill border border-line-strong bg-paper-sunken px-4.5 font-mono text-[15px]">
        {from}
      </span>
      <span aria-hidden className="text-ink-muted">
        →
      </span>
      <span className="sr-only">to</span>
      <span
        className={cx(
          "inline-flex h-11 items-center rounded-pill border bg-paper-sunken px-4.5 font-mono text-[15px]",
          done ? "border-brand/50 text-brand" : "border-line-strong",
        )}
      >
        {to}
      </span>
    </div>
  );
}

/** Large rounded panel with glow (case panel). Two columns on desktop. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cx(
        "reveal relative grid items-center gap-12 overflow-hidden rounded-lg border border-line bg-paper-raised p-8 min-[900px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] min-[900px]:rounded-xl min-[900px]:p-14",
        className,
      )}
    >
      <Glow className="-top-50 -right-65" />
      {children}
    </div>
  );
}

/** Numbered steps (01–04). */
export function Steps({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-4 min-[900px]:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.title} className="reveal rounded-md border border-line bg-paper-raised p-7">
          <span
            aria-hidden
            className="mb-7 inline-grid size-10 place-items-center rounded-full border border-line-strong font-mono text-[13px] text-brand"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mb-2 text-[20px] font-semibold tracking-[-0.02em]">{s.title}</h3>
          <p className="text-[15px] text-ink-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** FAQ with native <details> (PRD §6 native first). */
export function Faq({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: ReactNode;
  items: readonly { q: string; a: ReactNode }[];
}) {
  return (
    <div className="grid gap-12 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 text-[clamp(36px,4vw,56px)] leading-none font-semibold tracking-[-0.045em]">{title}</h2>
      </div>
      <div>
        {items.map((f, i) => (
          <details key={f.q} open={i === 0} className="group border-b border-line py-5.5">
            <summary className="flex cursor-pointer list-none justify-between gap-5 text-[19px] font-medium tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-brand"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">–</span>
              </span>
            </summary>
            <div className="mt-3 max-w-[58ch] text-ink-muted">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Full-green CTA band with the saffron disc. One per page. */
export function CtaBand({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="reveal relative flex flex-col items-start gap-7 overflow-hidden rounded-lg bg-brand px-7 py-14 text-on-brand min-[900px]:rounded-xl min-[900px]:px-16 min-[900px]:py-22">
      <div
        aria-hidden
        className="absolute -right-20 -bottom-20 size-55 rounded-full bg-saffron min-[900px]:-bottom-30 min-[900px]:size-105"
      />
      <span className="relative eyebrow">{eyebrow}</span>
      <h2 className="relative max-w-[12ch] text-[clamp(48px,7vw,112px)] leading-[0.9] font-semibold tracking-[-0.06em]">
        {title}
      </h2>
      <p className="relative text-[20px]">{body}</p>
      <div className="relative">{children}</div>
    </div>
  );
}
