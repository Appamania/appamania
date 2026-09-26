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
