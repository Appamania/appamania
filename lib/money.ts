// Money is integer minor units everywhere (PRD §30). Format only through this module (§19.12).

const locale = (currency: string) => (currency === "INR" ? "en-IN" : "en-US");

/** Minor-unit exponent from Intl: INR/USD 2, JPY 0, KWD 3. No currency table. */
export function exponent(currency: string): number {
  return new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

/**
 * 123450 INR -> "₹1,234.50". `accounting` renders negatives in parentheses (finance tables).
 * `trim` drops zero fractions for marketing prices ("₹7,999").
 */
export function formatMinor(
  minor: number,
  currency: string,
  opts: { accounting?: boolean; trim?: boolean } = {},
): string {
  const exp = exponent(currency);
  const hasFraction = minor % 10 ** exp !== 0;
  return new Intl.NumberFormat(locale(currency), {
    style: "currency",
    currency,
    currencySign: opts.accounting ? "accounting" : "standard",
    minimumFractionDigits: opts.trim && !hasFraction ? 0 : exp,
    maximumFractionDigits: exp,
  }).format(minor / 10 ** exp);
}

/** "1,234.5" -> 123450 for INR. Rejects more decimals than the currency allows. */
export function toMinor(major: string | number, currency: string): number {
  const exp = exponent(currency);
  const s = String(major).replace(/,/g, "").trim();
  const m = /^(-?)(\d+)(?:\.(\d*))?$/.exec(s);
  if (!m) throw new Error(`Not an amount: ${major}`);
  const frac = m[3] ?? "";
  if (frac.length > exp) throw new Error(`${currency} allows ${exp} decimal places`);
  // String math: no float rounding on money.
  const value = Number(m[2]) * 10 ** exp + Number(frac.padEnd(exp, "0") || 0);
  return m[1] ? -value : value;
}
