# PRD: Appamania as a brand, hosted on Netlify

Branch `feat/brand-netlify`, cut from `main` (release 1.2.0). Plan only, nothing committed.
Brand source of truth: `docs/brand.md`. Build steps: `guidelines.md` (this folder).

## 1. Problem

1. **The site reads as a freelancer's portfolio, not a brand.** The home hero leads with "I'm Sumit Pal"
   (`config/home.ts`), the Person JSON-LD on home has no Organization, case studies say "What I
   did", and there is no About page that explains who Appamania is. A CTO or founder landing cold
   cannot tell whether this is a company they can contract.
2. **The Services page is unreachable.** `next.config.ts` still has
   `{ source: "/services", destination: "/" }` from the portfolio era (commit 63fa521), and
   `tests/e2e/site.spec.ts` asserts it. The nav "Services" link, the footer, the sitemap and llms.txt
   all point at a URL that 301s to home. Next.js applies config redirects before routes, so
   `app/(site)/services/page.tsx` never renders. Fix this first.
3. **SEO is thin.** Every page shares one OG image with a hard-coded "₹2,999" (it breaks the
   prices-only-in-`config/offers.ts` rule). There is no Organization, FAQPage, BreadcrumbList or
   SoftwareApplication data, and no pages target the problems buyers search for. The Blog is in the
   nav with zero posts.
4. **CTAs are not measured.** GA4 records page views only. Nobody knows which CTA or form step loses
   people.
5. **Hosting.** The owner wants Firebase App Hosting (Blaze, `apphosting.yaml`) replaced with
   Netlify. Firestore stays, but only for the anonymous `notes` create.

## 2. Goals

- G1. Position Appamania as a Flutter rescue studio (`docs/brand.md` §1 A) on every page, with
  proof drawn only from real facts.
- G2. One primary CTA per view, all leading to the audit. Measure every CTA and form step in GA4.
- G3. Search visibility: titles and descriptions per page, per-route OG images, structured data,
  three problem landing pages, and a clean sitemap.
- G4. Run on Netlify with no downtime and no lost redirect or security header, and stay inside
  the free credit pool.

## 3. Non-goals

- No new runtime dependencies, no animation library, no CMS, no second database, no Firebase SDK in
  the browser.
- No Firestore rules change by default (see §8.4 and open question 1).
- No invented proof. Owner-only facts render nothing until filled (brand §8).
- No rename of the company or domain. No new theme. No token values change.
- No blog content. The route stays and is demoted.
- No Netlify Forms, Netlify Functions written by hand, or Edge Functions.
- No DNS move to Netlify DNS: MX and verification records stay at GoDaddy.

## 4. Success metrics

Baseline = the 28 days before Phase C ships, from GA4 and Search Console. Targets are set against
that baseline, so no invented absolute numbers.

| Metric | Source | Definition | Target (90 days after Phase F) |
|---|---|---|---|
| Lead rate | GA4 | `generate_lead` events / sessions | Up on baseline |
| Home CTA rate | GA4 | sessions with `cta_click` where `cta_location`=`/` / home sessions | Up on baseline |
| Form completion | GA4 funnel exploration | `form_start` → `form_submit` → `generate_lead` | ≥ 50% start → lead |
| Form errors | GA4 | `form_error` count by `field` | Falling; no field above 20% of starts |
| Booking clicks | GA4 | `booking_click` | Tracked (no baseline today) |
| Non-branded clicks | Search Console | Clicks for queries without "appamania" | Up on baseline |
| Landing page impressions | Search Console | Impressions on the three `/services/*` pages | > 0 by week 4, rising |
| Indexed pages | Search Console > Pages | Indexed / sitemap URLs | 100% of sitemap |
| Rich results | Search Console > Enhancements | Breadcrumbs and Organization valid, 0 errors | 0 errors |
| Core Web Vitals | Search Console CWV + PageSpeed Insights | LCP, INP, CLS at p75 mobile | All "Good" |
| Hosting health | Netlify usage page | Credits used per month | < 200 of 300 |

## 5. Information architecture

| Route | Status | Nav |
|---|---|---|
| `/` | Redo | Logo |
| `/services` | Fix redirect, redo | Services |
| `/services/flutter-upgrade` | New landing page | Footer, home, services, case studies |
| `/services/flutter-app-rescue` | New landing page | Footer, home, services |
| `/services/flutter-app-audit` | New landing page | Footer, home, services, contact |
| `/work`, `/work/[slug]` | Redo copy, add breadcrumbs and outcome | Work |
| `/apps`, `/apps/[slug]` | Repositioned as "Products": the studio's own apps | Apps |
| `/open-source`, `/open-source/[slug]` | Small copy changes, breadcrumbs | Open source |
| `/about` | New | About |
| `/contact` | Redo, new form fields | Nav CTA, mobile menu |
| `/blog`, `/blog/[slug]` | Demoted: out of nav, footer and sitemap while `posts` is empty; `noindex` when empty | None |
| `/legal/privacy` | Update for Netlify and new form fields | Footer |

Desktop nav order: Services, Work, Apps, Open source, About, then the "Book an audit" button.
Mobile menu: Home, the same five, Contact.

Footer columns: **Services** (Services and prices, Flutter upgrade, Flutter app rescue, Flutter app
audit) · **Studio** (Work, Apps, Open source, About) · **Contact** (email, Book an audit, Book a call
when `site.links.booking` is set, LinkedIn company page when set, GitHub, X, LinkedIn).

## 6. Page-by-page spec

Copy is a draft. Final strings live in config files (`guidelines.md` Phase B). Price strings always
come from `formatPrice`.

### Home (`/`)
1. **Hero**, copy left, phones right (layout kept). The eyebrow chip is `site.descriptor` ("Flutter
   rescue studio · Kolkata"). The H1 keeps its structure (before / pill / after / accent): "Stuck
   Flutter app? [pill] Fixed price, shipped." The lead is from brand §7. Primary: "Book the ₹2,999
   audit" → `/contact?offer=audit`. Secondary (outline): "Read the case studies" → `/work`.
2. **ProofStrip** (new) replaces both the stats `<dl>` and the tech marquee. It is full bleed, with
   four facts computed from content: years, regressions on the last upgrade, the package-points
   range (live), and the app count. Each fact links to its proof.
3. **01 — What Appamania fixes**: the bento is recomposed around buyer problems. Each tile links to a
   landing page: "Stuck on an old SDK" → upgrade; "Crashes in production" → rescue; "No CI, manual
   releases" → rescue; "Not sure what is wrong" → audit; the brand tile is "6+ yrs".
4. **02 — Plans**: `Plans` unchanged.
5. **03 — How it works**: `Steps`, the same four steps as services (moved to `config/home.ts`
   `steps`).
6. **04 — Work**: `WorkCards` plus the existing "0 regressions" panel.
7. **05 — Built and run by Appamania**: two tiles, apps (count plus link) and packages (live
   points plus link). Shows that the studio ships its own products.
8. **06 — Who runs it**: compact `FounderCard` linking to `/about`.
9. **07 — FAQ** (also emitted as FAQPage). Add "Is Appamania a team?" with the answer
   "No. Appamania is founded and run by Sumit Pal. He does every audit and sprint himself."
10. **CtaBand**: "Send the repo. Get a report." → "Book the audit".

### Services (`/services`)
Remove the redirect. Hero with one primary (the audit). Plans (detail). "Common problems": three
cards linking to the landing pages. Steps. FAQ. CtaBand. The ProfessionalService JSON-LD stays,
with `provider` linked to the Organization `@id`.

### Landing pages (`/services/[slug]`, one route, data in `config/landing.ts`)
Hero (H1 states the problem, lead names the fix, primary CTA is the linked offer: the audit for all
three, preselecting `?offer=`). "Signs you need this" (3–5 bullets). "What happens" (the shared
`Steps`). Related case study (`WorkCards` with one item). The matching plan card. FAQ (3 questions,
emitted as FAQPage). CtaBand. Breadcrumbs: Home › Services › page.

| Slug | H1 | Target queries (to verify in Search Console and Keyword Planner) | Case study |
|---|---|---|---|
| `flutter-upgrade` | Upgrade your Flutter app without pausing releases. | flutter upgrade service; upgrade flutter app to latest version; flutter version migration; flutter 3 migration; flutter cocoapods to swift package manager | flutter-3-47-upgrade |
| `flutter-app-rescue` | Fix a Flutter app that crashes or lost its developer. | fix flutter app crashes; flutter app maintenance; take over flutter project; flutter developer for existing app; flutter app support india | telecom-flutter-3-migration |
| `flutter-app-audit` | A written Flutter app audit in 48 hours. | flutter code audit; flutter app audit; flutter code review service; flutter app health check | in-house-crash-reporting |

### Work (`/work`, `/work/[slug]`)
Index: hero copy from brand §7, WorkCards, CtaBand (audit). Case study: Breadcrumbs. Eyebrow "02 —
What I did" becomes "02 — The work". Add an optional `outcome` line (owner fact, renders nothing when
empty). Add a "Related service" link to the landing page that lists this slug. The CtaBand changes
from "Send a note" to the audit primary.

### Apps (`/apps`, `/apps/[slug]`)
Eyebrow "Products". Title "Apps Appamania builds and" with accent "runs itself." Lead: "Flutter apps
designed, built, and published by Appamania on Google Play. The same release process clients pay
for." Real screenshots render from `public/media/` once the owner adds them (`screens`, `icon` in the
snapshot). Until then the initial-letter tile stays and nothing fake is shown. Detail page:
Breadcrumbs, SoftwareApplication, and a closing line linking to `/services`.

### Open source
Copy unchanged apart from a closing line linking to services. Detail page gets Breadcrumbs.

### About (`/about`, new)
Hero: "Appamania is run by" with accent "Sumit Pal." `FounderCard` (photo when
`site.founderPhoto` is set, otherwise the Mark). "How Appamania works": four principles (read first,
fixed price, you own the code, releases never pause). "The record": ProofStrip. "Business details":
legal name (when set), Udyam-registered (number when set), Kolkata, invoiced in INR, USD on request.
Links: LinkedIn, GitHub, pub.dev publisher, Play developer page (when set). Testimonials: the
`Quote` component, which renders nothing while `config/proof.ts` is empty. CtaBand.

### Contact (`/contact`)
Hero: eyebrow "Contact", "Start with" plus accent "the audit." Lead: "Say what the app does and what
is wrong. Sumit Pal replies within one working day, IST, with next steps or a fixed quote." "What
happens next": three numbered lines. Booking link (outline). Form with the new fields (§8.4).

## 7. Design direction

- **Unchanged:** tokens, Night theme, Geist and Geist Mono, pill buttons, saffron fill-only, radii,
  `.reveal` and `.enter`, one `shadow-glow` per page, the CtaBand with the saffron disc, the outlined
  footer wordmark. No new tokens are needed.
- **Hero:** the brand descriptor chip goes above the H1, and the lead is in brand voice.
- **Phone mocks:** keep. They show the deliverable (a sample report and a release checklist), they
  are labelled "Sample report", and they sit in a `role="img"` with an honest `aria-label`. They are
  not offered as client proof. Never add invented client names or numbers to them.
- **Real screenshots:** `public/media/` is empty today. Apps and case studies show media only when
  the owner commits files and snapshot paths (owner task). No placeholder images.
- **Proof:** the ProofStrip replaces the tech marquee, so facts take the place of a buzzword list.
  Delete `Marquee`, `homeCopy.stack`, `config/catalog.ts` `stack`, and the `marquee` keyframes. Update
  the brief's home rhythm to match.
- **Trust:** a row of `Chip`s under the services hero and on About: "Udyam-registered", "Invoiced in
  INR", "You own the code", "Report in 48 h or free". Each comes from `config/site.ts` or
  `config/offers.ts`.
- **Typography:** unchanged. The landing-page H1 uses `PageHero` (clamp 52–112 px); landing H1s are
  kept to 3 lines at 390 px.
- **Motion:** unchanged. `ProofStrip` uses `.reveal`, which is static under reduced motion.
- **OG images:** one shared renderer, `lib/og.tsx`, used by the root, services, landing, case study,
  app and about images. Night ground, brand mark, eyebrow, title and descriptor. Prices go through
  `formatPrice`.
- **Placeholders:** the brief's "visible `[PLACEHOLDER]` markers" rule is replaced by "owner fields
  render nothing until filled". Update the brief.

## 8. CTA system

1. **One primary per view.** On pages whose hero has the audit primary (`/`, `/services`,
   `/services/*`, `/contact`), the nav button is outline. Everywhere else the nav button is primary.
   Change `NavCta` to `path === "/" || path === "/contact" || path.startsWith("/services")`.
2. **Secondary:** an outline button next to the primary (case studies, call booking). Plan-card
   buttons stay outline.
3. **Nav:** "Book an audit" → `/contact?offer=audit`.
4. **Sticky mobile CTA:** no extra bar. The nav is already sticky (`Navbar`, `sticky top-…`) and
   shows `NavCta` beside the menu button below 900 px, so a second bar would duplicate it and cover
   content.
5. **Form changes.** Add three optional selects: **Platform** (Android, iOS, Android and iOS, Web,
   Not sure), **Timeline** (This month, In 1–3 months, Later, Just exploring) and **Budget**
   (bands in `config/offers.ts`: under ₹25,000; ₹25,000–₹75,000; ₹75,000–₹2,00,000; over
   ₹2,00,000; not sure). All three are optional so the form stays short.
   - **Default, no rules change:** `prepareNote` checks each value against its allowed id list
     (unknown becomes "") and appends the chosen labels to `message` as a footer block
     (`Platform: …`, `Timeline: …`, `Budget: …`). The user's message cap drops from 4000 to 3800 so
     the stored message stays within the rules' 4000 cap. `NoteBody`, `createNote` and
     `firestore.rules` do not change. The mailto fallback carries the footer too.
   - **Alternative, needs owner approval:** store them as fields `platform`, `timeline` and `budget`.
     Add them to `hasOnly`, each `is string && size() <= 20`, and change `NoteBody` and `createNote`
     to match. The exact diff is in `guidelines.md` Appendix 1. No zod change either way: `lib/note.ts`
     is hand-checked on purpose, because it ships to the browser.
6. **Contact promise** under the submit button: "Sumit reads every note and replies within one
   working day, IST."

## 9. SEO and meta

### Titles and descriptions
Template `%s · Appamania`. Counts include the suffix. The descriptions are drafts; the implementer
rechecks the counts with the snippet in guidelines Phase D.

| Route | Title (chars) | Description (chars) |
|---|---|---|
| `/` | Appamania · Flutter app rescue, upgrades and releases (53, absolute) | Flutter rescue studio in Kolkata. A written audit in 48 hours, then a fixed-price sprint to upgrade the SDK, fix crashes, and ship to both stores. (146) |
| `/services` | Flutter services and fixed prices (45) | Flutter app audit ₹2,999 in 48 hours, rescue sprint ₹24,999, care retainer ₹14,999/month. Fixed prices in INR from a Udyam-registered business. (143, built with formatPrice) |
| `/services/flutter-upgrade` | Flutter upgrade and migration service (49) | Upgrade a live Flutter app to the current SDK, plugins, and Swift PM without pausing releases. Written audit first, then a fixed-price sprint. (142) |
| `/services/flutter-app-rescue` | Fix a crashing or stuck Flutter app (47) | Take over a Flutter app that crashes, lags, or lost its developer. Root-cause fixes, CI, and a store release at a fixed price. You own the code. (144) |
| `/services/flutter-app-audit` | Flutter app audit in 48 hours (41) | A written Flutter code audit for ₹2,999: crashes, SDK and dependency gaps, CI and store risks, scored with the top fix first. In 48 hours or free. (146) |
| `/work` | Flutter case studies: upgrades and rescues (54) | Flutter SDK migrations, a Flutter 2 to 3 move for a telecom app, and an in-house crash platform. Anonymised by default, with the steps and results. (147) |
| `/work/[slug]` | `teaser.title` (53 for the longest) | `lead` (check ≤ 160; trim in the snapshot if longer) |
| `/apps` | Flutter apps on Google Play (39) | Spend Analytics, Medify, Minimalist Forecast, and Wally: Flutter apps that Appamania designs, builds, and publishes on Google Play. (131) |
| `/apps/[slug]` | `${name}: ${category} app for Android` (≤ 52) | `summary` + " Built and published by Appamania." |
| `/open-source` | Open-source Flutter packages on pub.dev (51) | envified, drip_flutter, and screenx: Flutter and Dart packages from the appamania.in verified publisher on pub.dev, with live points and downloads. (147) |
| `/open-source/[slug]` | `${name}: Flutter package` | `summary` |
| `/about` | About Appamania and founder Sumit Pal (37, absolute) | Appamania is a Flutter rescue studio in Kolkata, founded and run by Sumit Pal, a Flutter engineer with 6+ years of production apps. Udyam-registered. (149) |
| `/contact` | Book a Flutter app audit (36) | Send the app or repo and what is wrong. Sumit Pal replies within one working day, IST, with next steps or a fixed quote. Or book a 20-minute call. (146) |
| `/blog` | Blog (unchanged), `robots: { index: false }` while empty | unchanged |

### Canonical and Open Graph
- Every page calls `pageMeta({ title, description, path, absolute? })` from `lib/seo.ts`. It
  returns `title`, `description`, `alternates.canonical`, `openGraph` (title, description, url,
  siteName, locale `en_IN`, type) and `twitter.card = "summary_large_image"`. A helper is required
  because Next.js merges metadata shallowly: a page's `openGraph` replaces the layout's
  (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`, "Merging").
- Per-route `opengraph-image.tsx` files: root, `services`, `services/[slug]`, `work/[slug]`,
  `apps/[slug]`, `about`. Open source uses the root image.

### Structured data (all through the existing `JsonLd`)
| Type | Where | Key fields |
|---|---|---|
| Organization | `app/(site)/layout.tsx` (every page) | `@id` `${site.url}/#org`, name, url, logo `${site.url}/icon.svg`, email, address (Kolkata, IN), founder Person (Sumit Pal, sameAs personal LinkedIn and X), `sameAs` = non-empty of GitHub org, pub.dev publisher, LinkedIn company, Play developer page, `legalName` when set |
| ProfessionalService | `/services` | existing, plus `provider: { "@id": org }` and `url`, `areaServed`; the offers from `config/offers.ts` stay |
| FAQPage | `/`, `/services`, each landing page | from the same arrays that render the FAQ (no hidden Q&A) |
| Article | `/work/[slug]` | headline, description, author Person, publisher `{ "@id": org }`, `datePublished`/`dateModified` from the optional `date`/`updated` snapshot fields (omitted when empty), image = the route's OG image |
| SoftwareApplication | `/apps/[slug]` | name, operatingSystem "Android", applicationCategory (map: Finance→FinanceApplication, Health→HealthApplication, Weather→UtilitiesApplication, Casual→GameApplication), `installUrl` = Play URL, author `{ "@id": org }`. No `offers`/`aggregateRating` until the owner confirms (Google shows no rich result without them, and that is accepted) |
| BreadcrumbList | `/services/[slug]`, `/work/[slug]`, `/apps/[slug]`, `/open-source/[slug]` | from the `Breadcrumbs` component, the same items as the visible trail |
| Person on home | removed | folded into Organization.founder |

Note: since 2023 Google shows FAQ rich results only for government and health sites. The FAQPage
markup stays because it is cheap and AI engines read it. No rich result is expected.

### Sitemap, robots, llms.txt
- Sitemap: add `/about` and the three landing pages. Drop `/blog` and posts while `posts` is empty.
  `lastModified` comes only from the optional `updated` snapshot fields (no fake build-time dates).
- Robots: unchanged (allow all, sitemap URL). The Netlify `*.netlify.app` host is covered by the
  canonical tags.
- llms.txt: rewrite the summary with the positioning, an About section (who runs it), the landing
  pages, offers via `formatPrice`, and Blog only when posts exist.

### Internal linking
- Home problem tiles → landing pages. Landing pages → related case study, `/services`, `/contact?offer=`.
- Case study → related landing page ("Related service"), CtaBand → contact.
- Apps and open source → `/services` ("The same process, for your app").
- Footer → all landing pages and About.
- About → work, apps, open source.

## 10. Analytics (GA4, gtag already loaded by `components/site/Analytics.tsx`)

| Event | When | Params |
|---|---|---|
| `cta_click` | Click on any element with `data-cta` | `cta_id` (e.g. `hero_primary`, `nav`, `plan_sprint`, `cta_band`, `landing_primary`), `cta_location` (pathname), `offer` |
| `booking_click` | Click on the calendar booking link (`data-cta="booking"`) | `cta_location` |
| `email_click` | Click on any `mailto:` link | `cta_location` |
| `form_start` | First focus inside the note form (once per page load) | `offer` |
| `form_error` | Submit with a validation error | `field` |
| `form_submit` | Valid submit, before the network call (not for the honeypot) | `offer`, `platform`, `timeline`, `budget` |
| `generate_lead` | Firestore create succeeded | `offer`, `currency: "INR"`, `value` = offer price in rupees or 0 |
| `form_fail` | Firestore create failed | none |

Outbound clicks (Play, pub.dev, GitHub) use GA4 enhanced measurement, so there is no custom code.
One delegated click listener (`components/site/CtaTracker.tsx`) handles every `data-cta` and
`mailto:` click. No scroll listeners. Owner tasks in GA4: mark `generate_lead` as a key event and
register the custom dimensions.

## 11. Performance budget

- LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 mobile (PageSpeed Insights on `/`, `/services`,
  one landing page, `/contact`).
- First-load JS per route grows ≤ 5 kB gzip over the Phase A `next build` output. The only new
  client code is `CtaTracker` and three selects.
- No image in any hero. All media goes through sized `next/image` (Netlify Image CDN).
- No new fonts, no new runtime deps (`package.json` `dependencies` unchanged).

## 12. Accessibility checks

- axe (serious and critical = 0) on every route, including `/about`, the three landing pages, and one app and package detail page.
- One `h1` per page. The breadcrumb is a `<nav aria-label="Breadcrumb">` with an `<ol>` and
  `aria-current="page"` on the last item.
- New selects use `Select` from `components/ui/Field.tsx` (label above, `aria-describedby`).
- ProofStrip is a `<dl>`. Linked facts have discernible text. Number contrast is 4.5:1 (`text-ink` on
  `paper`).
- The founder photo has alt text "Sumit Pal, founder of Appamania".
- Keyboard: every new link and select is reachable with a visible focus ring. Targets are ≥ 44 px on
  touch.
- Reduced motion: no new animation apart from `.reveal`.

## 13. Hosting decision

**Recommend (a): the Netlify runtime (OpenNext adapter) with ISR, not a static export.**

Netlify facts checked 2026-11-14 (docs.netlify.com):
- The free plan has 300 credits a month as a hard limit. When credits run out, **every project on
  the account is paused** until the next cycle.
- A production deploy costs 15 credits. Deploy previews, branch deploys and failed deploys cost
  nothing. Bandwidth is 20 credits per GB, compute 10 per GB-hour, and requests 2 per 10k.
- Next 13.5+ is supported with zero config. ISR, redirects and `next/image` (Netlify Image CDN) are
  supported. Next 16 is not named explicitly; verify it on the first deploy.

Why (a):
1. **Deploys are the expensive line.** A static export needs a scheduled rebuild to keep pub.dev
   numbers fresh. Daily rebuilds alone use 30 × 15 = 450 credits, over the pool. ISR refreshes
   the numbers without a deploy.
2. **Zero code change.** `next.config.ts` `headers()` (CSP, HSTS) and `redirects()` keep working
   under the adapter. A static export ignores both (Next docs, static-exports "Unsupported
   features"), so all of it would have to be rewritten into `netlify.toml`. `?offer=` on contact,
   `next/image`, `opengraph-image` and the route handlers all work as they are.
3. **Compute stays small.** Most pages stop revalidating (content is static in the repo). Only pages
   that show pub.dev numbers keep `revalidate = 3600`.

Credit guardrails: production deploys only from `main`, batched merges (≤ 12 a month = 180
credits), a `netlify.toml` `ignore` rule that skips docs-only commits, and a monthly check of the
usage page. Fallback, if the credits still run hot: a static export with no scheduled rebuild (pub.dev
numbers refresh on each deploy), with headers and redirects moved to `netlify.toml`.

## 14. Risks

1. **Credit exhaustion pauses the site** (and every other project on the account). A traffic
   spike or a burst of merges could take the business site offline mid-month. Mitigation: §13
   guardrails, and move to a paid plan once leads arrive (owner decision).
2. **The Services URL change is visible to Google.** `/services` has been a 301 to `/`. Removing it
   makes the page indexable again, which is the goal. Search Console may show "Page with redirect"
   until it recrawls.
3. **DNS cutover.** A leftover apex A or AAAA record pointing at Firebase would split traffic.
   Deleting MX or TXT records would break Workspace mail. Mitigation: the exact record list and
   `dig` checks in guidelines Phase A, a lowered TTL, and the App Hosting backend kept for 7 days
   as a rollback.
4. **Firebase browser-key restrictions.** If the API key is HTTP-referrer restricted, notes from
   `*.netlify.app` fail during pre-cutover tests. Mitigation: owner checks the key restrictions,
   and testing uses the mailto fallback in previews.
5. **Next 16.4 on the OpenNext adapter** is not named in Netlify docs. Mitigation: the first deploy is to
   the `netlify.app` URL, and e2e runs against it (`E2E_BASE_URL`) before any DNS change.
6. **Brand voice drifting into "we".** Mitigation: the brand §6 table goes into the design brief and the
   design-reviewer checks copy.
7. **Commercial use on the Netlify free plan** is not stated in the credit docs. The owner confirms it in the
   Netlify Terms before cutover.

## 15. Open questions

1. Form fields: keep `firestore.rules` unchanged and fold platform, timeline and budget into `message`
   (default), or approve the rules change in Appendix 1 for separate fields?
2. The "Business website" offer does not fit a Flutter rescue brand. Keep it as the "Also" line,
   or remove it from `config/offers.ts`?
3. Apps page: keep "Wally — The Stupid" and the "Network." in-development panel? They show
   personality but sit oddly next to a pitch to CTOs. Default: keep Wally last, keep Network.
4. Approve the voice rule: no "we", the brand as subject, "I" only where Sumit signs.
5. Approve the descriptor "Flutter rescue studio" (vs "Flutter upgrades and releases").
6. Agencies: are white-label work and NDAs offered? (FAQ copy depends on it.)
7. Primary domain: apex `appamania.in` (recommended: matches `site.url`, canonicals and Search
   Console) or www (Netlify's preference)?
8. After App Hosting is deleted: downgrade the Firebase project to Spark, or stay on Blaze with a budget
   alert?
9. Removing the tech marquee: approve, since it changes the brief's home rhythm.
10. Netlify free plan with a pause risk, or start on a paid plan?

## Owner tasks and facts needed

### Accounts and hosting
1. **Netlify account.** Create it or use an existing one. Confirm in Netlify's Terms of Use that the
   free plan allows commercial use. Turn on usage email notifications.
2. **Site creation.** Import `Appamania/appamania` from GitHub (grant the Netlify app access to the
   private repo). Production branch `main`. Deploy previews on for pull requests, branch deploys off.
   Leave build settings to `netlify.toml`.
3. **Env vars** (Site configuration › Environment variables, scope Builds + Runtime, context
   **Production** only): `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   (`appamania-web`), `NEXT_PUBLIC_GA_MEASUREMENT_ID`. The values are the ones in `apphosting.yaml`
   today. Previews then use the mailto fallback and send no analytics.
4. **Firebase API key.** In Google Cloud console › APIs & Services › Credentials, check whether the
   browser key has HTTP-referrer restrictions. If it does, add `https://<site>.netlify.app/*` for
   the test window and keep `https://appamania.in/*`.
5. **DNS at GoDaddy** (exact steps in guidelines Phase A): lower the TTL a day ahead. Delete every
   apex A/AAAA record that is not Netlify's, and any GoDaddy parked record. Add `A @ 75.2.60.5` and
   `CNAME www <site>.netlify.app`. Keep MX, SPF, DKIM, DMARC and `google-site-verification` TXT.
6. **Delete the App Hosting backend** 7 days after the cutover is stable. Remove its custom domain
   first. Then decide on Blaze vs Spark (open question 8) and delete leftover Artifact Registry
   images if you stay on Blaze.
7. **Keep** the `FIREBASE_SERVICE_ACCOUNT` and `FIREBASE_PROJECT_ID` GitHub secrets: CI still
   deploys `firestore.rules`.

### Visibility
8. **Search Console:** a Domain property for `appamania.in` (DNS TXT, already done if it exists).
   Submit `https://appamania.in/sitemap.xml` after Phase D. Request indexing for `/services`, `/about`
   and the landing pages.
9. **Bing Webmaster Tools:** import from Search Console and submit the sitemap.
10. **GA4:** mark `generate_lead` as a key event. Register the event-scoped custom dimensions
    `cta_id`, `cta_location`, `offer`, `field`, `platform`, `timeline` and `budget`. Exclude internal
    traffic by IP if wanted.
11. **Google Business Profile:** decide. It is only eligible as a service-area business with the
    address hidden. If yes, use the same name, category "Software company", and the site URL.
12. **LinkedIn company page** "Appamania": once created, put its URL in
    `site.links.linkedinCompany` (it feeds the footer and Organization `sameAs`).
13. **pub.dev publisher page** (`appamania.in`): set the publisher website to `https://appamania.in`
    and the description to the tagline.
14. **GitHub org README** (`Appamania/.github` repo, `profile/README.md`): the tagline, the site link,
    and the packages.
15. **Play developer name:** make it "Appamania" if it is not already. Put the developer page URL in
    `site.links.play`.
16. **Directory listings** (Clutch, GoodFirms): create profiles with the factual description only.
    No reviews unless a real client writes one through the platform. Never seed or ask friends.

### Facts only the owner can give (each renders nothing until set)
17. Availability text → `site.availability`.
18. A real testimonial with written permission → `config/proof.ts` `testimonials`.
19. One real, client-approved outcome per case study → snapshot `work[].outcome`. One per app (for
    example installs from the Play Console) → snapshot `apps[].outcome`.
20. A founder photo (square, ≥ 800 px, real) → `public/media/sumit-pal.jpg` and
    `site.founderPhoto`.
21. The exact legal name as on the Udyam certificate → `site.legalName`. Whether to show the Udyam
    number → `site.udyam` (empty hides it).
22. Case study dates → snapshot `work[].date` and `updated` (`YYYY-MM-DD`).
23. App screenshots and icons → `public/media/apps/<slug>/…` and snapshot `icon`/`screens`.
24. Whether the Play apps are free (for SoftwareApplication `offers`).
25. Confirm that "reply within one working day" and "USD on request" still hold.
