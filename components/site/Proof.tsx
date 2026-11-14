import { cx } from "@/lib/cx";

// The audit report is the hero (design brief): real UI in CSS phone frames. Decorative: wrapped in role="img".

type Score = { label: string; value: number };
const tone = (v: number) => (v >= 8 ? "good" : v >= 5 ? "warn" : "bad");
const text = { good: "text-score-good", warn: "text-score-warn", bad: "text-score-bad" } as const;
const fill = { good: "bg-score-good", warn: "bg-score-warn", bad: "bg-score-bad" } as const;

export function Phone({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cx(
        "absolute h-[556px] w-[268px] rounded-[44px] border border-line-strong bg-paper-sunken p-2.5 shadow-card",
        className,
      )}
    >
      <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-[34px] bg-paper-raised px-4 pt-11 pb-4 text-[13px] before:absolute before:top-3 before:left-1/2 before:h-6 before:w-21 before:-translate-x-1/2 before:rounded-pill before:bg-paper-sunken">
        {children}
      </div>
    </div>
  );
}

const tileCls = "rounded-[14px] border border-line bg-paper-sunken p-3";

export function AuditScreen({ scores, topFix }: { scores: readonly Score[]; topFix: string }) {
  const overall = scores.reduce((a, s) => a + s.value, 0) / scores.length;
  return (
    <>
      <span className="eyebrow text-[10px] text-brand">Sample report</span>
      <div className="flex items-end justify-between">
        <span className="text-[44px] leading-none font-semibold tracking-[-0.04em]">{overall.toFixed(1)}</span>
        <span className="font-mono text-ink-muted">/ 10</span>
      </div>
      {scores.map((s) => (
        <div key={s.label} className={tileCls}>
          <div className="flex justify-between font-mono">
            <span>{s.label}</span>
            <span className={text[tone(s.value)]}>{s.value.toFixed(1)}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-line">
            <i className={cx("block h-full rounded-pill", fill[tone(s.value)])} style={{ width: `${s.value * 10}%` }} />
          </div>
        </div>
      ))}
      <div className="rounded-[14px] border border-saffron/30 bg-saffron-tint p-3 text-[12px] leading-normal">
        Top fix: {topFix}
      </div>
    </>
  );
}

export function SprintScreen() {
  const rows: [string, string, boolean][] = [
    ["flutter upgrade", "3.47 ✓", true],
    ["analyze --fatal", "0 issues", true],
    ["tests", "pass", true],
    ["iOS → SPM", "done", true],
    ["Play + App Store", "in review", false],
  ];
  return (
    <>
      <span className="eyebrow text-[10px] text-brand">Release checklist</span>
      <b className="text-[22px] leading-[1.1] font-semibold tracking-[-0.03em]">Release 1.10.0</b>
      {rows.map(([k, v, ok]) => (
        <div key={k} className={cx(tileCls, "flex justify-between font-mono")}>
          <span>{k}</span>
          <span className={ok ? "text-score-good" : "text-score-warn"}>{v}</span>
        </div>
      ))}
      <div className="mt-auto grid h-11 place-items-center rounded-pill bg-brand text-[14px] font-semibold text-on-brand">
        Checks done
      </div>
    </>
  );
}

export const sampleAudit = {
  scores: [
    { label: "Architecture", value: 6 },
    { label: "Crash risk", value: 4 },
    { label: "Performance", value: 8 },
    { label: "Store compliance", value: 8.5 },
  ],
  topFix: "setState after dispose in checkout — 61% of crashes.",
} as const;

export function FloatCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cx(
        "absolute z-3 rounded-md border border-line-strong bg-paper-raised/90 px-4 py-3.5 shadow-card backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
