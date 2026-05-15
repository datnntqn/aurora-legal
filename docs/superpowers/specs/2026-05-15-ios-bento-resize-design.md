# iOS bento — resize from 2×2-hero to 3+2 mosaic

**Status:** Design approved · ready for implementation
**Date:** 2026-05-15
**Files:** `index.html` (no markup change), `style.css` (grid placement + mockup heights)

---

## Why

After the day→night redesign shipped, the user reported that the "Built into every corner of iOS" section is **too large**. Three causes compound:

1. **Card `bento-1` (Live Activity) spans 2 columns × 2 rows** — that single cell is ~440×440 px on desktop.
2. **`.bento-mockup-lock` has `min-height: 280px`** — sized for the 2×2 hero, makes the card even taller.
3. **The bento spans 3 grid rows total** (cards 4 and 5 sit on row 3) — the section is ~880px tall on desktop.

The day→night color narrative itself is fine and was a core decision in the redesign spec; the user explicitly chose to preserve it. The fix is purely layout.

User picked **option B — 3-then-2 mosaic, day→night kept** (from a 4-option visual comparison).

## What changes

### New layout

3-column × 2-row grid:

```
┌──────────────┬──────────────┬──────────────┐
│ Live Activity│ Focus Filter │ Control Ctr  │
│  (bento-1)   │  (bento-2)   │  (bento-3)   │
├──────────────┴──────────────┼──────────────┤
│   Auto Schedule (bento-4)   │   Siri (5)   │
└─────────────────────────────┴──────────────┘
```

- Row 1: 3 equal cells (cards 1, 2, 3).
- Row 2: Auto Schedule spans 2 columns; Siri sits in the rightmost column.

This keeps the day→night progression (cream top-left → deep-night bottom-right) and introduces just enough asymmetry to avoid a clone-grid feel.

### CSS edits — only in `style.css`

1. **Parent `.bento` at ≥1100px** — remove the `grid-template-columns: repeat(4, 1fr)` override (currently `style.css` lines 780–782). Stay at 3 columns on every screen ≥768px.

2. **`.bento-card.bento-N` placements** — currently at `style.css` lines 1259–1265, replace with:

   ```css
   @media (min-width: 768px) {
     .bento-card.bento-1 { grid-column: 1; grid-row: 1; }
     .bento-card.bento-2 { grid-column: 2; grid-row: 1; }
     .bento-card.bento-3 { grid-column: 3; grid-row: 1; }
     .bento-card.bento-4 { grid-column: 1 / span 2; grid-row: 2; }
     .bento-card.bento-5 { grid-column: 3; grid-row: 2; }
   }
   ```

3. **`.bento-mockup-lock` height** — `style.css` line 850, change `min-height: 280px` to `min-height: 160px`. The lockscreen mockup no longer needs the tall canvas it had when bento-1 was a 2×2 hero card.

4. **`.bento-card.bento-1 .bento-h` (the headline "Live Activity")** — currently sized for the hero card (~1.6rem via the parent `.bento-card.big` rule from Chunk 1, or whatever it inherited). The bento-1 card is now the same size as the others; the headline should match. **Audit during implementation**: if the heading is visibly larger on bento-1 than on the other cards, add `.bento-card.bento-1 .bento-h { font-size: inherit; }` (or match the other cards' size directly).

### Markup — unchanged

The `<article class="bento-card bento-N">` markup stays as-is. All inner mockup elements (Dynamic Island, Focus row, CC grid, clock, Siri orb) remain. Only the parent grid resizes them.

## Verification

After implementation, open `index.html` at desktop width (~1280px) and confirm:

- The iOS section's total height is approximately **~520px** (down from ~880px).
- 5 cards arranged in 2 rows: 3 cards on top, 2 cards (one wider) on bottom.
- Day→night colors still progress cream → deep-night reading left-to-right, top-to-bottom.
- The Auto Schedule card (the wider one in row 2) still shows its clock mockup centered.
- The Live Activity card's lockscreen mockup fits cleanly in the smaller cell without scroll/overflow.
- At 1280px+ widths, the section still uses 3 columns (no 4-column reflow).
- At tablet (≤768px), all 5 cards stack into a single column in DOM order — day→night still reads top-to-bottom.

## Out of scope

- No content edits (headlines, taglines, copy unchanged).
- No icon swaps — moon-1…moon-5 stay.
- No new sections, no removed sections.
- Lighthouse contrast verification still applies but is unchanged from the previous spec.
