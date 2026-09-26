# Appamania — Claude Code Build Kit

Everything needed to build the Appamania platform with Claude Code from `appamania-prd-v3.md`.

**Contents**
1. How to use this kit
2. Repository bootstrap (you do this once, by hand)
3. `CLAUDE.md` (copy into repo root)
4. `docs/design-brief.md` (copy; imported by `CLAUDE.md`)
5. `.claude/` configuration: commands, subagents, settings/hooks, MCP
6. Kickoff prompt (Phase 0)
7. Phase prompts (P1 → P6, in ship order)
8. Review, verification and recovery prompts
9. PRD section map

**Precedence when anything conflicts:** PRD v3 > `CLAUDE.md` > `docs/design-brief.md` > any skill or general best practice. If the PRD is silent, Claude asks before inventing product behavior.

---

## 1. How to use this kit

1. Bootstrap the repo (§2). Put the PRD at `docs/PRD.md`.
2. Copy `CLAUDE.md`, `docs/design-brief.md` and the `.claude/` files from this kit.
3. Start Claude Code in the repo root. Switch to **plan mode** (Shift+Tab) and paste the **Kickoff prompt** (§6). Approve the plan it proposes; it then scaffolds Phase 0.
4. For each phase: start a **fresh session** (or `/clear`), plan mode on, run `/phase <id>` (or paste the phase prompt from §7). Review the plan against the PRD sections listed, approve, let it build.
5. After each phase: run `/verify`, then `/design-review` (UI phases) and `/rls-audit` (data phases). Fix findings in the same session. Merge only when all pass.
6. When Claude repeats a mistake, add a one-line rule to `CLAUDE.md` under "Lessons". Keep `CLAUDE.md` short; long guidance belongs in `docs/`.
7. One phase per branch, one PR per phase, squash merge.

Session hygiene:
- Keep sessions scoped to one phase. Use `/compact` when context gets heavy; `/clear` between phases.
- Use `/rewind` (or double Esc) to roll back a bad direction instead of patching on top of it.
- Never paste the whole PRD into chat. Claude reads only the sections a phase needs (§9 map).

---

## 2. Repository bootstrap (manual, once)

```bash
# 1. Accounts ready: GitHub, Vercel Pro, Supabase (staging free + production Pro, region Mumbai),
#    Razorpay (test keys), Resend, Sentry.  See PRD §39–§42, Appendix C.

# 2. Repo
mkdir appamania && cd appamania && git init
mkdir -p docs .claude/commands .claude/agents
cp ~/Downloads/appamania-prd-v3.md docs/PRD.md
cp ~/Downloads/appamania-claude-code-kit.md docs/claude-code-kit.md   # phase prompts live here

# 3. Tooling on your machine
#    Node 22 LTS, Docker (for `supabase start`), Supabase CLI, Flutter (for demos, later), Claude Code.

# 4. Copy the files from this kit:
#    CLAUDE.md, docs/design-brief.md, .claude/commands/*.md, .claude/agents/*.md,
#    .claude/settings.json, .mcp.json

git add . && git commit -m "chore: add PRD, CLAUDE.md and Claude Code config"
```

Do not create the Next.js app by hand; Phase 0 does it so the structure matches PRD §29.

---

## 3. `CLAUDE.md`

````markdown
# Appamania platform

One-person mobile product studio: portfolio-first marketing site, self-serve checkout,
invite-only client portal, admin console, Razorpay billing, GST-ready finance exports.

Source of truth: @docs/PRD.md (v3). Design brief: @docs/design-brief.md.
Read only the PRD sections a task needs (section map at the top of docs/PRD.md; §-numbers).
If the PRD is silent or ambiguous on product behavior: STOP and ask. Do not invent.

## Stack (PRD §28) — do not add to this list without asking
Next.js App Router + React Server Components + Server Actions, TypeScript strict,
Tailwind CSS v4 mapped to tokens, Supabase (Postgres, Auth, Edge Functions/Deno),
Razorpay (Payment Links + Subscriptions), Resend, zod, lucide-react, MDX, Vitest,
Playwright + @axe-core/playwright, pgTAP (`supabase test db`), Sentry.
NOT allowed: ORMs, global state libraries, UI kits in default state, CSS-in-JS,
animation libraries (Framer Motion, GSAP), date libraries, lodash, axios, CMS.

## Commands
- `npm run dev` — local app (needs `supabase start`)
- `npm run lint && npm run typecheck`
- `npm run check:tokens` — bans raw hex / default Tailwind palette outside styles/
- `npm test` — Vitest
- `supabase db reset && supabase test db` — migrations + pgTAP
- `npm run e2e` — Playwright (local stack)
- `npm run build`
A task is not done until lint, typecheck, check:tokens, unit, pgTAP and build pass.

## Architecture rules (PRD Part III)
- Feature-first: `features/<name>/{actions.ts,queries.ts,schema.ts,components/}`. No repository
  or service layers. `queries.ts` calls Supabase directly; RLS authorizes.
- Business rules that must never drift live in Postgres functions/triggers: invoice numbering,
  tax split, paid status, progress, checkout recording, subscription charges.
- Server Components by default. `'use client'` only on interactive leaves.
- Every mutation = Server Action with zod validation, returns `{ ok } | { fieldErrors } | { formError }`.
- `import 'server-only'` in lib/supabase/admin.ts, lib/email.ts, lib/razorpay.ts, every actions.ts.
- Service-role key never reaches the browser. Money amounts never come from the request.
- Money = integer minor units everywhere. Format only via `lib/money.ts`.
- Dates stored UTC; due dates are `date`. Format only via `lib/dates.ts`.
- Package names/prices/plan IDs only in `config/packages.ts`. Site constants only in `config/site.ts`.

## Database rules (PRD §30–§31, §44)
- Forward-only numbered migrations in `supabase/migrations`. Never edit an applied migration.
- Every new table: RLS enabled + policies + pgTAP tests in the same change.
- RLS helpers `is_admin()` / `my_client_ids()` check `status = 'active'`. Never bypass them.
- Finance rows are never hard-deleted (`on delete restrict`).
- Webhook writes must be idempotent (unique Razorpay IDs, `ignoreDuplicates`).

## Design rules (PRD Part II, details in docs/design-brief.md)
- Use tokens only (`bg-surface`, `text-fg`, `bg-primary`…). No raw hex, no `bg-green-500`.
- Use components from `components/ui` and `components/marketing`. New visual pattern → add to the
  design system first, then use it.
- Density: marketing `comfortable`, portal/admin `compact`. Brand: green; `/studio` is `dusk`.
- Motion: CSS only, transform/opacity only, respect `prefers-reduced-motion`.
- Accessibility: WCAG 2.2 AA; keyboard complete; visible focus ring; labels on every field.
- Copy: sentence case, verb-first buttons, no "please/successfully/simply", no AI clichés.

## Workflow
- Plan first for anything touching more than 2 files. Show the plan with PRD § references.
- Small commits, conventional messages (`feat(billing): …`). One phase per branch.
- Write tests with the code, not after. For DB work write pgTAP first.
- After UI work run the `design-reviewer` subagent; after DB/auth/billing run `rls-auditor`.
- Prefer deleting code to adding it. The simplest thing that meets the PRD acceptance criteria wins.
- When blocked by an external dependency (Razorpay feature, HR, CA), stub behind a clear TODO
  referencing PRD Appendix C and continue.

## Lessons
(Add one line each time a mistake repeats.)
````

---

## 4. `docs/design-brief.md`

````markdown
# Design brief — Appamania

Read with PRD Part II (§9–§26). The PRD defines tokens and components; this brief defines
the taste: how things should feel and what to avoid.

## Art direction
- **Mood:** calm, precise, engineered. A studio that ships. Confident, not loud.
- **Reference feel:** editorial product sites and developer tools with generous whitespace,
  strong type hierarchy, real product visuals. Not a template, not a crypto landing page.
- **Brand:** forest green primary, lime used sparingly as a spark (availability, highlights, logo
  dot). Green-tinted neutrals. Dusk (plum, slate, teal, mustard) only under `/studio`.
- **Dials:** marketing — layout variance 7/10, motion 5/10, density 3/10.
  Portal/admin — variance 2/10, motion 2/10, density 7/10.

## Typography
- Archivo 600/700 for display, Space Grotesk 400/500 for UI and body, JetBrains Mono for code,
  IDs, invoice numbers, stats labels, the command palette input.
- Hierarchy through weight, size and color together. The hero H1 uses `--step-4` but never
  more than 3 lines at 360px; tighten the copy before shrinking the type.
- Sentence case everywhere. Letter-spacing −0.02em from `--step-3` up. Prose max 68ch.
- `tabular-nums` for every number that can change (prices, money, percentages, dates in tables).

## Layout
- Marketing grid: 12 columns, max 1200px, gutters `--gutter`, sections separated by `--section-y`.
- Hero: asymmetric split. Left: eyebrow (availability pill), H1, one-sentence subhead, two CTAs,
  proof chips. Right: DevicePlayer with a real app poster, slight float animation.
- Proof: BentoProof asymmetric grid (e.g. 7/5 split on first row, 4/4/4 below) — never a row
  of three identical cards. Collapse to one column below 768px.
- Use zig-zag (text/visual alternating) for case study teasers; horizontal scroll rail for studio
  products on mobile.
- Generous whitespace on marketing; compact, table-first layouts in portal/admin.
- Every section has one job and at most one primary CTA.

## Surfaces and depth
- Flat surfaces with 1px hairline borders in `--border`; elevation by lighter surface in dark mode.
- Shadows only `--shadow-1` (hover) and `--shadow-2` (menus, dialogs). No glows, no neon,
  no gradient text, no glassmorphism on content.
- No pure black (`#000`) or pure white text on dark; use tokens.
- Radius: 10px controls, 16px cards, 44px device frames.

## Motion
- Purpose: orientation and feedback, never decoration.
- Durations 120/200/320ms; easing `--ease-out` for entrances.
- Allowed on marketing: once-only section reveals (12px + fade), staggered via CSS
  `animation-delay: calc(var(--i) * 60ms)`, DevicePlayer float, GateLadder connector fill,
  hover lift (−2px) on tiles, press scale 0.98, scroll-driven progress with
  `animation-timeline: view()` as progressive enhancement, cross-document View Transitions.
- Forbidden: scroll-jacking, parallax backgrounds, custom cursors, autoplay video with sound,
  infinite attention-seeking animations near text, `window.addEventListener('scroll')`.
- Reduced motion: everything collapses to instant state changes.

## Imagery
- Real app screenshots and Flutter demos in CSS device frames. No stock photos, no AI people,
  no Unsplash. One real portrait on /about.
- AVIF/WebP, explicit width/height, `sizes` set, lazy below the fold, priority for the hero poster.
- Icons: Lucide at 1.5 stroke, 16/20/24 px, `currentColor`. No emoji anywhere in UI or code.

## Copy
- Specific nouns and numbers ("4 apps live", "160/160 pub points", "₹9,999/month").
- Banned words: elevate, seamless, unleash, next-gen, cutting-edge, world-class, leverage,
  empower, revolutionize, supercharge, robust (as filler), innovative.
- No placeholder people or brands ("John Doe", "Acme"). Use real studio data or clearly
  marked `TODO(content)` markers that CI lists.
- Prices exactly as `config/packages.ts`; INR shows "+ GST if applicable".

## Interaction quality (Web Interface Guidelines baseline)
- Every interactive element reachable and operable by keyboard; visible `:focus-visible` ring.
- Hit targets ≥ 24px (≥ 44px on touch). Buttons are `<button>`, links are `<a>`.
- Forms: label above field, errors inline below with `aria-describedby`, validate on blur and
  submit, keep user input on error, disable double-submit via pending state (not by disabling
  the button before submit), `autocomplete` attributes on name/email/tel/organization fields,
  correct `inputmode` and `type`.
- URLs reflect state (filters, tabs, estimate builder steps) so back/forward and sharing work.
- Loading: skeletons that match final layout; optimistic UI only for task status.
- Empty states name the space and offer one action. Errors say what happened and what to do.
- Dark mode via `color-scheme` + `light-dark()`; set `<meta name="theme-color">` for both modes.
- Respect safe areas on mobile (`env(safe-area-inset-*)`) for sticky header and bottom actions.
- No layout shift: reserve space for images, fonts use `next/font`, skeletons match size.
- Numbers, dates and currency localized (`en-IN` for INR, `en-US` for USD).

## Performance budgets (PRD §7)
- Landing: LCP < 2.0s (4G), CLS < 0.1, INP < 200ms, JS < 120KB gz on first load.
- DevicePlayer iframe, EstimateBuilder and CommandPalette are lazy client islands; the Flutter
  demo is never requested before the user presses Play.
- Portal: TTFB < 500ms from India (functions in `bom1`, DB in Mumbai).

## Definition of "looks done"
A screen is done only when it is checked at 375px, 768px and 1440px, in light and dark, with
keyboard only, with reduced motion on, with empty/loading/error states rendered, and with real
(or explicitly marked TODO) content — no lorem ipsum.
````

---

## 5. `.claude/` configuration

### 5.1 `.claude/commands/phase.md`
````markdown
---
description: Plan and build one PRD phase
argument-hint: <phase id, e.g. P1, P2, P2b, P5b, P3, P4, P5, P6>
---
Build phase $ARGUMENTS of the Appamania platform.

1. Open docs/PRD.md §51 and find phase $ARGUMENTS. Open the phase prompt for $ARGUMENTS in
   docs/claude-code-kit.md §7 and follow it exactly.
2. Read only the PRD sections that prompt lists. Summarize the acceptance criteria you will meet.
3. Produce a numbered plan: files to create/change, migrations, tests, and which acceptance
   criteria each step satisfies. Flag anything the PRD leaves ambiguous and ask before building.
4. After approval, build in small commits. Tests with code.
5. Finish with /verify and report: done criteria met, open TODOs, anything deferred and why.
````

### 5.2 `.claude/commands/verify.md`
````markdown
---
description: Run the full quality gate and fix failures
---
Run, in order, and fix every failure before moving on:
1. npm run lint && npm run typecheck
2. npm run check:tokens
3. npm test
4. supabase db reset && supabase test db
5. npm run build
6. npm run e2e (if the phase touched UI or flows)
Then list: any RLS table without policies (query in PRD §44), any `TODO(` markers added in this
branch, and bundle size of the landing route vs the 120KB budget. Report results as a checklist.
Do not claim success for a step you did not run.
````

### 5.3 `.claude/commands/design-review.md`
````markdown
---
description: Review changed UI against the design system and web interface guidelines
argument-hint: [file or glob; default = UI files changed on this branch]
---
Use the design-reviewer subagent on $ARGUMENTS (or `git diff --name-only main -- app components`).
Also fetch https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
and apply those rules. Output findings as `file:line — rule — fix`, grouped by severity
(blocker, should-fix, nit). Then fix blockers and should-fix items.
````

### 5.4 `.claude/commands/rls-audit.md`
````markdown
---
description: Audit database access control and billing idempotency
---
Use the rls-auditor subagent on supabase/migrations and supabase/functions.
Report every table, its RLS state, policies for admin and client, and any gap versus PRD §31,
§30.3 and §35. Write missing pgTAP tests for every gap before fixing it.
````

### 5.5 `.claude/commands/ship-check.md`
````markdown
---
description: Pre-merge checklist for a phase PR
---
Produce the PR description for this branch:
- Phase, PRD sections implemented, acceptance criteria with pass/fail
- Migrations added (and rollback/fix-forward plan)
- Screenshots list to capture (375/1440, light/dark) for UI routes changed
- Security notes (secrets, RLS, webhooks), performance notes (landing JS size)
- Deferred items with PRD references
Run /verify first; refuse to write "ready to merge" if any gate failed.
````

### 5.6 `.claude/agents/design-reviewer.md`
````markdown
---
name: design-reviewer
description: Reviews UI code against Appamania's design system (PRD Part II) and docs/design-brief.md. Use after any UI change.
tools: Read, Grep, Glob, WebFetch
---
You are a senior product designer and front-end reviewer. You do not write code; you report.

Check each changed UI file for:
1. Tokens only: no raw hex, no default Tailwind palette, no arbitrary colors/shadows/radii.
2. Correct component usage (components/ui, components/marketing) instead of one-off markup.
3. Density and brand scoping (marketing comfortable, portal/admin compact, /studio dusk).
4. Typography: correct families, scale steps, tabular-nums on numbers, sentence case.
5. Layout: asymmetric marketing sections, no row of three identical cards, mobile single column.
6. Motion: CSS only, transform/opacity, reduced-motion fallback, no scroll listeners.
7. Accessibility: semantics, labels, focus, ARIA only where needed, contrast, target size.
8. States: empty, loading, error, disabled/pending, overdue — all present where relevant.
9. Copy: banned words, button verbs, error message pattern, no placeholder people/brands.
10. Performance: client islands minimal, images sized, demo iframe only on interaction.

Output: `file:line — issue — PRD/brief reference — suggested fix`, grouped blocker / should-fix / nit.
````

### 5.7 `.claude/agents/rls-auditor.md`
````markdown
---
name: rls-auditor
description: Audits Supabase migrations, RLS policies, SQL functions and Edge Functions for data isolation and payment safety. Use after any DB, auth or billing change.
tools: Read, Grep, Glob, Bash
---
You are a database security reviewer. You do not change schema yourself; you report and propose tests.

Verify:
1. RLS enabled on every public table; admin_all + client_read policies match PRD §31 and §30.3.
2. Helpers is_admin()/my_client_ids() are SECURITY DEFINER with `set search_path = ''` and check status.
3. Security-definer views/functions filter explicitly (is_admin() or my_client_ids()).
4. Clients cannot read drafts, hidden tasks, expenses, leads, audit_log, package_templates, other clients' rows.
5. Offboarded clients read nothing even with a valid JWT.
6. Invoice immutability triggers, gapless numbering under concurrency, paid status incl. TDS and refunds.
7. Webhook: signature on raw body, constant-time compare, idempotent writes, amounts from DB/config,
   record_checkout and record_subscription_charge idempotent on payment ID.
8. No service-role key or Razorpay secret reachable from client bundles (grep NEXT_PUBLIC_ and imports).

Run `supabase test db` and report. Output: gap — risk — pgTAP test to add — fix.
````

### 5.8 `.claude/settings.json` (hooks + permissions)
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npx playwright *)",
      "Bash(supabase start)",
      "Bash(supabase stop)",
      "Bash(supabase db reset)",
      "Bash(supabase test db)",
      "Bash(supabase migration new *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)"
    ],
    "deny": [
      "Bash(supabase db push*)",
      "Bash(supabase link*)",
      "Bash(supabase functions deploy*)",
      "Bash(vercel *)",
      "Bash(git push --force*)",
      "Read(.env)",
      "Read(.env.local)",
      "Read(.env.production*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npx prettier --write --log-level warn $(git diff --name-only --diff-filter=AM | grep -E '\\.(ts|tsx|css|md|json)$') 2>/dev/null || true" },
          { "type": "command", "command": "npm run -s check:tokens" }
        ]
      }
    ]
  }
}
```
Deploys, remote DB pushes and linking stay manual (you run them after review). Adjust the hook if prettier on every edit feels slow; `check:tokens` is the one that matters.

> Repo note: the committed `.claude/settings.json` guards both hooks so they no-op until Phase 0
> installs prettier and adds the `check:tokens` script, and `check:tokens` exits 2 on failure so
> Claude sees the violation and fixes it.

### 5.9 `.mcp.json` (optional, staging only, read-only)
```json
{
  "mcpServers": {
    "supabase-staging": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=<STAGING_REF>&read_only=true"
    }
  }
}
```
Never point an MCP server at production. Local development uses `supabase start`, which needs no MCP.

> Repo note: committed as `.mcp.json.example` (and `.mcp.json` is gitignored) so an unfilled
> `<STAGING_REF>` never breaks sessions. Copy it to `.mcp.json` and set the staging ref to enable.

---

## 6. Kickoff prompt (Phase 0) — paste in plan mode

```text
You are the lead engineer building the Appamania platform: a portfolio-first studio website with
self-serve checkout, an invite-only client portal, an admin console, Razorpay billing and
GST-ready finance exports. You work as a senior full-stack engineer, product-minded designer
and security reviewer in one.

Sources of truth, in precedence order:
1. docs/PRD.md (v3) — product, design system, architecture, infrastructure. Cite § numbers.
2. CLAUDE.md — working rules.
3. docs/design-brief.md — visual taste and interaction quality.
4. docs/claude-code-kit.md — phase prompts (§7) and review prompts (§8).

Phase 0 goal: understand the whole system once, then scaffold the repo so every later phase
starts from a correct, tested skeleton. No product features yet.

Step A — Understand (read-only):
- Read docs/PRD.md end to end once. Build a mental model of Parts I–V.
- Produce a SHORT summary (max 25 bullets): the four jobs of the platform, the payment flows
  (§35.1), the data model entities (§30), the RLS model (§31), the design system layers (§10–§12),
  and the ship order (§51).
- List every ambiguity or contradiction you find in the PRD with § references and your proposed
  resolution. Do not resolve silently.

Step B — Plan: propose the Phase 0 plan below as numbered steps with files. Wait for approval.

Step C — Build Phase 0:
1. Insert a "Section map" table at the top of docs/PRD.md (every §, one-line purpose, which
   phase uses it). Do not change any other PRD text.
2. Create the Next.js app at repo root (App Router, TypeScript strict, ESLint, Tailwind v4,
   no src/ dir, import alias @/*). Remove all starter content.
3. Structure exactly as PRD §29 (empty route folders get a minimal placeholder page that uses
   the layout, not "Hello world" text).
4. styles/tokens.css and app/globals.css exactly per PRD §25.1–§25.2. Fonts via next/font
   (Archivo 600/700, Space Grotesk 400/500, JetBrains Mono 400) exposed as CSS variables used by
   tokens.css. Theme bootstrap script per §25.3. `<html lang="en-IN">`, theme-color metas.
5. scripts/check-tokens.mjs + `npm run check:tokens`: fail on raw hex outside styles/, on default
   Tailwind palette classes (slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|
   emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d, and on emoji in
   app/ components/ content/.
6. scripts/check-contrast.mjs: parse tokens.css semantic pairs (§12) for both brands and modes and
   assert WCAG targets (4.5:1 text, 3:1 UI). Add to `npm test`.
7. config/packages.ts from PRD §4.3 (INR/USD in minor units, self-serve flag, Care plan IDs as
   env-backed placeholders) + Vitest test: every price ends in 9 in major units.
   config/site.ts: contact email, conflict industries (placeholder list with TODO(HR) marker),
   founding slots, response SLA, payments-down banner flag.
8. lib/money.ts (formatMinor, toMinor, exponent via Intl) and lib/dates.ts (relative < 7 days,
   absolute otherwise, en-IN/en-US) with Vitest tests (INR, USD, JPY, KWD; FY label).
9. supabase init; empty migrations folder; seed.sql placeholder; `supabase test db` runs an
   empty pgTAP smoke test.
10. Vitest, Playwright (+ @axe-core/playwright) configs; one smoke e2e that loads `/` and runs axe.
11. .github/workflows/ci.yml per PRD §43 (lint, typecheck, check:tokens, supabase start/reset/test,
    vitest, build, e2e). .env.example per Appendix A.
12. next.config.ts with security headers and CSP from §47.2 and redirects from §38.
13. README: how to run locally in 5 commands.

Definition of done: /verify passes; `npm run dev` shows the placeholder landing in both themes
with correct fonts and tokens; CI file present. Then stop and report.

Rules: follow CLAUDE.md. Do not add dependencies beyond PRD §28 without asking. Do not implement
features from later phases. Ask before deviating from any PRD section.
```

---

## 7. Phase prompts (ship order)

Each prompt assumes a fresh session in plan mode on a new branch `phase/<id>`. Paste as-is or run `/phase <id>`.

### P1 — Foundation

```text
Phase P1 — Foundation. Branch: phase/p1.

Read: PRD §9–§25 (design system), §28–§32 (stack, structure, data model 0001–0003, RLS, auth),
§39, §42–§45 (environments, secrets, CI/CD, migrations, backups), §50 (tests).

Build:
1. UI primitives in components/ui per §19.1–§19.13 and §18 component tokens: Button (variants,
   sizes, loading), Input, Textarea, Select, Checkbox, Radio, Switch, Field (label/helper/error
   wiring), Badge/StatusPill (mapping from §20 as a typed map), Card (default/interactive/stat),
   Table (sticky head, numeric alignment, stacked layout below md), Progress, Dialog (native
   <dialog>, typed-confirmation variant), Toast (role status/alert), Avatar, Money, EmptyState,
   Skeleton. Every component: keyboard, focus ring, reduced motion, dark mode, density-aware.
2. /dev/ui route (dev-only, notFound() in production) rendering every primitive in every state,
   both brands, both densities — the living style guide.
3. Migrations 0001_core, 0002_auth, 0003_rls exactly from §30–§31, plus project_progress view.
4. pgTAP tests: RLS isolation (client A vs B), drafts hidden, hidden tasks hidden, offboarded
   client reads nothing, admin reads all, CI query asserting no public table without RLS.
5. Auth per §32: invite-only (signup disabled in supabase/config.toml), /login (password + magic
   link + reset), /auth/callback, lib/auth.ts requireAdmin (with aal2) / requireClient, TOTP
   enrolment screen for admin, middleware session refresh.
6. Layouts: marketing (header/footer skeleton), portal and admin (sidebar + topbar, compact
   density, mobile drawer), error.tsx / not-found.tsx / loading.tsx per group.
7. seed.sql: admin, two clients with users, projects, tasks (some hidden), for local dev and e2e.
8. .github/workflows/backup.yml per §45 (encrypted weekly pg_dump; secrets referenced, not set).
9. /api/health per §46.

Acceptance: §6 E3.1–E3.4, E6.4 (isolation), §24 accessibility baseline on /dev/ui and /login.
Tests: pgTAP (RLS), Vitest (components' pure logic), Playwright (login, role redirect,
client cannot open another client's project URL, axe on /login and /dev/ui).
Out of scope: marketing content, leads, billing.
Stop and ask if: any RLS rule in §31 seems to conflict with a user story.
```

### P2 — Marketing site + leads

```text
Phase P2 — Marketing site and lead intake. Branch: phase/p2.

Read: PRD §1–§4 (positioning, philosophy, packages, terms), §6 E1, E2, §19.14, §21–§23,
§26 (emails), §33 (lead intake), §37 (studio content), §38 (SEO/analytics), docs/design-brief.md.

Build:
1. Marketing blocks in components/marketing per §19.14: Hero, ProofChips, CaseStudyCard,
   PackageCard, ProcessSteps, TestimonialCard, TimelineCompact, CTASection, Footer, ProductCard
   (Dusk), PriceTag, FoundingSlots, currency toggle (IN default via header geo, persisted).
2. Pages per §22: /, /work, /work/[slug], /services, /studio, /studio/[slug] (data-brand="dusk"
   layout), /about, /contact, /legal/privacy, /legal/terms, /legal/refunds.
   - Landing composition per design brief: asymmetric hero (DevicePlayer slot with static poster
     for now — interactive version is P2b), BentoProof placeholder grid with real numbers from
     config/content, GateLadder placeholder (static), selected work zig-zag, testimonials,
     compact experience, final CTA.
   - /services: FoundingSlots, all packages with exact prices from config/packages.ts, "What you
     pay for" infra table (§4.4), terms (§4.5), refund policy, partnership policy, FAQ via <details>.
3. MDX pipeline for content/work, content/studio, content/log with typed frontmatter (zod) and
   build-time validation. Seed 3 case studies and current studio products with TODO(content)
   where real copy/metrics are missing — never lorem ipsum.
4. Lead intake per §33: migration 0006, submitLead server action (honeypot, IP-hash rate limit,
   conflict and funding rules, `after()` emails), contact form per §33.4, admin notify + 4 ack
   variants (§26.3) as email templates in emails/, Resend client in lib/email.ts.
5. SEO per §38: metadata, sitemap.ts, robots.ts, JSON-LD, static OG images, noindex headers.
6. Analytics events per §38 table (no PII).

Acceptance: §6 E1.1–E1.8, E2.1–E2.5 (E2.6 in P3); §7 performance budgets on /.
Tests: Vitest (lead rules), pgTAP (leads RLS: admin only), Playwright (submit each funding type,
honeypot, rate limit, axe on every marketing template, 375/1440 screenshots saved as artifacts).
Design gate: run /design-review before finishing; zero blockers.
Out of scope: interactive components (P2b), checkout (P5b).
```

### P2b — Interactive portfolio

```text
Phase P2b — Interactive portfolio. Branch: phase/p2b.

Read: PRD §19.15, §16 (motion by surface), §22 (/ and /start rows), §37.1 (demos), §40 (demo
origin), §47.2 (CSP frame-src), §6 E13, docs/design-brief.md (Motion, Performance).

Build:
1. DevicePlayer: poster → loading → playing → error states; iframe created only on click/Enter,
   src from config (demos.appamania.in/<slug>/), sandbox attrs per §19.15, mobile opens full-screen
   in new tab, MP4 fallback link, float animation disabled under reduced motion.
2. GateLadder: tablist with arrow keys, horizontal ≥ lg / accordion below, data from config/packages.ts.
3. EstimateBuilder on /start (URL-state wizard, 5 steps, summary with package, price, timeline,
   client infra list computed from §4.4 rules). For now the CTA routes self-serve packages to a
   "Checkout coming soon" state and larger packages to /contact with query prefill. Checkout is P5b.
4. Landing teaser version of the estimate builder (first step only, then deep-links into /start).
5. BentoProof final version with real numbers; NowShipping from content/log.
6. CommandPalette (⌘K / Ctrl+K + header button), static index generated at build.
7. Cross-document View Transitions for marketing routes; scroll-driven reveals as progressive
   enhancement; one shared IntersectionObserver helper for `.is-visible`.
8. docs/demos.md: how to build a trimmed Flutter web demo (§37.1 flags, local CanvasKit, demo
   data, no auth), deploy to the demos project, and register it in config. Do not build the
   Flutter demo itself in this repo.

Acceptance: §6 E13.1–E13.5; landing JS budget unchanged within +10KB gz (measure before/after);
no network request to demos origin before interaction (Playwright asserts).
Tests: Playwright keyboard flows for GateLadder, EstimateBuilder, CommandPalette; axe; reduced
motion run; mobile viewport DevicePlayer behavior.
Design gate: /design-review with zero blockers.
```

### P5b — Billing core + self-serve checkout + Care

```text
Phase P5b — Billing core, self-serve checkout, Care subscriptions. Branch: phase/p5b.
(Built before P3/P4 so paid work can start earliest; it includes the invoicing core from §34.)

Read: PRD §4.3–§4.6, §6 E11, E12, E14, §30.3 (0007_billing), §34 (invoicing SQL), §35 (billing
module, all subsections), §36 (finance notes), §26.1 emails, §47.3 threat model, §50 billing tests.

Build:
1. Migrations 0004_invoicing (fy_label, issue_invoice split into issue_invoice_internal +
   admin wrapper, guards, sync_invoice_paid incl. refunds) and 0007_billing (§30.3) with
   package_templates seed (milestones + client action items).
2. SQL functions record_checkout() and record_subscription_charge() per §35.6, idempotent.
3. lib/razorpay.ts createPaymentLink (§35.3), server-only.
4. /start checkout form + startCheckout server action (§35.4): conflict block before any link,
   currency by country, amount from config, lead status 'checkout', redirect to Razorpay.
   /start/success informational page.
5. Edge Function razorpay-webhook: signature verification (§35.5 + previous constant-time code),
   router for payment_link.paid (invoice/checkout/support), subscription.* (six events),
   refund.processed; invite after record_checkout when created=true.
6. Edge Function create-payment-link for admin invoice links (admin JWT check) — reused by P5 UI.
7. Care: server action to create a Razorpay subscription for a client (plan by currency), store
   short_url; portal/admin surfaces come in P4/P5 — expose a minimal admin button now.
8. Support payments (chai) on /studio: fixed amounts from config, payment links with kind=support.
9. Emails: checkout_welcome, care_autopay, care_payment_issue, refund_processed, invite.
10. Printable invoice route /invoice/[id]/print per §34 (A4 print CSS, LUT note, SAC, words).

Acceptance: §6 E11.1–E11.5, E12.1–E12.4, E14.1; E7.2, E7.4 core.
Tests (write first): pgTAP — numbering gapless under concurrent issue, tax split per supply
type, immutability, record_checkout idempotent (same payment twice → one client/invoice),
subscription charge → exactly one invoice, refund reduces paid_minor, support needs no invoice.
Deno tests — signature valid/invalid/missing, each event route, duplicate delivery no-op.
Playwright — Razorpay test mode Audit purchase end-to-end against local webhook (use a tunnel
or replay a captured test payload; document the method in docs/billing-testing.md).
Security gate: /rls-audit with zero gaps. Never log full webhook payloads containing contact data
outside the `raw` column.
Stop and ask if: Razorpay payload fields differ from those assumed (§35.7) — capture a real
test payload and show it before mapping.
```

### P3 — Admin core

```text
Phase P3 — Admin console core. Branch: phase/p3.

Read: PRD §6 E2.5–E2.6, E4, E5, E11.4, §19–§22 (admin templates), §32 (lifecycle), §33.5
(triage), §35.6 (templates), §49.2 and §49.7 (runbooks).

Build:
1. /admin dashboard: stat cards, leads needing reply (age badges), self-serve purchases awaiting
   start (3-business-day timer), deadlines this week, overdue tasks.
2. /admin/leads: filter chips in URL, age badges, mark replied, override decline with reason
   (audit), convert to client (prefilled onboarding).
3. /admin/clients and /admin/clients/[id]: onboard (invite), add member, offboard (typed
   confirmation, ban, archive projects, keep invoices), reactivate, resend invite, audit trail.
4. /admin/projects and /admin/projects/[id]: create from package template, milestones, tasks with
   inline status/due/assignee (studio/client)/visibility edits, optimistic task status only,
   updates composer with client-visible toggle, archive.
5. Audit log writes for every lifecycle and override action.

Acceptance: listed epics. Tests: Playwright admin flows incl. offboard → client loses access
immediately; pgTAP for audit writes; axe on all admin templates. Design gate: /design-review.
```

### P4 — Client portal

```text
Phase P4 — Client portal. Branch: phase/p4.

Read: PRD §6 E6, E12.4–E12.5, §19.6–§19.7, §20, §22 portal rows, §23 (client-facing glossary).

Build:
1. /portal dashboard: "Your action items" (client-assigned tasks, first), project cards with
   progress and next milestone, updates feed, outstanding invoices with Pay, Care status
   (with "Set up autopay" when created/authenticated).
2. /portal/projects/[id]: header (status, progress, deadline banner < 7 days), milestone
   timeline, tasks grouped by status (visible only), updates feed.
3. /portal/invoices/[id]: summary, Pay (payment link), print link, payment + refund history.
4. Care cancel request (creates admin task + email; admin cancels at cycle end).
5. Mobile-first checks: every portal screen usable one-handed at 375px.

Acceptance: E6.1–E6.4, E12.4–E12.5. Tests: Playwright isolation (client A never sees B, incl.
direct URLs and invoice print), axe, 375px screenshots. Design gate: /design-review.
```

### P5 — Admin billing UI + finance

```text
Phase P5 — Admin invoicing UI, manual payments, finance. Branch: phase/p5.

Read: PRD §6 E7, E8, E9, §34, §35.1 (flows A, E, F), §36, §13 (money typography), §19.5, §19.12.

Build:
1. /admin/invoices list + editor: line items (SAC, qty, unit price), supply type, place of supply,
   TDS expected, live totals preview (computed identically to SQL; SQL remains source of truth),
   issue, void with typed confirmation, create payment link, copy link.
2. Manual payment form (bank transfer/UPI/other, reference, INR value) and "Sync payment by ID".
3. Refund action (calls Razorpay refund API server-side; webhook records it).
4. Care management: start/cancel subscription per client, status history.
5. /admin/finance: FY selector, stat cards (receipts INR, GST by type, LUT exports, TDS, fees,
   refunds, support receipts, expenses), monthly receipts bar chart (inline SVG, no chart lib),
   CSV exports (invoices, receipts, refunds, expenses) streamed from server actions.
6. Expenses CRUD (receipt upload optional → Supabase Storage private bucket, if time allows).

Acceptance: E7.1–E7.4, E8.1–E8.4, E9.1–E9.3. Tests: Vitest totals preview == SQL results for
fixtures; pgTAP finance views admin-only; Playwright invoice lifecycle; CSV column snapshots.
Security gate: /rls-audit. Design gate: /design-review.
```

### P6 — Launch

```text
Phase P6 — Launch readiness. Branch: phase/p6.

Read: PRD §41 (DNS/email), §45–§49 (backups, monitoring, security, cost, runbooks), §52,
Appendix C.

Build/verify:
1. Sentry (server + client), uptime targets, daily lead-SLA and weekly overdue digests (pg_cron
   + Resend), payments-down banner flag.
2. Security headers verified on production preview; CSP report of violations resolved.
3. Legal pages final copy placeholders flagged TODO(legal) if not provided.
4. docs/runbooks/*.md from §49; docs/launch-checklist.md from Appendix C with owner and status.
5. Restore drill script and instructions (local restore of a dump + RLS tests).
6. Lighthouse CI budgets on /, /services, /start; axe across all templates; final /design-review
   and /rls-audit.

Output: a go/no-go report listing every Appendix C item, every budget, every gate.
Do NOT deploy, push DB or change DNS — list the exact manual commands for me to run.
```

---

## 8. Review, verification and recovery prompts

**Plan review (paste after Claude proposes a plan)**
```text
Before I approve: map every step to PRD § and acceptance criteria IDs, list what you are NOT
doing and why, list new dependencies (should be none), and name the riskiest step and how you
will verify it. Shorten the plan by removing anything not required by the acceptance criteria.
```

**Prove it works**
```text
Prove this phase works: run /verify, show the actual command outputs (trimmed), show Playwright
results and which acceptance criteria each test covers. Anything untested gets listed as a risk.
```

**Grill the change**
```text
Act as a skeptical staff engineer. Review this branch for over-engineering, missing states,
security holes, RLS gaps, and deviations from the PRD. Rank findings, then fix the top ones.
```

**Design polish pass**
```text
Run /design-review on the routes changed in this branch. Then open each route at 375, 768 and
1440 in light and dark in your head from the code: list anything that would look templated,
cramped, misaligned, or inconsistent with docs/design-brief.md, and fix it. No new dependencies.
```

**Simplify**
```text
This is heavier than it needs to be. Re-read the acceptance criteria and rewrite for the fewest
files, fewest client components and zero new dependencies while keeping every test green.
```

**Off track (use with /rewind if needed)**
```text
Stop. We have drifted from the PRD. Summarize what exists now vs what §<n> requires, propose the
smallest path back, and wait for approval before editing anything.
```

**Update the PRD (only when a real decision changes)**
```text
We decided <decision>. Update docs/PRD.md: the affected sections, the decision log (§54), and
the section map. Show a diff summary. Do not change unrelated text.
```

**Content pass (when real copy/metrics arrive)**
```text
Replace every TODO(content) marker with the content I paste below. Keep copy rules from
docs/design-brief.md. List any marker still unresolved.
```

---

## 9. PRD section map (by phase)

| Phase | Read these PRD sections |
|---|---|
| P0 Scaffold | Whole PRD once; then §25, §28, §29, §38 (redirects), §43, §47.2, Appendix A |
| P1 Foundation | §9–§25, §28–§32, §39, §42–§45, §50 |
| P2 Marketing + leads | §1–§4, §6 E1–E2, §19.14, §21–§23, §26, §33, §37, §38 |
| P2b Interactive | §6 E13, §16, §19.15, §22, §37.1, §40, §47.2 |
| P5b Billing core + self-serve + Care | §4.3–§4.6, §6 E11/E12/E14, §26.1, §30.3, §34, §35, §36, §47.3, §50 |
| P3 Admin core | §6 E2.5–E2.6/E4/E5/E11.4, §19–§22, §32, §33.5, §35.6, §49.2, §49.7 |
| P4 Portal | §6 E6/E12.4–E12.5, §19.6–§19.7, §20, §22, §23 |
| P5 Admin billing + finance | §6 E7–E9, §13, §19.5, §19.12, §34, §35.1, §36 |
| P6 Launch | §41, §45–§49, §52, Appendix C |

Ship order: P0 → P1 → P2 (public site live) → P2b → P5b (self-serve revenue) → P3 → P4 → P5 → P6.
Until P4 ships, self-serve buyers are delivered by email; the invite still works and the portal
shows their project as soon as P4 lands.
