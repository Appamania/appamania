# Appamania brand

Status: proposal for owner approval (2026-11-14). Plan: `docs/plans/brand-netlify/`.
Rule zero: every claim on the site is a fact from this repo, or an owner-supplied field that renders
nothing until it is filled. No invented clients, logos, quotes, team size, awards or outcome numbers.

## 1. Positioning

**Recommended (A): Flutter rescue studio.**
For founders and engineering leads with a live Flutter app that is stuck (it crashes, sits on an old
SDK, or nobody dares to release it), Appamania is a Flutter rescue studio. It reads the code first,
then upgrades, fixes and ships the app at a fixed price. Agencies quote before they read the code and
hourly freelancers bill open-ended. Appamania starts every job with a written audit and ends it with a
release you can see, in your own repo.

Why A:
- All three case studies are rescues or migrations (3.41 → 3.47, 2 → 3, replacing paid tools). The
  proof matches the promise.
- The cheapest offer (the audit) is the way in, and it is the same problem the headline names.
- "Stuck Flutter app" is a problem people search for. "Flutter developer" is a crowded category
  people only browse.

**Alternative (B): Flutter product studio.** "Build, rescue and care for Flutter apps." It is broader
and covers the MVP and website offers. But it competes with every agency, and there is no MVP case
study to back it. It reads like a portfolio again.

**Alternative (C): Flutter release engineering.** "SDK upgrades, CI and store releases, nothing
else." This is the sharpest option and the strongest proof match. But the market is small, and it
leaves out crash-rescue buyers and the retainer.

Recommendation: A. Use C's language (upgrades, CI, releases) as the proof under A.

## 2. The problem in one sentence

Live Flutter apps fall behind on SDKs, plugins and store rules until nobody dares to ship them.
Appamania gets them current and releasing again without pausing users.

## 3. Buyers

| Buyer | Situation | What they want | What they fear | Entry offer |
|---|---|---|---|---|
| Founder (non-technical) | App is live, the original developer left, store warnings are piling up | A working app and a plain-English plan with a fixed price | Open-ended bills, being locked out of their own code | Audit, then sprint |
| CTO or engineering lead at a product company | Team busy on features, SDK upgrade keeps slipping | The upgrade done on a branch with CI, reviewed by their team, no regressions | A contractor breaking main or going dark | Sprint |
| Agency | Inherited or overflow Flutter project | A reliable specialist who works in the client's repo | Missed dates, a subcontractor who poaches the client | Sprint (terms are an owner question) |
| Product company with Flutter in production | Shipped app, no one owns upkeep | Someone on call for SDK bumps and store policy | Paying for idle hours | Care retainer |

Secondary: early-stage founders who need an MVP (offer stays on services, not in the headline). Small
businesses who need a website: keep the offer as an "Also" line or drop it (open question).

## 4. Brand promise

**Read first. Fixed price. Shipped.** You get a written report before any quote, a price before any
work, and a release you can see at the end. The code stays yours from the first commit.

### Reasons to believe (all from the repo)

| Claim | Source |
|---|---|
| 6+ years of production Flutter | `proofFacts` in `config/home.ts` |
| Flutter 3.41 → 3.47, two-step upgrade, 0 regressions, releases not paused | `content/snapshot.json` work[0] |
| Flutter 2 → 3 for an enterprise telecom app, 0 regressions in production | work[2] |
| Built two internal platforms that replaced paid crash and task tools | work[1] |
| 4 apps published on Google Play (Spend Analytics 50+ installs) | snapshot apps |
| 3 packages from a verified pub.dev publisher, 150–160 points, live numbers | snapshot packages, `lib/live.ts` |
| Audit report in 48 hours or the audit is free | `config/offers.ts` audit.guarantee |
| Fixed prices in INR, Udyam-registered, invoiced | `config/offers.ts`, `config/site.ts` |
| You own the code, work happens in your repo | services FAQ |

## 5. Naming and tagline

Keep the name **Appamania**. The domain, pub.dev publisher, GitHub org, Play listings and Udyam record
already carry it. Renaming would throw that away.

Descriptor (one is used after the name in titles and the footer):
1. **Flutter rescue studio** (recommended: names the problem; "studio" is a brand word, the About page
   says who runs it)
2. Flutter upgrades and releases
3. Flutter app care

Tagline options:
1. **Stuck Flutter apps, upgraded and shipped.** (recommended)
2. Read first. Fixed price. Shipped.
3. Your Flutter app, releasing again.

## 6. Voice

**Recommendation: the brand speaks as "Appamania", or with no seller pronoun at all. Never "we".
"I" appears only where Sumit signs his name (About and the contact promise).**

Why: one person runs Appamania. "We" suggests a team, and a CTO finds out otherwise on the first
call. Trust is the product, so that small untruth costs more than it gains. Writing "Appamania
audits..." or plain imperatives ("Send the repo. Get a report in 48 hours.") reads as a brand, with
no claim about headcount. The About page states it plainly: Appamania is founded and run by Sumit
Pal, and he does every audit and sprint himself.

Tone: a senior engineer explaining plainly. Short sentences, numbers over adjectives, the buyer's
problem first and the seller second.

| Do | Do not |
|---|---|
| "Appamania reads the code before it quotes." | "We are a passionate team of experts." |
| "Send the repo. Get a written report in 48 hours." | "Seamless, cutting-edge Flutter solutions." |
| "Fixed price. You own the code." | "Please reach out to discuss your needs." |
| "0 regressions on a two-step SDK upgrade." | "Trusted by leading brands." (no logos exist) |
| "Founded and run by Sumit Pal." | "Our developers", "our team", "we" |
| "Book the audit" / "Start a sprint" / "Read the case study" | "Learn more", "Submit", "Click here" |
| "Udyam-registered. Invoiced in INR." | "Award-winning", "100+ happy clients" |

The banned-word list in `docs/design-brief.md` still applies (passionate, cutting-edge, seamless,
world-class, leverage, solutions, elevate, unleash, empower, supercharge, innovative, please,
successfully, simply).

## 7. Messaging hierarchy

Prices are always rendered with `formatPrice(offers.x)`. They are written out below only so the doc
can be read.

| Page | Headline | Subhead | Proof line | Primary CTA | Secondary |
|---|---|---|---|---|---|
| Home | Stuck Flutter app? [pill] Fixed price, **shipped.** | Appamania takes over live Flutter apps that crash, lag, or sit on an old SDK. A written audit in 48 hours, then a fixed-price sprint to upgrade, fix and release. You own the code. | 6+ yrs production Flutter · 0 regressions, 3.41 → 3.47 · 3 pub.dev packages, 150–160 points · 4 apps on Google Play | Book the ₹2,999 audit | Read the case studies |
| Services | Read first. **Fixed price.** | Every engagement starts with code Appamania has read and ends with a release you can see. | Report in 48 hours or the audit is free. Fee credited to the sprint. | Book the ₹2,999 audit | Plan cards (outline) |
| Work | Real apps, real deadlines. **Anonymised by default.** | Migrations, crash fixes and internal platforms. Clients stay unnamed unless they asked to be named. | Per card: the result title from the case study | Book the audit (CTA band) | Read the case study |
| About | Appamania is run by **Sumit Pal.** | A Flutter engineer in Kolkata with 6+ years of production apps across fintech, e-commerce, telecom and enterprise. He does every audit and sprint himself. | Udyam-registered · pub.dev verified publisher · 4 apps on Google Play | Book the audit | Book a 20-minute call |

## 8. Claims that need owner facts

Each one renders nothing until the owner fills it in. None of them is guessed.

1. A testimonial: the quote, the name, the role, and written permission.
2. One measurable outcome per case study (for example crash-free rate before and after) that the client allows.
3. Install counts per app beyond "50+" for Spend Analytics, taken from the Play Console.
4. Whether the Play apps are free (needed for SoftwareApplication `offers`).
5. The legal business name as it appears on the Udyam certificate, and whether to show the Udyam number.
6. A founder photo for About (real, square, at least 800 px).
7. Availability text ("Taking one sprint from January").
8. The date each case study was published or last updated (for Article and sitemap lastmod).
9. Agency terms: white-label or NDA allowed or not.
10. Whether "one working day" reply time and "USD on request" still hold.
