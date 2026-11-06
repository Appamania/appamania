# Design brief — Appamania (Chai Studio)

Tokens and components come from the Chai Studio design system
(https://claude.ai/artifact/CYSyudfHkf3RWWcTHKfS4w). Page composition comes from the screens
canvas (https://claude.ai/artifact/4v4M4LY9RLzpDxYGkjRmEZ). This brief is the taste. Where the
canvas and this file disagree, this file wins.

## What the site is
A Flutter freelance business: fixed-price offers (`config/offers.ts`), case studies, Play apps,
pub.dev packages, and an intake form. Udyam-registered, Kolkata. Hosted on Firebase App Hosting.

## Art direction
- **Mood:** a careful senior engineer you would trust with your codebase. Not an agency, not a
  dev-tool startup.
- **The idea:** the audit report is the hero. Show the thing the client buys (a sample App Health
  Audit with scores and a top fix) instead of a picture. Every later section is a claim with proof.
- **Site = Night:** near-black paper, Android-green brand, one saffron spark per section.
- **Admin:** same tokens, Night, compact and table-first.
- **Dials:** site — layout variance 7/10, motion 5/10, density 3/10. Admin — variance 2/10,
  motion 1/10, density 7/10.

## Typography
- Geist for all text, Geist Mono for eyebrows, badges, prices, code and table numbers.
- Home hero: `display-2xl`, tight −5.5% tracking; one inline colour pill (green + saffron dots)
  may sit inside the headline. Never more than 3 lines at 390 px; cut copy before shrinking type.
- Sentence case everywhere, offer names included; uppercase only in the mono `label` style.
- `tabular-nums` on every number that can change. Prices in Geist Mono.

## Layout
- 12-column grid, max 1200 px; hero padding `space-24`; `space-16` between sections desktop,
  `space-12` mobile; single column under 768 px.
- Section headers: numbered mono eyebrow ("02 — Plans") + heading, optional right-aligned muted
  note.
- Home rhythm: hero (copy left, two tilted phones right with two floating cards) → tech marquee →
  bento → three plan cards (middle featured with `shadow-glow`) → case-study cards → case panel
  with a giant number → FAQ (`<details>`) → full-green CTA band → footer with outlined giant
  wordmark.
- Services: hero with the one primary button → plan cards with includes → 4 steps → FAQ → CTA.
- Bento: asymmetric spans (c3 r2 + c3 + c3 / c2 c2 c2). Never a row of three identical feature
  cards with icons in circles.
- Admin: table list with search, then the form with a sticky save bar and a live card preview.

## Shape and depth
- Pill buttons, chips, nav. `radius-lg` 28 px bento tiles and plan cards; `radius-xl` 40 px case
  and CTA panels; `radius-sm` 12 px inputs; `radius-md` 20 px app icons.
- Borders over shadows. One soft green radial glow behind hero and case panel only.
- Glass blur only on the floating pill nav and floating cards.
- Night uses `shadow-glow` once per page (the featured plan card).

## Motion
- CSS only. Transform and opacity only. Everything static under `prefers-reduced-motion`.
- Hover, 150–200 ms ease-out: button arrow nudge, card lift (−2 px), border to `line-strong`.
- `.enter`: one entrance on first paint for the hero copy and phones (`@starting-style`).
- `.reveal`: scroll-driven fade-up on cards, tiles, panels and section headers
  (`animation-timeline: view()`). Browsers without it render the final state. No JS listeners.
- Tech marquee: CSS transform loop, pauses on hover/focus, static under reduced motion,
  duplicate set `aria-hidden`.
- Forbidden: scroll-jacking, parallax, kinetic split-letter headlines, scroll listeners,
  animation libraries, autoplay video with sound.

## Imagery
- Real UI in CSS phone frames (sample audit, sprint checklist).
- Uploaded media comes from Firebase Storage through `/admin` only: case-study cover (16:10) or
  mp4, app icon (square), app screenshots (9:19.5). Sized `next/image`, never a bare `<img>` on
  the site.
- No stock photos, AI people, 3D, blobs, gradient washes across sections, emoji.
- Icons: Lucide outline, 1.75 stroke, 20 px default.

## Copy
- Voice: a senior engineer explaining plainly. Short sentences. Numbers over adjectives
  ("48 hours", "0 regressions", "₹2,999").
- Say: fixed price, you own the code, written report, shipped.
- Never: passionate, cutting-edge, seamless, world-class, leverage, solutions, elevate, unleash,
  empower, supercharge, innovative. No "please", "successfully", "simply".
- Prices exactly from `config/offers.ts`. INR; "USD on request" as one line, never a second list.
- Proof: only real numbers and real quotes. pub.dev points, likes and downloads are live. Anonymise
  clients ("Enterprise · migration") unless named with permission. No invented badges
  ("Most booked"). Missing facts stay as visible `[PLACEHOLDER]` markers.
- Buttons are verb-first: "Book the audit", "Start a sprint", "Add new", "Save".
- One light line per page is allowed ("fuelled by chai" in the footer).

## Interaction quality
- Keyboard complete; visible `focus` ring (2 px, 2 px offset) on every control. Horizontal strips
  are focusable regions.
- Targets ≥ 44 px on touch. Buttons are `<button>`, links are `<a>`. Native `<dialog>` for
  confirms, never `confirm()`.
- Forms: label above, error below with `aria-describedby`, validate on blur and submit, keep input
  on error, pending state on submit, correct `autocomplete`, `type`, `inputmode`.
- URL holds state: `?offer=` on contact, `?tab=` and `?id=` in admin.
- Unsaved edits block navigation in admin. Save with `Cmd+S`.
- Skeletons match final layout; empty states name the space and offer one action; errors say what
  happened and what to do.
- Safe-area insets on the sticky nav and the admin save bar.
- No layout shift: sized images and video, `next/font`.
- Contrast: text 4.5:1, large text and control borders 3:1. Saffron never carries text on paper.
