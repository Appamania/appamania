# Design brief — Appamania (Chai Studio)

Read with PRD Part II (§6–§8). Tokens and components come from the Chai Studio design system
(https://claude.ai/artifact/CYSyudfHkf3RWWcTHKfS4w). Page composition comes from the screens
canvas (https://claude.ai/artifact/4v4M4LY9RLzpDxYGkjRmEZ). This brief is the taste.

## Art direction
- **Mood:** a careful senior engineer you would trust with your codebase. Not an agency, not a
  dev-tool startup.
- **The idea:** the audit report is the hero. Show the thing the client buys (a sample App Health
  Audit with scores and a top fix) instead of a picture. Every later section is a claim with proof.
- **Site = Night:** near-black paper, Android-green brand, one saffron spark per section.
- **Portal/admin:** same tokens, Light/Dark toggle, compact and table-first.
- **Dials:** site — layout variance 7/10, motion 3/10, density 3/10. Portal/admin — variance
  2/10, motion 1/10, density 7/10.

## Typography
- Geist for all text, Geist Mono for eyebrows, badges, prices, code and table numbers.
- Home hero: `display-2xl`, tight −5.5% tracking; one inline colour pill (green + saffron dots)
  may sit inside the headline. Never more than 3 lines at 390 px; cut copy before shrinking type.
- Sentence case everywhere; uppercase only in the mono `label` style.
- `tabular-nums` on every number that can change.

## Layout
- 12-column grid, max 1200 px; hero padding `space-24`; `space-16` between sections desktop,
  `space-12` mobile; single column under 768 px.
- Section headers: numbered mono eyebrow ("01 — Why teams hire me") + `h1`, optional right-aligned
  muted note.
- Home rhythm: hero (copy left, two tilted phones right with two floating cards) → tech marquee →
  bento → three plan cards (middle featured with `shadow-glow`) → case panel with a giant number →
  4-step process → quotes → FAQ (`<details>`) → full-green CTA band → footer with outlined giant
  wordmark.
- Bento: asymmetric spans (c3 r2 + c3 + c3 / c2 c2 c2). Never a row of three identical feature
  cards with icons in circles.

## Shape and depth
- Pill buttons, chips, nav. `radius-lg` 28 px bento tiles and plan cards; `radius-xl` 40 px case
  and CTA panels; `radius-sm` 12 px inputs.
- Borders over shadows. One soft green radial glow behind hero and case panel only.
- Glass blur only on the floating pill nav and floating cards.
- Light theme may use `shadow-hard` (max two per page); Night uses `shadow-glow` (one per page).

## Motion
- 150–200 ms ease-out on hover only: button arrow nudge, card lift (−2 px).
- Tech marquee: CSS transform loop, pauses on hover/focus, static under reduced motion,
  duplicate set `aria-hidden`.
- Forbidden: scroll-jacking, parallax, kinetic split-letter headlines, scroll listeners,
  animation libraries.

## Imagery
- Real UI in CSS phone frames (sample audit, sprint checklist, real app screenshots via Cloudinary).
- No stock photos, AI people, 3D, blobs, gradient washes across sections, emoji.
- Icons: Lucide outline, 1.75 stroke, 20 px default.

## Copy
- Voice: a senior engineer explaining plainly. Short sentences. Numbers over adjectives
  ("48 hours", "zero regressions", "₹2,999").
- Say: fixed price, you own the code, written report, shipped.
- Never: passionate, cutting-edge, seamless, world-class, leverage, solutions, elevate, unleash,
  empower, supercharge, innovative.
- Prices exactly from `config/offers.ts`. INR; USD on request.
- One light line per page is allowed ("fuelled by chai" in the footer).
- Proof: only real numbers and real quotes. Anonymise clients ("Enterprise · migration") unless
  named with permission. Missing facts stay as visible `[PLACEHOLDER]` markers that CI lists.

## Interaction quality
- Keyboard complete; visible `focus` ring (2 px, 2 px offset) on every control.
- Targets ≥ 44 px on touch. Buttons are `<button>`, links are `<a>`.
- Forms: label above, error below with `aria-describedby`, validate on blur and submit, keep input
  on error, pending state on submit, correct `autocomplete`, `type`, `inputmode`.
- URL holds list state (filters, tabs) so back/forward and sharing work.
- Skeletons match final layout; empty states name the space and offer one action; errors say what
  happened and what to do.
- Portal theme toggle without flash; `<meta name="theme-color">` per theme.
- Safe-area insets on the sticky nav and the mobile bottom tab bar.
- No layout shift: sized images, `next/font`.
- Accessibility contrast: text 4.5:1, large text and control borders 3:1, in all three themes.
  Saffron never carries text on paper.
