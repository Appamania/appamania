// Production audit gate (PRD v4 §22): high and critical fail the build.
//
// Exception, this advisory only: GHSA-gcqx-w48m-w2h4
// deepmerge mergeObject() can poison the prototype of the object it returns.
// There is no patched release. npm currently rates it low. The allowlist stays
// so a later severity bump does not fail CI if it returns via a dependency.
// Do not add other GHSA ids.
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const BLOCKING = new Set(["high", "critical"]);

export const ALLOWED_GHSA = new Set(["GHSA-GCQX-W48M-W2H4"]);

export function ghsaId(via) {
  const url = via && typeof via === "object" ? String(via.url ?? "") : "";
  const match = url.match(/GHSA-[0-9a-z-]+/i);
  return match ? match[0].toUpperCase() : null;
}

/** High/critical findings that are not the deepmerge exception or its dependents. */
export function blockingAdvisories(report) {
  const vulns = report?.vulnerabilities ?? {};
  const memo = new Map();

  function allowed(name, stack) {
    if (memo.has(name)) return memo.get(name);
    const vuln = vulns[name];
    if (!vuln || !BLOCKING.has(vuln.severity) || stack.has(name)) {
      memo.set(name, false);
      return false;
    }
    const vias = Array.isArray(vuln.via) ? vuln.via : [];
    if (vias.length === 0) {
      memo.set(name, false);
      return false;
    }
    stack.add(name);
    const ok = vias.every((via) => {
      if (typeof via === "string") return allowed(via, stack);
      const id = ghsaId(via);
      const severity = via.severity ?? vuln.severity;
      return Boolean(id && ALLOWED_GHSA.has(id) && BLOCKING.has(severity));
    });
    memo.set(name, ok);
    return ok;
  }

  const blocking = [];
  for (const [name, vuln] of Object.entries(vulns)) {
    if (!BLOCKING.has(vuln.severity)) continue;
    if (!allowed(name, new Set())) blocking.push({ name, severity: vuln.severity });
  }
  return blocking;
}

function run() {
  const result = spawnSync("npm", ["audit", "--omit=dev", "--json"], { encoding: "utf8" });
  if (!result.stdout) {
    process.stderr.write(result.stderr || "npm audit produced no JSON\n");
    process.exit(result.status || 1);
  }
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    process.stderr.write(result.stdout);
    process.exit(1);
  }
  const blocking = blockingAdvisories(report);
  if (blocking.length === 0) {
    console.log("Production audit: no blocking high/critical advisories.");
    console.log("Excepted if present: GHSA-gcqx-w48m-w2h4 (deepmerge, no fix).");
    return;
  }
  spawnSync("npm", ["audit", "--omit=dev", "--audit-level=high"], { stdio: "inherit" });
  console.error("High/critical production advisories outside GHSA-gcqx-w48m-w2h4:");
  for (const item of blocking) console.error(`- ${item.name} (${item.severity})`);
  process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
