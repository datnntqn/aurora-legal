# Aurora UI redesign — surgical fix for AI-design anti-patterns

**Status:** Design approved · ready for implementation plan
**Date:** 2026-05-15
**Files:** `index.html`, `style.css`, `script.js`, `assets/icons/moon-*.svg` (new)
**Reference:** `aurora_redesigned_sections.html` (partial redesign, used as aesthetic anchor)

---

## Why this redesign

Feedback identified the current `index.html` as suffering from 6 specific AI-design anti-patterns:

1. **Every headline reuses the same purple→teal gradient-on-one-word trick.** Loses emphasis through repetition. Words gradient'd: `comfortable`, `exactly`, `every`, `actually`, `once`, `forever`.
2. **5 section eyebrows use one identical template** — small all-caps, muted purple, centered, above each headline. (`DRAG TO REVEAL`, `ONLY ON AURORA`, `EYE-CARE TOOLKIT`, `PRICING`, `FAQ`.)
3. **4 eye-care cards are clones.** Same size, padding, icon style, line count. Reads "AI balanced grid", not designed hierarchy.
4. **Pricing is the most-common AI template:** single centered card, badge, big price, checklist, CTA.
5. **Icons are default Lucide set** (eye, image, palette, list-checks, pulse, target, sliders-horizontal, clock, microphone). Zero custom identity.
6. **iOS bento card colors are "safe, random pretty"** — purple / red / teal chosen because they contrast on dark, not because they tell a story.

The redesign fixes each of these without changing the underlying aesthetic, typefaces, or product copy meaningfully. Same dark Syne + DM Sans direction as `aurora_redesigned_sections.html`.

## What's NOT changing

- Color tokens: `--bg #08080E`, `--bg2 #0F0F1A`, `--bg3 #141424`, `--accent #8B7CF8`, `--accent2 #4FC3C8`, `--text #F0EFF8`, `--muted #7A7990`.
- Typefaces: Syne (display) + DM Sans (body).
- Existing interactive features: drag-to-reveal compare slider, theme-stack hover, tilt cards, magnetic hover on CTAs, scroll-reveal, parallax hero.
- The 5 iOS bento features themselves (Live Activity, Focus Filter, Control Center, Auto Schedule, Siri & Shortcuts).
- App Store badge as the primary CTA.

## Page structure (8 sections, down from 9)

| # | Section | Status |
|---|---|---|
| 01 | Nav | unchanged |
| 02 | Hero | modified eyebrow + headline + visual |
| 03 | **Manifesto strip** | **NEW** |
| 04 | Compare slider | unchanged interaction, new eyebrow |
| 05 | Made for iOS (bento) | new color story + new icons |
| 06 | Eye-care toolkit | grid restructured |
| 07 | Pricing + FAQ | merged + reworked |
| 08 | **Founder quote + Footer** | **REWORKED** — replaces generic footer |

**Dropped:** Marquee (`<section class="marquee-section">`). Logo-soup marquees are themselves an AI-favorite trope; dropping it serves the feedback even though feedback didn't name it.

## Section-by-section design

### 02 — Hero (modified)

**Eyebrow:** Existing dot-badge "Now on the App Store" — kept. Not a new element.

**Headline:** `Your web, made comfortable.` with **only `comfortable`** rendered in the purple→teal→pink gradient. This is the **only** gradient word in the entire page. Per the reference file rule (line 82–87 of `aurora_redesigned_sections.html`).

**Sub:** Unchanged from current copy.

**Visual:** Replace the cycling 3-state iPhone mockup with the **stacked tilted theme-card visual** from `aurora_redesigned_sections.html` lines 444–483 — Dark Blue / Sepia / Forest cards rotating into a stack. Reasons:
- The iPhone mockup is dominant on the existing page; replacing it with the theme stack makes the hero feel custom-laid-out rather than generic.
- Hover effect already prototyped (`aurora_redesigned_sections.html` lines 172–174).

**CTAs:** App Store badge + "See it in action ↓" — unchanged.

**Stats row:** Keep current 3 stats but with the reference file's labels: `7 iOS integrations`, `$5.99 once, forever`, `Zero trackers · ever, on any device`.

### 03 — Manifesto strip (NEW)

A short visual beat between hero and the compare slider. Three short refusal statements, side-by-side, full-page-width.

**Layout:** 3-column grid, no eyebrow, no headline above them. Each cell is a single bold statement.

```
NO SUBSCRIPTION.    NO TRACKING.        NO CARD
EVER.               EVER.               FOR THE TRIAL.
```

**Typography:** Syne, weight 700, size `clamp(1.25rem, 2.2vw, 1.75rem)`, color `--text`, letter-spacing -0.01em.
**Numbering:** Tiny `01 / 02 / 03` in `--muted` above each statement, set in Syne weight 600 at `0.7rem`. **This is the only place numbered eyebrows appear** — keeps that device from also becoming a template.
**Background:** Section gets a subtle vertical divider line between each column. No card frames.
**Spacing:** `6rem 3rem` top/bottom padding, generous breathing room. Top and bottom hairline borders (`1px solid var(--border)`) make it feel like a printed page section.

### 04 — Compare slider (unchanged interaction)

**Eyebrow:** **A question, not a label.**

> *What does Aurora actually change?*

Set in Syne weight 500, size `1rem`, color `--muted`, italic, **left-aligned** (not centered). No all-caps. This breaks the eyebrow template most loudly because it's literally a sentence, not a label.

**Headline:** `See exactly what changes.` — no gradient word.
**Sub:** Existing copy.
**Interaction:** Existing drag slider, no changes.

### 05 — Made for iOS bento (new color story + new icons)

**Eyebrow:** **A short sentence, not a label.**

> Five integrations no other Safari app ships.

Set as a flowing line, left-aligned, color `--muted`, weight 400. No all-caps. Two-line sentence treatment.

**Headline:** `Built into every corner of iOS.` (no gradient word, no italic on `every`).

**Bento grid:** 5 cards. Big card spans 2 columns × 1 row, others in remaining grid cells (preserve current asymmetric bento from `index.html` lines 239–361).

#### Day → night color story

Card backgrounds progress chronologically from cream/dawn at the top-left big card to deep-night at the bottom-right card. Each card gets a single linear gradient:

| Card | Feature | Gradient (135deg) | Text color |
|---|---|---|---|
| 1 (big) | Live Activity | `#F5E6CC → #E8C68A` (cream/dawn) | `#1A1A2A` (dark) |
| 2 | Focus Filter | `#C4A0A8 → #6D5A8E` (dusk-mauve) | `#1A1A2A` (dark) |
| 3 | Control Center | `#5D5680 → #3A2F4F` (dusk) | `#F0EFF8` (light) |
| 4 | Auto Schedule | `#1F1A35 → #0F1422` (late night) | `#F0EFF8` (light) |
| 5 | Siri & Shortcuts | `#0A0E1A → #050610` (deep night) | `#F0EFF8` (light) |

Light/dark text flip happens at card 3 (dusk). This is the visual narrative — the page literally walks the reader from day to night across the bento, demonstrating what Aurora does.

#### Moon-derived custom symbol set

5 hand-designed SVG marks at `assets/icons/moon-1.svg` … `moon-5.svg`. Each is a 24×24 circle in a different state:

| File | Card | Mark |
|---|---|---|
| `moon-1.svg` | Live Activity | Full circle with a single emphasized pulse dot at the right edge |
| `moon-2.svg` | Focus Filter | Outlined circle with a smaller concentric target ring + center dot |
| `moon-3.svg` | Control Center | Half-filled circle (left half solid, right half outline) — the "switch" |
| `moon-4.svg` | Auto Schedule | Outlined circle with a single radius tick at 5 o'clock (clock hand) |
| `moon-5.svg` | Siri & Shortcuts | Outlined circle with a 90° sound-wave arc rendered outside it |

**Styling:** Single-color SVG using `currentColor`. Stroke width 1.5. Size 28×28 rendered. Container: a 40×40 rounded rect (radius 10), translucent border, same `currentColor` semantics so each card's text color drives the icon color.

**Existing Lucide icons** (`pulse.svg`, `target.svg`, `sliders-horizontal.svg`, `clock.svg`, `microphone.svg`) stay in the assets folder but are **no longer referenced** from the iOS section. They remain for any other usage (footer, etc.) until proven unused.

#### Mini-mockups inside each card

Existing bento mockups (Dynamic Island pill, Focus toggle row, Control Center tile, clock face, Siri orb + quote) are kept structurally but **restyled to read against the new card background colors**. Specifically:
- Card 1 (cream): mockup chrome flips to dark glass — black Dynamic Island stays black; lockscreen background uses `#08080E` for contrast.
- Card 2 (dusk-mauve): Focus row uses `rgba(255,255,255,0.06)` backgrounds.
- Card 3 (dusk): existing CC grid colors work as-is.
- Cards 4–5: existing dark mockup chrome unchanged.

### 06 — Eye-care toolkit (grid restructured)

**Eyebrow:** **Left-edge section marker, not a top label.**

A thin vertical line + section number sits to the left of the headline:

```
04 │  Reading at 2am, made actually easy.
   │  Aurora is more than a flat black-and-white swap.
```

Marker: `§04` in Syne weight 700, size `0.7rem`, color `--accent2`. Thin 1px vertical rule, height ~`2.5rem`, in `rgba(255,255,255,0.15)`. Headline left-aligned (not centered), `actually` is **not** italic/gradient'd — kept plain.

**Grid:** Hero feature + 3 supporting cards.

```
┌──────────────────────────┬──────────────┐
│                          │ Image Dimming│
│  Blue Light Filter       ├──────────────┤
│  (interactive slider     │ Themes       │
│  drag demo)              ├──────────────┤
│                          │ Per-Site     │
└──────────────────────────┴──────────────┘
```

**BLF hero card (`grid-column: 1/3, grid-row: 1/4`):**
- Background: `linear-gradient(135deg, #0F0F1A, #141428)` — same as reference file `.feat-card.big`.
- Decorative radial glow top-right (per reference file lines 219–225).
- Headline: `Blue Light Filter` in Syne 700, size 1.75rem.
- Copy: "Up to 100% reduction. Drag the slider to feel the difference — most dark mode apps skip this entirely."
- **Interactive demo** (port from `aurora_redesigned_sections.html` lines 502–514, 652–671): article-line mockup that warms toward amber as the slider moves right. Slider, %label, JS handler.

**3 supporting cards (right column, stacked):**

Each is small (`padding: 1.25rem`), `--bg2` background, `--border` outline. **No icons** — replaced with tiny visual cues:

1. **Image Dimming** — visual cue: a horizontal swatch row, 6 cells, going from bright `#E0E0E0` to dim `#404040` left-to-right. Title + 1-line caption.
2. **Unlimited Themes** — visual cue: 5 small circles (8px) in different theme colors lined up. Title + 1-line caption.
3. **Per-Site Rules** — visual cue: 3-row mini-list with `wikipedia.org · ON`, `youtube.com · ON`, `news.ycombinator.com · OFF` in mono font (DM Mono fallback to Menlo). Title + 1-line caption.

This breaks the 4-card clone by giving BLF visual dominance and giving each supporting card a feature-specific visual instead of a generic icon.

### 07 — Pricing + FAQ (merged + reworked)

**Eyebrow:** **None.** Just the price treatment.

**Pricing block:**

```
$5.99 once.
~~$29.99/yr~~  …what subscription apps charge for less.

No subscription · 3-day free trial · No card needed.

[App Store badge]
```

**Layout:** Centered column, ~600px max-width. No card frame, no border.
- `$5.99` set in Syne 800, size `clamp(3rem, 7vw, 5rem)`, line-height 1.
- `once.` set inline next to it in DM Sans 400, size `1.4rem`, color `--muted`.
- Comparison line below, smaller (~`1.2rem`), strikethrough on the price, dimmed text after.
- Then a thin hairline divider.
- Caption row with the three guarantees.
- App Store badge sits below, larger than current implementation.

**FAQ block (merged into same section, below pricing):**

A small `Still wondering?` heading (Syne 600, size `1rem`, color `--muted`), followed by 3 expanding `<details>` items. **Only 3, not 6** — picked for highest signal:

1. **What's the refund policy?**
2. **Is there a Mac version?**
3. **How is Aurora different from Noir or Dark Reader?**

(The other 3 current FAQ items — "Does Aurora collect any data?", "Will it slow down Safari?", "Does it work with other extensions?" — move to the Support page or get dropped. They're covered by other parts of the page or the privacy policy link.)

Details items styled minimally: no card, no rounded panels — just hairline rule between each.

### 08 — Founder quote + Footer (reworked)

Replaces the existing generic footer brand-block.

**Top half — founder quote:**

> "I built Aurora because I read a lot at night and nothing worked the way I wanted. **If you have feedback, just email me — I read everything.** Every update comes from real users, not a product roadmap."
>
> — Danny, maker of Aurora

Styled per `aurora_redesigned_sections.html` lines 362–393: italic body, the bold inline sentence non-italic, small avatar circle (gradient initial "D"), name + handle stacked, email chip on the right side (`✉ support@aurora.app` or whatever the canonical email is).

**Bottom half — minimal footer:**

A single horizontal line, hairline border above:
- Left: `© 2026 Aurora · Made for iOS`
- Right: 3 inline links — Privacy · Terms · Support

No brand logo, no separate brand block.

## Anti-pattern audit (verification that each is addressed)

| Anti-pattern | Fix in this design |
|---|---|
| 1. Gradient word on every headline | Only `comfortable` in the hero gets the gradient. Every other headline is plain. |
| 2. 5 identical purple all-caps eyebrows | Each section uses a different intro device: dot-badge, none (manifesto), question, sentence, left-edge marker, none, name. No two sections introduce themselves the same way. |
| 3. 4-card clone grid | BLF gets a tall hero card with live demo; the other 3 are short stacked cards with feature-specific visual cues instead of icons. |
| 4. Standard pricing template | No card, no badge, no checklist. Two prices typeset large with a strikethrough comparison; FAQ merged in below as plain `<details>`. |
| 5. Default Lucide icons | 5 custom moon-state SVGs in iOS section; eye-care section drops icons entirely. Existing Lucide files retained in `assets/icons/` only until proven unused. |
| 6. "Safe pretty" iOS card colors | 5 cards walk day → night in 5 ordered gradient stops. The color progression IS the narrative; cards are no longer differentiated by random hues. |

## Responsive behavior

- **Hero**: 2-col on ≥900px, stacks to 1-col below. Theme card stack scales down to ~240px width on mobile, removes hover-spread interaction.
- **Manifesto strip**: 3-col on ≥720px, stacks to 1-col with each statement on its own line on mobile. Numbering stays.
- **iOS bento**: same responsive pattern as existing bento (mobile collapses to single column, color progression preserves card order top-to-bottom).
- **Eye-care grid**: BLF hero stacks above the 3 supporting cards on <900px; supporting cards become a horizontal row on tablet and a single column on mobile.
- **Pricing**: price typography uses `clamp()` for fluid sizing; comparison line wraps below the main number on narrow screens.
- **Founder section**: flex-wrap on mobile, quote stacks above the email chip.

## Implementation files

| File | Action |
|---|---|
| `index.html` | Restructure: drop marquee, add manifesto, replace founder section, modify all section eyebrows, change hero visual, restructure eye-care grid, simplify pricing+FAQ |
| `style.css` | Add new section styles: `.manifesto`, `.section-marker`, `.eyebrow-question`, `.eyebrow-sentence`, `.pricing-numeric`, `.founder-block`, new bento color tokens, eye-care hero-supporting grid, theme stack from reference file, BLF demo styles |
| `script.js` | Port BLF slider live-demo handler from `aurora_redesigned_sections.html`. Existing scripts unchanged. |
| `assets/icons/moon-1.svg` ... `moon-5.svg` | NEW — 5 hand-designed circle-state marks |
| `assets/icons/pulse.svg`, `target.svg`, `sliders-horizontal.svg`, `clock.svg`, `microphone.svg` | Unchanged on disk; references removed from `index.html` |

## Verification plan

Before declaring complete:

1. **Visual diff** — open `index.html` in browser at desktop, tablet, and mobile widths. Confirm 6 anti-patterns are gone (run through the audit table above and verify each).
2. **Functional check** — drag the compare slider, drag the BLF slider, hover the theme-stack, expand each FAQ item, hover each bento card. All existing interactions still work.
3. **Read top-to-bottom** — confirm the day → night color story reads as intentional (cream → night across the iOS bento) and the gradient word `comfortable` is the only one on the page.
4. **No regressions** — nav sticky behavior, scroll engine, magnetic hover, parallax hero all functional. `script.js` existing behavior unchanged.

## Out of scope

- Brand identity / new logo / new typeface pairing.
- New product copy outside of the manifesto + section eyebrows specified here.
- Privacy/Terms/Support page updates.
- Light theme of the marketing site.
- A/B testing infrastructure.
- Analytics changes (the privacy claim "Zero trackers" stays true).

## Open questions

None. All decisions captured.
