# Appamania platform

One-person senior Flutter studio: marketing site (Night theme), invite-only client portal,
admin console, Razorpay invoices and audit Payment Page, FY income reports.

Source of truth: @docs/PRD.md (v4). v3 is archived in docs/archive/ — not in force. Design brief: @docs/design-brief.md.
Read only the PRD sections a task needs (section map at the top of docs/PRD.md; §-numbers).
If the PRD is silent or ambiguous on product behavior: STOP and ask. Do not invent.

## Stack (PRD §9) — do not add to this list without asking
Next.js App Router + React Server Components + Server Actions, TypeScript strict,
Tailwind CSS v4 mapped to tokens, Supabase (Postgres, Auth, Storage), Razorpay (Payment Links,
one Payment Page, webhook as a Next route), Resend + React Email, Cloudinary, Cloudflare Turnstile,
@react-pdf/renderer, next-themes, @dnd-kit/core, zod, lucide-react, MDX, Vitest,
Playwright + @axe-core/playwright, pgTAP (`supabase test db`), Sentry. Hosting: Vercel Pro `bom1`.
NOT allowed: ORMs, global state libraries, UI kits in default state, CSS-in-JS,
Supabase Edge Functions, animation libraries (Framer Motion, GSAP), date libraries, lodash, axios, CMS.

## Commands
- `npm run dev` — local app (needs `supabase start`)
- `npm run lint && npm run typecheck`
- `npm run check:tokens` — bans raw hex / default Tailwind palette outside styles/
- `npm test` — Vitest
- `supabase db reset && supabase test db` — migrations + pgTAP
- `npm run e2e` — Playwright (local stack)
- `npm run build`
A task is not done until lint, typecheck, check:tokens, unit, pgTAP and build pass.

## Architecture rules (PRD §10–§11)
- Feature-first: `features/<name>/{actions.ts,queries.ts,schema.ts,components/}`. No repository
  or service layers. `queries.ts` calls Supabase directly; RLS authorizes.
- Business rules that must never drift live in Postgres functions/triggers: invoice numbering,
  invoice totals, paid status, progress, audit-page payment recording.
- Server Components by default. `'use client'` only on interactive leaves.
- Every mutation = Server Action with zod validation, returns `{ ok } | { fieldErrors } | { formError }`.
- `import 'server-only'` in lib/supabase/admin.ts, lib/email.ts, lib/razorpay.ts, every actions.ts.
- Service-role key never reaches the browser. Money amounts never come from the request.
- Money = integer minor units everywhere. Format only via `lib/money.ts`.
- Dates stored UTC; due dates are `date`. Format only via `lib/dates.ts`.
- Offer names/prices/templates only in `config/offers.ts`. Site constants only in `config/site.ts`.

## Database rules (PRD §13–§14)
- Forward-only numbered migrations in `supabase/migrations`. Never edit an applied migration.
- Every new table: RLS enabled + policies + pgTAP tests in the same change.
- RLS helpers `is_admin()` / `my_client_ids()` check `status = 'active'`;
  `is_admin()` also requires `aal2`. Never bypass them.
- Client writes allowed only where PRD §14 says (change requests, client uploads), each with pgTAP.
- Finance rows are never hard-deleted (`on delete restrict`).
- Webhook writes must be idempotent (unique Razorpay IDs, `ignoreDuplicates`).

## Design rules (PRD §6–§8, Chai Studio, details in docs/design-brief.md)
- Use tokens only (`bg-paper`, `text-ink`, `bg-brand`…). No raw hex, no `bg-green-500`.
- Use components from `components/ui`, `components/site`, `components/portal`. New visual pattern → add to the
  design system first, then use it.
- Themes: site `night` (fixed); portal/admin `dark`/`light` toggle; PDFs and print `light`.
- Geist + Geist Mono only. Pill buttons. Saffron is fill-only, never text on paper.
- Motion: CSS only, transform/opacity only, respect `prefers-reduced-motion`.
- Accessibility: WCAG 2.2 AA; keyboard complete; visible focus ring; labels on every field.
- Copy: sentence case, verb-first buttons, no "please/successfully/simply", no AI clichés.

## Workflow
- Plan first for anything touching more than 2 files. Show the plan with PRD § references.
- Small commits, conventional messages (`feat(billing): …`). Build steps D0–D6 on branch `dev`.
- Write tests with the code, not after. For DB work write pgTAP first.
- After UI work run the `design-reviewer` subagent; after DB/auth/billing run `rls-auditor`.
- Prefer deleting code to adding it. The simplest thing that meets the PRD acceptance criteria wins.
- When blocked by an external dependency (Razorpay feature, HR, CA), stub behind a clear TODO
  referencing PRD Appendix A and continue.

## Lessons
(Add one line each time a mistake repeats.)
