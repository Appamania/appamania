// Date formatting (PRD §21). Store UTC; due dates are `date` strings (YYYY-MM-DD). Format only here.

const DAY = 86_400_000;
const IST = "Asia/Kolkata";

/** Parse a timestamp or a YYYY-MM-DD date. Plain dates are treated as UTC midnight. */
function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d);
}

/** "12 Oct 2026". Plain dates render in UTC so a due date never shifts a day. */
export function formatAbsolute(d: Date | string, locale = "en-IN", timeZone?: string): string {
  const isPlainDate = typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: isPlainDate ? "UTC" : timeZone,
  }).format(toDate(d));
}

/** Relative ("in 3 days", "2 hours ago") when within 7 days, absolute otherwise. */
export function formatRelative(d: Date | string, now: Date = new Date(), locale = "en-IN"): string {
  const diff = toDate(d).getTime() - now.getTime();
  if (Math.abs(diff) >= 7 * DAY) return formatAbsolute(d, locale);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", DAY],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  for (const [unit, ms] of units) if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  return rtf.format(0, "minute");
}

/** Indian FY label, "26-27". Uses the IST calendar date, matching the DB invoice numbering. */
export function fyLabel(d: Date = new Date()): string {
  const [y, m] = new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit" })
    .format(d)
    .split("-")
    .map(Number);
  const start = m >= 4 ? y : y - 1;
  const yy = (n: number) => String(n % 100).padStart(2, "0");
  return `${yy(start)}-${yy(start + 1)}`;
}
