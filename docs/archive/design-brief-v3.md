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
