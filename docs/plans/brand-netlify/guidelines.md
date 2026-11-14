# Guidelines: brand redo and Netlify move

Read first: `CLAUDE.md`, `docs/brand.md`, `docs/plans/brand-netlify/prd.md`, `docs/design-brief.md`,
and `AGENTS.md`. This Next.js version differs from training data, so check
`node_modules/next/dist/docs/` before using any Next API named below.

## Rules for every phase

- Do the steps in order. Do not skip one, and do not add anything that is not listed.
- If a step is ambiguous or a command fails twice, stop and ask. Do not guess.
- Tokens only. No raw hex outside `styles/`. No default Tailwind palette. Prices only via
  `formatPrice(offers.x)`. Site constants only in `config/site.ts`.
- Copy: sentence case, verb-first buttons, never "we", "our team", "please", "successfully",
  "simply", or the banned words in `docs/design-brief.md`.
- No new entries in `package.json` `dependencies` or `devDependencies`.
- Owner fields (empty strings or empty arrays) must render **nothing**: no label, no gap, no
  `[PLACEHOLDER]`.
- Write the unit tests in the same commit as the code.
- **Phase gate** (run at the end of every phase, and fix everything before committing):
  ```sh
  npm run lint && npm run typecheck
  npm run check:tokens
  npm test
  npm run build
  CI=true E2E_PORT=3111 npx playwright test
  ```
- After any UI change, run the `design-reviewer` subagent on the changed files and fix every blocker.
- One branch and one PR per phase, cut from the latest `main`: `feat/netlify` (A),
  `feat/brand-foundation` (B), `feat/brand-pages` (C), `feat/seo` (D), `feat/lead-tracking` (E). Phase F
  needs no branch unless it finds fixes. Conventional commits.
- **Netlify credits:** every merge to `main` is a production deploy (15 credits). Merge each phase
  as one squash merge. Do not push directly to `main`.

---

## Phase A: move hosting to Netlify

Goal: the same site, served by Netlify. No visible change except the privacy line.

### A1. Create `netlify.toml` (repo root)
```toml
# Netlify builds main with the OpenNext adapter (zero config). Deploy previews are free; production deploys cost credits.
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "24"
```
Do **not** add `[[plugins]]` (the adapter installs itself, and pinning it is not recommended). Do not add
`[[headers]]` or `[[redirects]]`: `next.config.ts` keeps them.

### A2. Cut runtime work (fewer function invocations = fewer credits)
Content is static in the repo. Only the pub.dev numbers are live (`lib/live.ts`, fetch revalidate 3600).
- **Delete** the line `export const revalidate = 60;` from:
  `app/(site)/work/page.tsx`, `app/(site)/work/[slug]/page.tsx`, `app/(site)/apps/page.tsx`,
  `app/(site)/apps/[slug]/page.tsx`, `app/(site)/blog/page.tsx`, `app/(site)/blog/[slug]/page.tsx`,
  `app/sitemap.ts`.
- **Change** `export const revalidate = 60;` to `export const revalidate = 3600;` in:
  `app/(site)/page.tsx`, `app/(site)/open-source/page.tsx`, `app/(site)/open-source/[slug]/page.tsx`,
  `app/llms.txt/route.ts`.
- **Add** `export const dynamicParams = false;` under the imports of each `[slug]` page:
  `work/[slug]`, `apps/[slug]`, `open-source/[slug]`, `blog/[slug]`. Unknown slugs then 404 without running
  a function.
- Check: `git grep -n "revalidate = 60"` prints nothing.

### A3. Let e2e run against a deployed URL
Edit `playwright.config.ts`:
```ts
// E2E_BASE_URL runs the suite against a deployed site (no local server). E2E_PORT runs next to a dev server.
const remote = process.env.E2E_BASE_URL;
const port = Number(process.env.E2E_PORT ?? 3000);
const base = remote ?? `http://localhost:${port}`;
```
Set `webServer` to `remote ? undefined : { …current object… }`. In `tests/e2e/site.spec.ts`, add this as the first
line inside the `"www redirects to the apex…"` test:
`test.skip(!!process.env.E2E_BASE_URL, "Needs a local server: Netlify routes by real host.");`

### A4. Delete App Hosting
- Delete `apphosting.yaml`.
- `.env.example`: replace line 2 with
  `# Production values are Netlify env vars (Production context only). firestore.rules deploys from CI on main.`
  Replace line 1 with `# Firebase web app (Firestore REST for contact notes only). No sign-in.`
- `.github/workflows/ci.yml` line 25: replace the comment with
  `# Firestore rules deploy from the repo, so the console never drifts. Netlify builds and publishes main on its own.`
  Change nothing else in CI.
- `firebase.json` and `firestore.rules`: no change.

### A5. Docs
- `CLAUDE.md`:
  - Line 4 becomes: `Notes from the contact form go to Firestore (create only). Case studies, apps, packages, and posts live in content/snapshot.json; media in public/media/.`
  - Line 5: replace `Hosting is Firebase App Hosting on Blaze, so commercial copy is allowed.` with
    `Hosting is Netlify (netlify.toml, OpenNext adapter); commercial copy is allowed.`
  - Line 12: replace `Hosting: Firebase App Hosting (Blaze, \`apphosting.yaml\`).` with
    `Hosting: Netlify (\`netlify.toml\`), free plan with a 300-credit hard limit: batch merges to main.`
  - The Architecture bullet that starts `Site constants only in` becomes:
    `Site constants only in config/site.ts. Content is static: content/snapshot.json validated by lib/schemas.ts via lib/content.ts; pub.dev numbers come from lib/live.ts (ISR, 1 hour). Firestore is used only for the anonymous notes create over REST (lib/firestore.ts, firestore.rules). No Firebase SDK in the browser. Media in public/media/, rendered through next/image.`
- `docs/design-brief.md` line 10: `Hosted on Firebase App Hosting.` becomes `Hosted on Netlify.`
- `app/(site)/legal/privacy/page.tsx`: under "Where it goes", add one paragraph:
  `The site is hosted on Netlify, which keeps standard server logs (IP address, browser, time) for security and abuse prevention.`
  Set `updated` to the merge date (`D Mon YYYY`).

### A6. Phase gate, then open the PR. Netlify deploys a preview for it. On the preview URL:
`CI=true E2E_BASE_URL=https://deploy-preview-<n>--<site>.netlify.app npx playwright test`.
(Previews have no env vars, so the form uses the mailto fallback. Tests that need Firestore do not
exist.) Then `curl -sI <preview-url> | grep -iE "content-security-policy|strict-transport|x-content-type"`
must print all three headers. `curl -sI <preview-url>/studio` must print `301` and `location: /apps`.

### A7. Cutover (owner and implementer together, after the PR is merged)
1. **Day −1:** at GoDaddy, set the TTL of the apex A/AAAA records to 600 s.
2. Netlify builds `main` → `https://<site>.netlify.app`. Run the A6 checks against it. Submit one real
   note from the form (Production env vars are set) and confirm it in the Firestore console. If the
   key is referrer-restricted, the owner adds `https://<site>.netlify.app/*` first (PRD owner task 4).
3. Netlify › Domain management: add `appamania.in` and **set it as primary**. Add `www.appamania.in`
   as an alias. Netlify then redirects www → apex itself.
4. GoDaddy DNS, in this order:
   - Write down every record (screenshot).
   - Delete **all** `A` and `AAAA` records on `@` (Firebase App Hosting IPs and any GoDaddy
     "Parked" record).
   - Add `A  @  75.2.60.5  TTL 600`.
   - Add `CNAME  www  <site>.netlify.app  TTL 600` (www has no record today).
   - Do **not** touch `MX`, `TXT` (SPF, DKIM, DMARC, `google-site-verification`), or `CNAME`
     records used by Google Workspace.
5. Verify (repeat until every check passes; DNS can take up to an hour):
   ```sh
   dig +short appamania.in A          # exactly 75.2.60.5
   dig +short appamania.in AAAA       # empty
   dig +short www.appamania.in CNAME  # <site>.netlify.app.
   curl -sI https://appamania.in | grep -iE "^server|strict-transport"   # server: Netlify, HSTS present
   curl -sI https://www.appamania.in/work | grep -iE "^HTTP|^location"   # 301, location https://appamania.in/work
   curl -vI https://appamania.in 2>&1 | grep -i "issuer"                  # Let's Encrypt (Netlify)
   CI=true E2E_BASE_URL=https://appamania.in npx playwright test
   ```
   In Netlify › Domain management › HTTPS, the certificate must show both domains. If it is still
   pending after DNS resolves, click "Verify DNS configuration", then "Provision certificate".
6. Set the TTL back to 3600 after 24 hours of clean checks.
7. **Rollback** (any time in the first 7 days): restore the apex A/AAAA records from the screenshot.
   App Hosting is still running.
8. **Day +7:** Firebase console › App Hosting › backend › Settings › Domains: remove `appamania.in`.
   Then delete the backend (console, or
   `npx firebase-tools apphosting:backends:delete <backend-id> --project appamania-web`). Do not
   delete the Firebase project or Firestore. Blaze vs Spark is the owner's decision (PRD open question 8).
9. Remove the Firebase `_acme-challenge` TXT records at GoDaddy, if present.

### A8. Add the build-skip rule (only after the first production deploy succeeded)
Append to `[build]` in `netlify.toml`:
```toml
  # Skip deploys (15 credits each) when only docs or markdown changed. Exit 0 = skip.
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- . ':(exclude)docs' ':(exclude)*.md'"
```
Test: a docs-only PR merged to `main` shows "Canceled: ignored" in Netlify deploys.

**www redirect:** keep the host redirect in `next.config.ts` and its e2e test. Netlify answers www
at the edge first, so the config rule is a fallback if the domain settings ever change.

**Acceptance A:** the phase gate passes. `apphosting.yaml` is gone. `git grep -niE "app ?hosting|apphosting"`
lists only `docs/plans/`. The production site serves `server: Netlify` with CSP and HSTS, the www → apex
redirect works, a real note lands in Firestore, and TLS is valid for both hosts.
Commit: `feat(hosting)!: move from Firebase App Hosting to Netlify`.

---

## Phase B: brand foundation (config, design system, IA, About)

### B1. Fix the Services redirect (live bug)
`next.config.ts`: delete these two lines:
`{ source: "/services", destination: "/", statusCode: 301 },`
`{ source: "/services/:path*", destination: "/", statusCode: 301 },`
`tests/e2e/site.spec.ts`: remove `["/services", "/"],` from the "old URLs 301" list. Add a test:
`/services` returns 200 and its h1 contains "Fixed price".

### B2. Config (copy lives here)
`config/site.ts`: add these keys (keep all existing ones):
```ts
  /** Brand descriptor after the name (titles, hero chip, footer). */
  descriptor: "Flutter rescue studio",
  tagline: "Stuck Flutter apps, upgraded and shipped. Written audit first, fixed price after.",
  /** Home meta description. */
  description: "Flutter rescue studio in Kolkata. A written audit in 48 hours, then a fixed-price sprint to upgrade the SDK, fix crashes, and ship to both stores.",
  founderRole: "Founder",
  /** /media/… path of a real founder photo. Empty shows the mark. */
  founderPhoto: "" as string,
  /** Legal name as on the Udyam certificate. Empty hides the line. */
  legalName: "" as string,
  /** Udyam registration number. Empty shows "Udyam-registered" without a number. */
  udyam: "" as string,
```
In `links`, add `linkedinCompany: "" as string,`. Keep `play: ""`, but change its type to `"" as string`.

`config/home.ts` (rewrite `homeCopy`; keep the `formatPrice` imports):
- `hero.before: "Stuck Flutter app?"`, `hero.after: "Fixed price,"`, `hero.accent: "shipped."`
- `hero.lead: "Appamania takes over live Flutter apps that crash, lag, or sit on an old SDK. A written audit in 48 hours, then a fixed-price sprint to upgrade, fix, and release. You own the code."`
- `hero.primary` unchanged. `hero.secondary: "Read the case studies"`.
- Delete `stats` and `stack`. Add the pure function below (unit-test it in `config/home.test.ts`):
  ```ts
  export type ProofFact = { value: string; label: string; href: string };
  /** Real facts only. Points come live from pub.dev; app count from the snapshot. */
  export function proofFacts({ points, appCount }: { points: number[]; appCount: number }): ProofFact[]
  ```
  It returns, in order: `{ "6+ yrs", "production Flutter", "/about" }`,
  `{ "0", "regressions, Flutter 3.41 → 3.47", "/work/flutter-3-47-upgrade" }`,
  `{ "<min>–<max>", "pub points, <n> packages", "/open-source" }` (just `"<max>"` when min equals max; dropped when
  `points` is empty), and `{ "<appCount>", "apps on Google Play", "/apps" }` (dropped when 0).
- Add `steps`: move the `steps` array from `app/(site)/services/page.tsx` here unchanged.
- `faq`: keep the four questions, change the "Who owns the code?" answer to "You do, from the first commit. Work happens in your repo.",
  and add `{ q: "Is Appamania a team?", a: "No. Appamania is founded and run by Sumit Pal. He does every audit and sprint himself." }`.
- `floats` unchanged.

`config/catalog.ts`: delete `stack`. Keep `inDevelopment` and `pubUrl`.

New `config/about.ts`:
```ts
export const aboutCopy = {
  hero: { eyebrow: "About", title: "Appamania is run by", accent: "Sumit Pal.", lead: "A Flutter engineer in Kolkata with 6+ years of production apps across fintech, e-commerce, telecom, and enterprise. He does every audit and sprint himself, start to finish." },
  principles: [
    { title: "Read first", body: "No quote before the code is read. The audit report is yours either way." },
    { title: "Fixed price", body: "A price before work starts. Scope changes get a written quote." },
    { title: "Your repo", body: "Work happens in your repo and CI. You own the code from the first commit." },
    { title: "Releases keep going", body: "Upgrades land on a branch behind a green build. Users never wait for a freeze." },
  ],
} as const;
```

New `config/proof.ts`:
```ts
export type Testimonial = { quote: string; name: string; role: string; company?: string };
/** Real quotes with written permission only. Empty renders nothing. */
export const testimonials: readonly Testimonial[] = [];
```

`config/offers.ts`: append
```ts
/** Budget bands for the contact form. Labels use the same INR formatting as prices. */
export const budgets = [
  { id: "lt25k", label: `Under ${formatPrice({ priceMinor: 25_000_00 })}` },
  { id: "25k-75k", label: `${formatPrice({ priceMinor: 25_000_00 })}–${formatPrice({ priceMinor: 75_000_00 })}` },
  { id: "75k-2l", label: `${formatPrice({ priceMinor: 75_000_00 })}–${formatPrice({ priceMinor: 2_00_000_00 })}` },
  { id: "gt2l", label: `Over ${formatPrice({ priceMinor: 2_00_000_00 })}` },
  { id: "unsure", label: "Not sure yet" },
] as const;
```
(`formatPrice` is declared above it as a function declaration, so it is hoisted. Add a test that the labels read
`Under ₹25,000` and `Over ₹2,00,000`.)

`lib/schemas.ts`: add optional fields
- `WorkSchema`: `outcome: z.string().min(1).optional()`, `date: isoDate.optional()`, `updated: isoDate.optional()`
- `AppSchema`: `outcome: z.string().min(1).optional()`, `updated: isoDate.optional()`
- `PackageSchema`: `updated: isoDate.optional()`
with `const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);` at the top. Add tests in `lib/schemas.test.ts`
(the date is accepted, `14 Nov` is rejected). Do not add values to the snapshot (owner facts).

### B3. Design-system components (add these before any page uses them)
All are server components in `components/site/`. Reuse `Eyebrow`, `Chip`, `JsonLd`, `Mark`, `cx`.
1. `ProofStrip.tsx`: `export function ProofStrip({ items }: { items: readonly ProofFact[] })`.
   Returns null when `items` is empty. Markup: `<dl className="reveal grid grid-cols-2 border-y border-line min-[900px]:grid-cols-4">`.
   Each fact is a `<div>` with `<dd className="text-display tabular-nums">` holding a `Link` to `href`, and
   `<dt className="font-mono text-small text-ink-muted">`. Use `flex flex-col-reverse` so the number comes first visually and the dt is first in the DOM.
   Cells: `py-6 px-4`, a `border-line` divider between cells.
2. `Breadcrumbs.tsx`: `export function Breadcrumbs({ items }: { items: readonly { name: string; href: string }[] })`.
   Renders `<nav aria-label="Breadcrumb" className="pt-10 font-mono text-small text-ink-muted"><ol className="flex flex-wrap gap-2">`.
   Every item except the last is a `Link`; the last is `<span aria-current="page" className="text-ink">`.
   Separator: `<li aria-hidden>/</li>`. It also renders `<JsonLd>` with a `BreadcrumbList` (positions from 1,
   `item: site.url + href`). Pages pass the full trail starting with `{ name: "Home", href: "/" }`.
3. `FounderCard.tsx`: `export function FounderCard({ compact }: { compact?: boolean })`. It reads `site`.
   Shows `next/image` (`site.founderPhoto`, 160×160, `rounded-lg`, alt `"Sumit Pal, founder of Appamania"`) when set,
   otherwise `<Mark className="size-20" />`. Name (`text-h2`), `site.founderRole` + " · " + `site.location`
   (mono, muted). Without `compact` it also shows link chips: LinkedIn, GitHub, pub.dev, and Play (only when
   set). With `compact` it adds a link "About Appamania" to `/about`. Panel style:
   `rounded-lg border border-line bg-paper-raised p-7`.
4. `Quote.tsx`: `export function Quote({ items }: { items: readonly Testimonial[] })`. Returns null when empty.
   Each item is a `<figure>` with `<blockquote>` and `<figcaption>` (name, role, company). There is no
   reviewer data elsewhere.
5. Edit `components/site/Plans.tsx`: add the prop `ids?: OfferId[]`. Use `const list = ids ?? cards;` in place
   of `cards` in the map. Hide the "Also:" line when `ids` is passed.
6. Delete `Marquee` from `components/site/Proof.tsx`. Delete `@keyframes marquee` from `app/globals.css`.
7. Run the `design-reviewer` subagent on these files.

### B4. IA: nav, footer, NavCta
- `components/site/NavLinks.tsx` `navItems`: Services `/services`, Work `/work`, Apps `/apps`,
  Open source `/open-source`, About `/about`. Remove Blog.
- `components/site/NavCta.tsx`: delete `heroHasPrimary`, and use
  `const path = usePathname(); const primary = !(path === "/" || path === "/contact" || path.startsWith("/services"));`
- `components/site/Footer.tsx`: three columns, as in PRD §5. Landing hrefs: `/services/flutter-upgrade`
  ("Flutter upgrade"), `/services/flutter-app-rescue` ("Flutter app rescue"),
  `/services/flutter-app-audit` ("Flutter app audit"). Add `site.links.booking` ("Book a call") and
  `site.links.linkedinCompany` ("LinkedIn company") only when non-empty (filter by `href`). The
  brand line becomes `{site.descriptor}. {site.tagline} Built in Kolkata, fuelled by chai.`
  The bottom identity line uses `site.legalName || site.identity`.
- The landing pages do not exist until Phase C. To keep this phase shippable, add the three landing links to the
  footer in **Phase C0**, not here.

### B5. About page
New `app/(site)/about/page.tsx` (server). Metadata:
`{ title: { absolute: "About Appamania and founder Sumit Pal" }, description: <PRD §9 about description>, alternates: { canonical: "/about" } }`
(Phase D swaps this for `pageMeta`). Composition:
`PageHero` (aboutCopy.hero) with a primary `Link` "Book the {formatPrice(offers.audit)} audit" → `/contact?offer=audit`
and an outline `<a>` "Book a 20-minute call" (only when `site.links.booking` is set) → `FounderCard` →
`Section` "01 — How Appamania works" with `Steps items={aboutCopy.principles}` →
`Section` "02 — The record" with `ProofStrip` (data from `getPackages()` and `getApps()`, the same as home) →
`Section` "03 — Business details": a `<dl>` with legal name (when set), registration (`site.udyam ? \`Udyam ${site.udyam}\` : "Udyam-registered"`),
location, `site.billing` → `Quote items={testimonials}` → `CtaBand` (eyebrow "Start", title "Send the repo.", body "One form, one working day, one honest answer.", button `inverse` "Book the audit").
`export const revalidate = 3600;` (live points).

### B6. Docs
- `CLAUDE.md` Design rules › Copy: append `Voice: the brand is the subject; never "we" or "our team"; "I" only where Sumit signs (docs/brand.md §6).`
- `docs/design-brief.md`:
  - "What the site is": `A Flutter rescue studio (docs/brand.md): fixed-price offers (…)`, with the rest unchanged.
  - Home rhythm: replace `tech marquee` with `proof strip (real facts, linked)`. After `case panel` add `→ built-and-run tiles → founder card`.
  - Motion: delete the "Tech marquee" bullet.
  - Copy › Proof: replace `Missing facts stay as visible \`[PLACEHOLDER]\` markers.` with
    `Missing owner facts render nothing until filled (empty string or empty array in config or snapshot).`
  - Add a component list line: `ProofStrip, Breadcrumbs, FounderCard, Quote (components/site).`

### B7. Tests
- `tests/e2e/site.spec.ts`: add `/about` to `pages`. New test: the nav has no "Blog" link and has
  "About". New test: `/about` shows "Sumit Pal" and a "Book the" link.
- Unit: `config/home.test.ts` (`proofFacts` with equal and different points, with 0 apps and with no
  points), plus the `offers.test.ts` and `schemas.test.ts` additions above.

**Acceptance B:** the phase gate passes. `/services` renders (200). `/about` renders. The nav shows five
links without Blog. `git grep -n "Marquee\|stack" components config` prints nothing for the marquee or
stack. The design-reviewer has no blockers.
Commit: `feat(site): brand foundation, About page, and the services route`.

---

## Phase C: page redo

Each page keeps exactly one `h1` and one primary button in view (the nav rule from B4 covers the nav).

### C0. Landing pages (first, so that later steps can link to them)
New `config/landing.ts`:
```ts
import type { OfferId } from "@/config/offers";
export type LandingSlug = "flutter-upgrade" | "flutter-app-rescue" | "flutter-app-audit";
export type Landing = {
  slug: LandingSlug; title: string; description: string; eyebrow: string; h1: string; accent: string; lead: string;
  offer: OfferId; signs: readonly string[]; caseStudy: string; faq: readonly { q: string; a: string }[];
};
export const landings = { … } as const satisfies Record<LandingSlug, Landing>;
export const landingSlugs = Object.keys(landings) as LandingSlug[];
```
Content: titles and descriptions from PRD §9, h1 and caseStudy from the PRD §6 table (the h1 is split into `h1` + `accent`,
for example "Upgrade your Flutter app" + "without pausing releases."), `offer: "audit"` for all three, and 3–5 `signs` each drawn
from `config/offers.ts` `fit`/`includes` and the case studies (no new claims). Each faq has three questions, answered only with facts
already on the site (price via `formatPrice`, 48 h, ownership, Udyam billing). Build `faq` answers that need a price inside a function or
template literal using `formatPrice`, never a literal "₹".
Add a unit test in `config/landing.test.ts`: every `caseStudy` exists in the snapshot `work` slugs, and every `title + " · Appamania"` is ≤ 60 characters.

New `app/(site)/services/[slug]/page.tsx`:
`export const dynamicParams = false;` `generateStaticParams` → `landingSlugs.map(slug => ({ slug }))`.
`generateMetadata` → `{ title, description, alternates: { canonical: \`/services/${slug}\` } }` (Phase D swaps this for `pageMeta`).
Body: `Breadcrumbs` (Home › Services › title) → `PageHero` (eyebrow, h1, accent, lead, primary `Link` "Book the {formatPrice(offers.audit)} audit" → `/contact?offer=audit`)
→ Section "01 — Signs you need this" (`ul` with lucide `Check` like `Plans`) → Section "02 — What happens" `Steps items={homeCopy.steps}`
→ Section "03 — Proof" `WorkCards items={work.filter(w => w.slug === l.caseStudy)}` → Section "04 — Price" `<Plans ids={["audit", "sprint"]} />`
→ `Faq` "05 — FAQ" → `CtaBand`.
Footer: now add the three landing links (B4 note). NavCta is already outline on `/services/*`.
e2e: add the three landing URLs to `pages`. `/services/nope` returns 404.

### C1. Home: `components/site/HomePage.tsx`, `app/(site)/page.tsx`
- `page.tsx`: also fetch nothing new. Pass `proof={proofFacts({ points: packages.map(p => p.points), appCount: apps.length })}`
  and `apps={apps}` (replace `appCount`). Remove the Person JSON-LD (Phase D adds the Organization in the layout).
- Hero: add `<Chip dot className="self-start">{site.descriptor} · Kolkata</Chip>` above the h1. Remove the stats `<dl>`.
  The secondary button text comes from `copy.hero.secondary`.
- Replace the marquee block with `<div className="mx-[calc(50%-50vw)]"><div className="wrap"><ProofStrip items={proof} /></div></div>`.
- Section 01: `eyebrow="01 — What Appamania fixes"`, `title="Four problems, one fix list."`,
  `aside` "Every job starts with a written audit and ends with a release you can see." Bento tiles (keep
  `Tile` spans `3 tall brand`, `3`, `3`, `2`, `2`, `2`). Make each non-brand tile one whole `Link`
  (put the `Link` inside the `Tile` and stretch it with `after:absolute after:inset-0`):
  - brand tall: Eyebrow "The work", h3 "Upgrades, crash fixes, and releases.", Big "6+ yrs".
  - "Stuck on an old SDK" → `/services/flutter-upgrade`, with `VersionJump from="Flutter 3.41" to="3.47"`.
  - "Crashes in production" → `/services/flutter-app-rescue`, the existing crash `pre` block.
  - "No CI, manual releases" → `/services/flutter-app-rescue`.
  - "Not sure what is wrong" → `/services/flutter-app-audit`, `formatPrice(offers.audit)` in mono.
  - "Domains" tile, unchanged text.
- Section 02 Plans: unchanged. Add section "03 — How it works" with `<Steps items={copy.steps} />`.
- Section 04 Work: as now (WorkCards + Panel; renumber the eyebrows).
- Section 05 "Built and run by Appamania": `Bento` with two `Tile span={3}`: apps (count, names joined by " · ",
  link "See the apps" → `/apps`) and packages (points range, link "See the packages" → `/open-source`).
- Section 06: `<FounderCard compact />`.
- Section 07 FAQ (`copy.faq`). CtaBand unchanged.

### C2. Services: `app/(site)/services/page.tsx`
- Import `steps` from `config/home.ts` (delete the local copy).
- PageHero: eyebrow "Services", title "Read first.", accent "Fixed price.", lead
  "Every engagement starts with code Appamania has read and ends with a release you can see." The primary stays.
  Below it, the trust chips: `["Udyam-registered", "Invoiced in INR", "You own the code", offers.audit.guarantee]` as `Chip`.
- After Plans: Section "02 — Common problems": a three-card `ul` (reuse the WorkCards card classes) linking to the
  three landing pages, with `landings[slug].h1` and `landings[slug].lead` (from C0).
- Renumber: How it works 03, FAQ 04. Change "Three ways to work with me" anywhere to brand voice.
- The `faq` answer "I read the code before I name a price" becomes "Appamania reads the code before it names a price".

### C3. Work: `app/(site)/work/page.tsx`, `app/(site)/work/[slug]/page.tsx`, `components/site/WorkCards.tsx`
- Index: keep the hero, and add a `CtaBand` (title "Send the repo.", button "Book the audit" → `/contact?offer=audit`).
- Detail: `<Breadcrumbs items={[Home, {Work,/work}, {w.teaser.title,/work/slug}]} />` above PageHero.
  Eyebrow "02 — What I did" becomes "02 — The work". After the Result panel, render
  `{w.outcome && <p className="text-h2">{w.outcome}</p>}` inside the panel's left column.
  Add a "Related service" link: find the landing whose `caseStudy === w.slug` and render an outline
  button `landing.h1` → `/services/<slug>`. The CtaBand becomes eyebrow "Start", title "Stuck on the same problem?",
  body "Send the repo. Get a written report in 48 hours.", button "Book the audit" → `/contact?offer=audit`.
- WorkCards: when `w.outcome` is set, show it under the summary in `font-mono text-small text-ink`.

### C4. Apps: `app/(site)/apps/page.tsx`, `app/(site)/apps/[slug]/page.tsx`, `components/site/AppCard.tsx`
- Index PageHero: eyebrow "Products", title "Apps Appamania builds and", accent "runs itself.", lead
  "Flutter apps designed, built, and published by Appamania on Google Play. The same release process clients pay for."
- After `InDevelopment`: one line, `<p className="text-ink-muted">Need the same for your app? <Link href="/services">See the services</Link>.</p>`.
- Detail: Breadcrumbs (Home › Apps › name). After the body: `{app.outcome && …}` the same as work. Add an outline button
  "See the services" → `/services`. The Play link stays.
- AppCard: no change, apart from showing `outcome` when set.

### C5. Open source: `app/(site)/open-source/page.tsx`, `[slug]/page.tsx`
- Index CtaBand: title "Need this care on your app?", body "The packages get the same CI and release process client apps get.", button "See the services" → `/services`.
- Detail: Breadcrumbs (Home › Open source › name).

### C6. Contact: `app/(site)/contact/page.tsx`
- PageHero: eyebrow "Contact", title "Start with", accent "the audit.", lead
  "Say what the app does and what is wrong. Sumit Pal replies within one working day, IST, with next steps or a fixed quote."
- Below the booking link: an `<ol>` "What happens next", three lines in mono small: "1 · Sumit reads the note and the app or repo."
  "2 · You get a reply in one working day: a question, a quote, or the audit invoice." "3 · The audit report lands within 48 hours of payment."
- `NoteForm` helper line under the submit button (project and key set): "Sumit reads every note. Used only to reply."

### C7. Blog demotion: `app/(site)/blog/page.tsx`
`generateMetadata` returns `robots: { index: false, follow: true }` when `getPosts()` is empty.
Remove Blog from the footer (done in B4) and from the sitemap and llms.txt (Phase D).

### C8. Tests
Update e2e: "home shows the audit price…" still passes. Add: the home h1 contains "Stuck Flutter app", the home ProofStrip
has 4 links, `/work/flutter-3-47-upgrade` has `nav[aria-label="Breadcrumb"]`, and `/contact` has "What happens next".

**Acceptance C:** the phase gate passes. `git grep -nE "\b(we|our)\b" app components config` shows no seller "we"
(review each hit by hand). No "I " in marketing copy outside About, contact, and quotes (`git grep -n "\"I \|I'm" config components app`,
reviewed by hand). The design-reviewer has no blockers. Screens checked at 390 px and 1280 px.
Commit: `feat(site): brand redo of home, services, work, apps, open source, and contact`.

---

## Phase D: SEO, landing pages, structured data

### D1. `lib/seo.ts` (new)
```ts
import type { Metadata } from "next";
import { site } from "@/config/site";
export const orgId = `${site.url}/#org`;
export function pageMeta(p: { title: string; description: string; path: string; absolute?: boolean; noindex?: boolean }): Metadata
export function orgJsonLd(): object
export function faqJsonLd(items: readonly { q: string; a: string }[]): object
```
- `pageMeta`: `title: p.absolute ? { absolute: p.title } : p.title`, `description`, `alternates: { canonical: p.path }`,
  `openGraph: { title: <full title with " · Appamania" unless absolute>, description, url: p.path, siteName: site.name, locale: "en_IN", type: "website" }`,
  `twitter: { card: "summary_large_image" }`, and `robots: { index: false, follow: true }` only when `noindex`.
- `orgJsonLd`: Organization per the PRD §9 table. `sameAs` = `[site.links.github, site.links.pubPublisher, site.links.linkedinCompany, site.links.play].filter(Boolean)`.
  `founder: { "@type": "Person", name: site.owner, jobTitle: site.founderRole, sameAs: [site.links.linkedin, site.links.x] }`.
  `legalName` only when set. `logo: \`${site.url}/icon.svg\``.
- `faqJsonLd`: `{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(i => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })) }`.
- Unit test `lib/seo.test.ts`: the canonical path, the absolute title, empty `sameAs` entries filtered, the FAQ shape.

### D2. Metadata on every page
Replace each page's `metadata` / `generateMetadata` return with `pageMeta({...})`, using the titles and descriptions from PRD §9.
Home: `pageMeta({ title: "Appamania · Flutter app rescue, upgrades and releases", description: site.description, path: "/", absolute: true })`.
Services: build the description with `formatPrice`. Root `app/layout.tsx`: `description: site.description` and add
`openGraph: { siteName: site.name, locale: "en_IN", type: "website" }` plus `twitter: { card: "summary_large_image" }`.
Check the counts with:
```sh
node -e 'for (const s of process.argv.slice(1)) console.log(s.length, s)' "<title> · Appamania" "<description>"
```
Titles ≤ 60. Descriptions 120–160 (detail pages built from the snapshot: if one is over 160, report it, do not trim content).

### D3. Structured data
- `app/(site)/layout.tsx`: render `<JsonLd data={orgJsonLd()} />` before `<Navbar />`.
- Home and services: `<JsonLd data={faqJsonLd(copy.faq)} />` / `faqJsonLd(faq)`.
- Services ProfessionalService: add `"@id": \`${site.url}/services#service\``, `provider: { "@id": orgId }`.
- Case study Article: add `publisher: { "@id": orgId }`, `mainEntityOfPage: url`, `image: \`${site.url}/work/${w.slug}/opengraph-image\``
  (check the generated URL in the built HTML: `og:image` content; use exactly that path), and `datePublished: w.date` / `dateModified: w.updated ?? w.date` only when set.
- App detail: SoftwareApplication per PRD §9 (`const category = { Finance: "FinanceApplication", Health: "HealthApplication", Weather: "UtilitiesApplication", Casual: "GameApplication" }[app.category]`, which falls back to `"MobileApplication"`).
- Validate one page of each type at https://validator.schema.org (paste the HTML from `curl`).

### D4. Landing pages: SEO wiring
In `app/(site)/services/[slug]/page.tsx` (from C0): `generateMetadata` → `pageMeta({ title: l.title, description: l.description, path: \`/services/${slug}\` })`,
and render `<JsonLd data={faqJsonLd(l.faq)} />` next to the `Faq`.

### D5. OG images
New `lib/og.tsx`:
```tsx
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export function ogImage({ eyebrow, title }: { eyebrow: string; title: string }): ImageResponse
```
Move the JSX from `app/opengraph-image.tsx` into it (same colours from `styles/theme-color.ts` and `styles/email.ts`, with the brand square and "appamania"),
with `eyebrow` above the title in `nightBrand`, `title` at 80 px, and the footer line `${site.descriptor} · ${site.location}`.
Then:
- `app/opengraph-image.tsx` → `ogImage({ eyebrow: site.descriptor, title: "Stuck Flutter app? Fixed price, shipped." })`, with alt from `site.tagline`. **This removes the hard-coded "₹2,999".**
- `app/(site)/services/opengraph-image.tsx` → eyebrow "Services", title `Audit ${formatPrice(offers.audit)} · Sprint ${formatPrice(offers.sprint)} · Retainer ${formatPrice(offers.retainer)}`.
- `app/(site)/services/[slug]/opengraph-image.tsx`, `app/(site)/work/[slug]/opengraph-image.tsx`, `app/(site)/apps/[slug]/opengraph-image.tsx`:
  `params: Promise<{ slug: string }>` (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`, `params`),
  with the title from the landing, `w.teaser.title`, or `app.name` and eyebrow "Flutter app audit…" / `w.teaser.label` / `app.category`. Add `generateStaticParams` only if the doc says it is needed.
- `app/(site)/about/opengraph-image.tsx` → eyebrow "About", title "Appamania is run by Sumit Pal."
- Check: `curl -s localhost:3111/work/flutter-3-47-upgrade | grep -o '<meta property="og:image"[^>]*>'` points at the work image, and `/services` at the services image. Open each image URL and look at it.

### D6. Sitemap, robots, llms.txt
- `app/sitemap.ts`: pages = `"", "/services", ...landingSlugs.map(s => \`/services/${s}\`), "/work", "/apps", "/open-source", "/about", "/contact", "/legal/privacy"`,
  plus `/blog` and posts **only when** `posts.length > 0`, plus work, apps, and packages. Set `lastModified` only for rows with `updated` (or `date` for work).
- `app/robots.ts`: unchanged.
- `app/llms.txt/route.ts`: the first line is `# ${site.name}: ${site.descriptor}`, the quote line is `> ${site.tagline}`. Add
  `## About` (`Founded and run by ${site.owner}, ${site.location}. Udyam-registered.` and link `/about`), `## Problems Appamania fixes` (each landing title + URL),
  keep Services (via `formatPrice`), and add the Blog lines only when posts exist.

### D7. Tests (e2e)
- `sitemap.xml` contains `/about` and `/services/flutter-upgrade` and does not contain `/blog`.
- `llms.txt` contains `Flutter rescue studio` and `₹2,999`.
- Home HTML contains `"@type":"Organization"` and `"@type":"FAQPage"`. The case study contains `"@type":"BreadcrumbList"`.

**Acceptance D:** the phase gate passes. Every route has a unique `<title>`, a canonical, `og:title`, and `og:image`. The schema validator reports 0 errors on
home, services, one landing page, one case study, and one app. `git grep -n "2,999" app components lib` prints nothing (prices only via `formatPrice`).
Commit: `feat(seo): landing pages, structured data, per-route OG images, and page metadata`.

---

## Phase E: analytics events and form fields

### E1. `lib/analytics.ts` (new, client-safe, no imports)
```ts
export type AnalyticsEvent = "cta_click" | "booking_click" | "email_click" | "form_start" | "form_error" | "form_submit" | "generate_lead" | "form_fail";
declare global { interface Window { gtag?: (...args: unknown[]) => void } }
/** GA4 event via gtag. No-op when GA is not loaded (previews, local, blocked). */
export function track(name: AnalyticsEvent, params: Record<string, string | number> = {}) {
  if (typeof window !== "undefined") window.gtag?.("event", name, params);
}
```

### E2. `components/site/CtaTracker.tsx` (new, `"use client"`, renders null)
One `useEffect` adds a `click` listener on `document` (capture: false) and removes it on cleanup. On click:
`const a = (e.target as Element).closest("a")`. If `a?.dataset.cta === "booking"`, track `booking_click` `{ cta_location: location.pathname }`.
Else if `a?.dataset.cta`, track `cta_click` `{ cta_id: a.dataset.cta, cta_location: location.pathname, offer: a.dataset.offer ?? "" }`.
Else if `a?.href.startsWith("mailto:")`, track `email_click` `{ cta_location: location.pathname }`.
Mount `<CtaTracker />` in `app/(site)/layout.tsx` next to `<Analytics />`.

### E3. `data-cta` attributes (values are fixed, use exactly these)
| Element | `data-cta` | `data-offer` |
|---|---|---|
| Home hero primary / secondary | `hero_primary` / `hero_secondary` | `audit` / none |
| NavCta | `nav` | `audit` |
| Plans card buttons | `plan_${id}` | `id` |
| Plans "Also:" links | `plan_${id}` | `id` |
| Every CtaBand button | `cta_band` | `audit` when it links to the audit |
| Services, About, landing hero primary | `services_primary` / `about_primary` / `landing_primary` | `audit` |
| Every `site.links.booking` link | `booking` | none |
| Related-service links on case studies | `related_service` | none |

### E4. Form fields
`lib/note.ts`:
```ts
export const platforms = [ {id:"android",label:"Android"}, {id:"ios",label:"iOS"}, {id:"both",label:"Android and iOS"}, {id:"web",label:"Web"}, {id:"unsure",label:"Not sure"} ] as const;
export const timelines = [ {id:"now",label:"This month"}, {id:"soon",label:"In 1–3 months"}, {id:"later",label:"Later"}, {id:"exploring",label:"Just exploring"} ] as const;
```
- `NoteFields` gains `platform`, `timeline`, and `budget` (strings). `NoteBody` is **unchanged**.
- `LIMITS.message` changes from 4000 to 3800 (comment: `// 200 left for the details footer; firestore.rules caps message at 4000.`).
- In `prepareNote`, after validation: look up each id in `platforms`, `timelines`, and `budgets` (from `config/offers.ts`). Unknown or empty ids are skipped.
  If any are found, the stored message is `${message}\n\n---\nPlatform: X\nTimeline: Y\nBudget: Z` (only the lines that were found).
  Also return `details: { platform, timeline, budget }` (ids, "" when unknown) on the ok result for analytics.
  Update `fieldError`'s defaults to include the three new keys as "".
- Tests in `lib/note.test.ts`: the footer is appended with the labels; unknown ids are ignored; no footer when all are empty; a 3800-character message plus the full footer is ≤ 4000; 3801 characters are rejected.

`components/site/NoteForm.tsx`:
- `read()` reads `platform`, `timeline`, and `budget`.
- After the offer `Select`, add three `Select`s: `label="Platform (optional)" name="platform"`, `label="Timeline (optional)" name="timeline"`,
  `label="Budget (optional)" name="budget"`. The first option is `<option value="">Choose one</option>`, then the list. On wide screens place
  Timeline and Budget side by side: `<div className="grid gap-5 sm:grid-cols-2">`.
- Events: `onFocus` on the `<form>` → `form_start` `{ offer }` once (`useRef(false)` guard). On a validation error → `form_error` `{ field }`.
  After a valid prepare (not a drop) → `form_submit` `{ offer, platform, timeline, budget }`. On `createNote` success → `generate_lead`
  `{ offer, currency: "INR", value: offer ? offers[offer].priceMinor / 100 : 0 }`. On catch → `form_fail`. The mailto path fires `form_submit` only.
- `createNote` and `lib/firestore.ts`: **no change**. `firestore.rules`: **no change**.

`app/(site)/legal/privacy/page.tsx`: "What is collected" adds "and, if you choose, the platform, timeline, and budget range". "Where it goes" adds
"Google Analytics also records which buttons are clicked and whether the form was sent, without the form's contents."

### E5. Tests (e2e)
- `/contact` has the labels "Platform (optional)", "Timeline (optional)", and "Budget (optional)", and the budget select has the option "Not sure yet".
- The honeypot and bad-email tests still pass (update the `getByLabel("Email")` selector only if it becomes ambiguous).
- One test stubs `window.gtag` with `page.addInitScript(() => { (window as any).__ev = []; (window as any).gtag = (...a: unknown[]) => (window as any).__ev.push(a); })`,
  clicks the home hero primary, and expects `["event", "cta_click", { cta_id: "hero_primary", … }]` in `__ev`.

**Acceptance E:** the phase gate passes. `git diff main -- firestore.rules lib/firestore.ts` is empty. A real note sent on production shows the footer
lines in Firestore. GA4 DebugView (owner, with the GA debugger extension) shows `cta_click`, `form_start`, `form_submit`, and `generate_lead`.
Commit: `feat(site): track CTAs and form steps, and ask for platform, timeline, and budget`.

---

## Phase F: verification (after A–E are live)

1. Run the full phase gate on `main`.
2. `CI=true E2E_BASE_URL=https://appamania.in npx playwright test`.
3. PageSpeed Insights (mobile) on `/`, `/services`, `/services/flutter-upgrade`, and `/contact`: LCP ≤ 2.5 s, CLS ≤ 0.1, no failing
   accessibility audit. Record the numbers in the PR or issue.
4. Compare the `next build` route table with the Phase A output: first-load JS per route grows ≤ 5 kB.
5. Google Rich Results Test on home (Organization), a case study (Breadcrumb, Article), and an app (Breadcrumb).
6. `curl -sI https://appamania.in/services` → 200. `curl -sI https://appamania.in/blog` → 200 with `noindex` in the HTML. `curl -s https://appamania.in/sitemap.xml`
   lists 3 landing pages and `/about`.
7. Owner: submit the sitemap in Search Console and Bing, request indexing for the new URLs, mark `generate_lead` as a key event, and start the
   28-day baseline note (PRD §4).
8. Netlify usage page: note the credits used so far this cycle. If they are above 150 by mid-cycle, stop merging and tell the owner.
9. Run the `design-reviewer` subagent across `app/(site)` and `components/site` one last time.

---

## Appendix 1: separate form fields (only with written owner approval)

Applies instead of the message footer in E4. `firestore.rules`, notes `allow create`:
```diff
-        && request.resource.data.keys().hasOnly(['name', 'email', 'message', 'link', 'offer', 'received'])
+        && request.resource.data.keys().hasOnly(['name', 'email', 'message', 'link', 'offer', 'received', 'platform', 'timeline', 'budget'])
+        && request.resource.data.platform is string && request.resource.data.platform.size() <= 20
+        && request.resource.data.timeline is string && request.resource.data.timeline.size() <= 20
+        && request.resource.data.budget is string && request.resource.data.budget.size() <= 20
```
`NoteBody` and `createNote`'s parameter type gain `platform`, `timeline`, and `budget` (ids, "" when unknown). `LIMITS.message` stays at 4000,
and nothing is appended to the message. Ship the rules first (merge to `main` deploys them through CI), then the form. In the reverse order, every
note is rejected until the rules deploy.
