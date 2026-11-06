# Appamania

Flutter freelance business site and portfolio (Night theme). Portal, billing, and Supabase are retired.
Notes from the contact form go to Firestore. Case studies, posts, apps, and packages are edited at `/admin`.
Prices and offers live only in `config/offers.ts` (INR, Udyam-registered). Hosting is Firebase App Hosting on Blaze, so commercial copy is allowed.

Design brief: @docs/design-brief.md.
If a task is ambiguous: STOP and ask. Do not invent a backend.

## Stack — do not add to this list without asking
Next.js App Router + React Server Components, TypeScript strict, Tailwind CSS v4 mapped to tokens,
zod, lucide-react, Vitest, Playwright + @axe-core/playwright. Hosting: Firebase App Hosting (Blaze, `apphosting.yaml`). `firebase-tools` runs via npx in CI only.
NOT allowed: ORMs, global state libraries, UI kits in default state, CSS-in-JS,
animation libraries (Framer Motion, GSAP), date libraries, lodash, axios, CMS, Supabase, payment or email SDKs.

## Commands
- `npm run dev`
- `npm run lint && npm run typecheck`
- `npm run check:tokens` — bans raw hex / default Tailwind palette outside styles/
- `npm test` — Vitest
- `npm run e2e` — Playwright
- `npm run build`
A task is not done until lint, typecheck, check:tokens, unit tests, and build pass.

## Architecture
- Server Components by default. `'use client'` only on interactive leaves.
- Site constants only in `config/site.ts`. Content is read from Firestore over REST (`lib/firestore.ts`, `lib/content.ts`) with `content/snapshot.json` as the fallback. Site notice and availability live in Firestore `settings/site`, edited in `/admin`. No Firebase SDK in the browser. `/admin` is the email-link editor for sumit@appamania.in; it uploads media to Firebase Storage `media/` (`lib/storage.ts`, `storage.rules`), and only that host renders through `next/image`.
- Prices only from `config/offers.ts`. Do not add a second database.

## Design rules (Chai Studio, details in docs/design-brief.md)
- Use tokens only (`bg-paper`, `text-ink`, `bg-brand`…). No raw hex, no `bg-green-500`.
- Use components from `components/ui` and `components/site`. New visual pattern → add to the design system first, then use it.
- Theme: site `night` (fixed).
- Geist + Geist Mono only. Pill buttons. Saffron is fill-only, never text on paper.
- Motion: CSS only, transform/opacity only, respect `prefers-reduced-motion`.
- Accessibility: WCAG 2.2 AA; keyboard complete; visible focus ring; labels on every field.
- Copy: sentence case, verb-first buttons, no "please/successfully/simply", no AI clichés.

## Workflow
- Plan first for anything touching more than 2 files.
- Small commits, conventional messages (`feat(site): …`).
- Write tests with the code, not after.
- After UI work run the `design-reviewer` subagent.
- Prefer deleting code to adding it.

## Lessons
(Add one line each time a mistake repeats.)
