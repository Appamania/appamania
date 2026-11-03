// WCAG contrast for every token pair the design system promises (PRD §7, §23), all three themes.
// Reads styles/tokens.css directly so the check can't drift from the tokens.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`missing block ${selector}`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

const themes = {
  night: block(':root, [data-theme="night"]'),
  dark: block('[data-theme="dark"]'),
  light: block('[data-theme="light"]'),
};

function resolve(value: string, vars: Record<string, string>): string {
  const v = /^var\((--[\w-]+)\)$/.exec(value);
  return v ? resolve(vars[v[1]] ?? "", vars) : value;
}

function luminance(hex: string): number {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT = 4.5;
const UI = 3;
const grounds = ["--paper", "--paper-raised", "--paper-sunken"];
const pairs: [fg: string, bg: string, min: number][] = [
  ...grounds.flatMap((g): [string, string, number][] => [
    ["--ink", g, TEXT],
    ["--ink-muted", g, TEXT],
    ["--brand", g, TEXT], // links and brand text
    ["--danger", g, TEXT],
    ["--line-strong", g, UI], // control borders
    ["--focus", g, UI],
  ]),
  ["--on-brand", "--brand", TEXT],
  ["--on-brand", "--brand-hover", TEXT],
  ["--ink", "--brand-tint", TEXT],
  ["--brand", "--brand-tint", TEXT],
  ["--on-saffron", "--saffron", TEXT],
  ["--ink", "--saffron-tint", TEXT],
  ["--on-night", "--night", TEXT],
  ["--on-night-muted", "--night", TEXT],
  ["--score-good", "--paper-raised", UI],
  ["--score-warn", "--paper-raised", UI],
  ["--score-bad", "--paper-raised", UI],
];

describe.each(Object.entries(themes))("%s theme", (_, vars) => {
  it.each(pairs)("%s on %s ≥ %s:1", (fg, bg, min) => {
    const a = resolve(vars[fg], vars);
    const b = resolve(vars[bg], vars);
    expect(a, `${fg} unresolved`).toMatch(/^#[0-9a-f]{6}$/i);
    expect(b, `${bg} unresolved`).toMatch(/^#[0-9a-f]{6}$/i);
    expect(ratio(a, b), `${fg} ${a} on ${bg} ${b}`).toBeGreaterThanOrEqual(min);
  });
});
