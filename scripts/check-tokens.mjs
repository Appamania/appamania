// Design-token lint (PRD v4 §6–§8, design brief). Fails on:
//  - raw hex colors outside styles/
//  - Tailwind default palette classes (bg-green-500, text-gray-600, ...)
//  - emoji in UI code and content
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["app", "components", "features", "lib", "config", "content", "emails"];
const EXT = /\.(tsx?|css|mdx?)$/;
const palette =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const rules = [
  { name: "raw hex color", re: /(?<![\w&/])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g },
  { name: "default Tailwind palette", re: new RegExp(`\\b[\\w:-]*-(?:${palette})-\\d{2,3}\\b`, "g") },
  // Tailwind default text sizes are reset in globals.css and silently fall back to body size.
  { name: "default Tailwind text size", re: /(?<![\w-])(?:[\w:-]*:)?text-(?:xs|sm|base|lg|[2-9]?xl)\b/g },
  // Extended_Pictographic minus ©, ®, ™ (legit in footers).
  { name: "emoji", re: /(?![©®™])\p{Extended_Pictographic}/gu },
];

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXT.test(p) && !/\.test\.ts$/.test(p)) yield p;
  }
}

let failures = 0;
const todos = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        const todo = /TODO\((content|legal|HR|razorpay|CA)\)/.exec(line);
        if (todo) todos.push(`${relative(".", file)}:${i + 1} ${todo[0]}`);
        for (const { name, re } of rules) {
          for (const m of line.matchAll(re)) {
            failures++;
            console.error(`${relative(".", file)}:${i + 1} — ${name}: ${m[0]}`);
          }
        }
      });
  }
}
// Open content/legal markers are listed, not failed (brief: CI lists them).
if (todos.length) console.log(`check:tokens — ${todos.length} open TODO marker(s):\n  ${todos.join("\n  ")}`);
if (failures) {
  console.error(
    `\ncheck:tokens — ${failures} violation(s). Use tokens (bg-paper, text-ink, bg-brand, …); see styles/tokens.css.`,
  );
  process.exit(1);
}
console.log("check:tokens — ok");
