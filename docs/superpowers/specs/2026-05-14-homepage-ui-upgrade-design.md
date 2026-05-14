# Aurora Homepage UI Upgrade — Design

**Date:** 2026-05-14
**Status:** Approved (brainstorming complete)
**Scope:** `index.html`, `style.css`, `script.js` in the `safari-legal` repo

## Context

`safari-legal` is the marketing + legal site for the Aurora iOS app, deployed on
GitHub Pages. The homepage (`index.html`) was already redesigned once
(commit `4e6cdcd`) and is functionally identical to the live `aurora-legal`
reference. The goal of this work is **not** a restructure — it is to push the
existing design further: more motion, more visual depth, and a better icon
treatment, while staying on the current zero-build GitHub Pages workflow.

The codebase already has a solid vanilla motion system in `script.js`:
`data-reveal` scroll-reveal with stagger, `data-tilt` 3D cards, `data-magnetic`
buttons, hero state auto-cycle, drag compare slider with auto-demo, count-up
stats, and smooth-scroll — all gated behind a `prefersReducedMotion` check.
`style.css` is organized into numbered sections with color tokens, but still
carries dead CSS from the pre-redesign version.

## Goals

- Level up **motion & interactivity**, **visual richness & depth**, and
  **iconography** — the three areas the user prioritized.
- Keep all 8 existing sections and their order unchanged (no new sections,
  no storytelling restructure).
- Stay 100% vanilla: 3 files, no build step, no dependencies. Deploy stays
  "edit → push → GitHub Pages serves it."
- Every new effect degrades cleanly under `prefers-reduced-motion` and stays
  performant on mobile.

## Non-Goals

- No new sections, no reordering, no copy rewrite.
- No framework, bundler, or CDN library.
- No change to the brand app icon (`assets/aurora-icon*.png`) — this work only
  touches the ~13 inline feature/section icons.
- No changes to `privacy.html` / `terms.html` / `support.html` beyond what the
  shared `style.css` cleanup necessitates.

## Approach

Approach **B — Signature moments**: a consistent polish baseline across the whole
page, plus concentrated effort on three showstopper interactions. Chosen over a
uniform polish pass (no standout moment) and a maximalist pass (clutter + perf
risk on a marketing page).

## Section 1 — The Three Signature Moments

### 1.1 Living hero

The hero (`#hero.hero-v2`) currently cycles the phone screen and tilts on cursor,
and already has static `.hero-mesh`, `.hero-grain`, and `.hero-glow` elements.
Enhance those existing elements:

- The `.hero-mesh` background gains a slow-drifting animated aurora **gradient
  mesh**.
- **Parallax layers** — mesh, grain (`.hero-grain`), and glow (`.hero-glow`) each
  move at different speeds driven by scroll progress.
- The phone (`[data-hero-phone]`) gently **floats with scroll progress** in
  addition to its existing cursor tilt.
- Refined staggered word-entrance on the headline (`.hero-title-v2 .word`).

### 1.2 Scroll-scrubbed comparison

The compare slider (`#compare`) currently auto-sweeps once on reveal. Upgrade so
that **scroll progress through the `#features` section drives the divider
position** — scrolling literally wipes the page from light to dark. Scroll
window: the divider sits fully left (all-light) when the section's top reaches
the viewport bottom, and fully right (all-dark) by the time the section is
vertically centered in the viewport; it holds at all-dark as the section
scrolls out. The existing drag + click-to-jump interactions remain fully
functional; scroll-scrub and drag coexist (user drag takes over while the
pointer is captured, scroll-scrub resumes once released).

### 1.3 Animated bento mockups

The bento cards (`.bento-card`) already tilt on cursor. Add **scroll-triggered,
staggered animations inside each card's mockup**:

- Live Activity pill slides into the Dynamic Island (`.bento-island`).
- Control Center tile lights up (`.bento-cc-aurora`).
- Schedule clock hand sweeps sunset→night (`.bento-clock`).
- Siri orb pulses to life (`.bento-siri-orb`).

This section is also where the new frosted-glass icon tiles (Section 2) debut.

## Section 2 — Baseline Polish

Applied consistently across all sections:

- **Frosted-glass icon tiles.** Every feature/section icon gets a rounded glass
  tile with a colored glow behind it (frosted-glass treatment, "option B" from
  brainstorming). This unifies two inconsistent treatments today: bento cards
  use bare `.bento-icon-svg`; the eye-care section uses gradient blobs
  (`.eye-gradient` etc.). One system everywhere — bento, eye-care, footer.
- **Depth & surface refinement.** Softer multi-stop gradients, consistent glow
  color per section accent, subtle inner highlights, longer ambient shadows on
  cards, faint grain over dark sections.
- **Motion polish on existing interactions.** Keep `data-reveal`, `data-tilt`,
  `data-magnetic`, count-up — refine easing curves, add a touch more reveal
  travel, add hover states (bento cards, FAQ items, nav links) and a subtle
  press state on buttons. Marquee gets an edge fade.
- **Type & rhythm.** Tighten heading hierarchy, use gradient-text accents
  consistently, slightly more generous section spacing.

## Section 3 — Technical Structure

- **File structure unchanged.** Three files — `index.html`, `style.css`,
  `script.js`. New CSS follows the existing numbered-section convention; new JS
  joins the existing IIFE in `script.js`.
- **Dead CSS cleanup.** Remove pre-redesign selectors no longer referenced by
  any of the four HTML files. The grep pass (below) defines the true scope; the
  following is the illustrative starting list of confirmed-dead selectors:
  `.hero-orb`, `.hero-phone-stack`, `.trust-strip`, `.ios-feat*`, `.iphone` and
  its mockup subtree (`.demo-phone-wrap`, `.demo-banner`, `.safari-bar`,
  `.url-pill`, `.safari-content`), `.phone-mini`, and the unused `.wiki-*`
  selectors (`.wiki-title`, `.wiki-sub`, `.wiki-infobox`, `.wiki-img-*`,
  `.wiki-table`, `.wiki-toc`, etc.).
  **Keep — do NOT remove:** `.wiki-link` is used ~9 times across `privacy.html`,
  `terms.html`, and `support.html` for styled inline links; keep `.wiki-link-red`
  and the `.iphone.dark` variants as its companion styling. The `.wiki-*` block
  is *not* removable as a whole.
  Each candidate selector is grepped across all four HTML files before deletion
  to confirm it is unused; the grep result — not this list — is authoritative.
- **Scroll effects — vanilla, no CDN.** A single rAF-throttled, `passive` scroll
  handler computes scroll progress and feeds both the living-hero parallax and
  the comparison scrub. CSS `animation-timeline: view()` is used as a
  progressive enhancement where supported, with the JS handler as the reliable
  baseline (Safari iOS scroll-driven CSS support is still spotty).
- **Reduced motion & performance.** Every new effect is gated behind the
  existing `prefersReducedMotion` JS check *and* a
  `@media (prefers-reduced-motion: reduce)` CSS block with static fallbacks.
  Animate only `transform`/`opacity`; cap stacked `blur`/`backdrop-filter`
  layers; keep listeners `passive` + rAF-throttled; keep effects
  `IntersectionObserver`-gated so off-screen sections cost nothing.

## Section 4 — Verification

- **Visual pass — desktop + mobile.** Run `python3 -m http.server`, walk every
  section at desktop and phone widths. Confirm the three signature moments
  behave (hero parallax tracks scroll; comparison scrubs *and* still drags;
  bento mockups play on reveal), glass icon tiles render consistently, nothing
  overflows or jumps on mobile. Capture before/after screenshots at both widths
  via Playwright (webapp-testing skill).
- **Reduced-motion pass.** Toggle `prefers-reduced-motion: reduce`; confirm every
  new effect falls back to a clean static state.
- **Regression checks.** Open `privacy.html`, `terms.html`, `support.html` to
  confirm shared `style.css` changes (especially dead-CSS removal) didn't break
  them. Watch the console for errors.
- **Performance sanity.** Scroll the full page watching for jank on a throttled
  mobile profile; confirm the scroll handler stays smooth and blur layers don't
  tank it.

## Risks & Mitigations

- **Scroll-scrub vs. drag conflict** on the compare slider — mitigate by letting
  user drag take priority and resuming scroll-scrub only when the pointer is not
  captured.
- **Blur/backdrop-filter perf on mobile** — mitigate by capping how many blur
  layers stack at once and keeping effects IntersectionObserver-gated.
- **Dead-CSS removal breaking another page** — mitigate by grep-verifying each
  selector across all four HTML files before deletion, plus the regression pass.
