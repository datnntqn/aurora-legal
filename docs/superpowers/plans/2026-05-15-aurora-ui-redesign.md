# Aurora UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the surgical-fix UI redesign specified in `docs/superpowers/specs/2026-05-15-aurora-ui-redesign-design.md` — fix the 6 AI-design anti-patterns in `index.html` without changing the existing aesthetic anchors (dark, Syne + DM Sans, `--accent` purple, `--accent2` teal).

**Architecture:** Pure HTML/CSS/JS marketing site. No build step. Three runtime files: `index.html` (markup), `style.css` (~43 KB existing — adding + removing rules in place), `script.js` (deleting two handlers + porting the BLF slider handler from the reference file). Five new SVG icon files in `assets/icons/`. No framework, no bundler, no tests beyond manual browser verification.

**Tech Stack:** Hand-written HTML5, CSS3 (Grid + Flexbox + `clamp()` fluid typography), vanilla JS (`IntersectionObserver`, `requestAnimationFrame`, pointer events). Hosted on GitHub Pages. Fonts: Google Fonts — `Syne` (display) + `DM Sans` (body) + `DM Mono` (added for monospace UI cues like the per-site rules list).

**Verification model:** No automated test suite exists for this static site. "Verify" steps mean: open `index.html` in a desktop browser (Chrome, Safari, or Firefox), confirm the change is present, and confirm no console errors. The anti-pattern audit at the end (Task 14) is the integration check.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Modify | Markup: drop marquee, add manifesto + founder section, restructure hero/eye-care/pricing/footer, rewrite all section eyebrows. |
| `style.css` | Modify | Append new section classes; remove orphaned classes for dropped/replaced UI. |
| `script.js` | Modify | Delete two orphaned handlers (hero-state-cycle, hero-phone tilt). Add the BLF slider handler. Keep everything else. |
| `assets/icons/moon-1.svg` … `moon-5.svg` | Create | 5 new 24×24 moon-state symbol files, single-color `currentColor`. |
| `assets/icons/pulse.svg` `target.svg` `sliders-horizontal.svg` `clock.svg` `microphone.svg` `eye.svg` `image.svg` `palette.svg` `list-checks.svg` `envelope.svg` | Leave on disk | References removed from `index.html`. Disk-deletion is a follow-up cleanup, not blocking. |

**Boundaries:**
- `style.css` is one big file already; spec does not request splitting. We add new rules at the end of each existing section block (hero, ios, pricing, footer) and remove obsolete rules in place. Each task touches only its own section range.
- `script.js` is a single IIFE; we edit within it, not splitting into modules. The shared scroll-effects engine stays untouched.
- `index.html` is one document; we edit section-by-section.

---

## Chunk 1 · Foundation (assets + cleanup)

Five tasks that prepare the runway: create new SVGs, strip orphaned JS, strip the marquee. After this chunk, the page still renders (without the marquee) but no other visible change yet.

### Task 1: Create the 5 moon-state SVG icons

**Files:**
- Create: `assets/icons/moon-1.svg`
- Create: `assets/icons/moon-2.svg`
- Create: `assets/icons/moon-3.svg`
- Create: `assets/icons/moon-4.svg`
- Create: `assets/icons/moon-5.svg`

Per spec lines 137–145 (geometry table). All use a 24×24 viewBox, no fill on the main circle except where noted, stroke `currentColor`, stroke-width `1.5`, `stroke-linecap="round"`.

- [ ] **Step 1: Write `moon-1.svg` (Live Activity — full circle + edge pulse dot)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <circle cx="12" cy="12" r="8"/>
  <circle cx="20" cy="12" r="1.5" fill="currentColor" stroke="none"/>
</svg>
```

- [ ] **Step 2: Write `moon-2.svg` (Focus Filter — concentric target rings)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <circle cx="12" cy="12" r="8"/>
  <circle cx="12" cy="12" r="4"/>
  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
</svg>
```

- [ ] **Step 3: Write `moon-3.svg` (Control Center — half-filled circle, "switch")**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <circle cx="12" cy="12" r="8"/>
  <path d="M12 4 a8 8 0 0 0 0 16 z" fill="currentColor" stroke="none"/>
</svg>
```

- [ ] **Step 4: Write `moon-4.svg` (Auto Schedule — clock hand at ~5 o'clock)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <circle cx="12" cy="12" r="8"/>
  <line x1="12" y1="12" x2="16" y2="18"/>
</svg>
```

- [ ] **Step 5: Write `moon-5.svg` (Siri & Shortcuts — offset circle + outside sound-wave arc)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <circle cx="11" cy="12" r="7"/>
  <path d="M21 8 a5 5 0 0 1 0 8"/>
</svg>
```

- [ ] **Step 6: Verify rendering**

Open each file directly in a browser (file:// URL works). Confirm: each 24×24 mark is drawn in black on a transparent background. No XML errors.

- [ ] **Step 7: Commit**

```bash
git add assets/icons/moon-1.svg assets/icons/moon-2.svg assets/icons/moon-3.svg assets/icons/moon-4.svg assets/icons/moon-5.svg
git commit -m "feat: add 5 moon-state custom SVG icons for iOS bento section"
```

---

### Task 2: Drop the marquee section

**Files:**
- Modify: `index.html` (lines ~134–170 — the `<section class="marquee-section">…</section>` block)
- Modify: `style.css` (search-and-remove all `.marquee*` rules)

- [ ] **Step 1: Remove the marquee markup from `index.html`**

Delete the entire `<!-- MARQUEE — supported websites -->` block and its `<section class="marquee-section">…</section>` contents. Result: the section after the hero becomes the compare slider directly.

- [ ] **Step 2: Remove marquee CSS rules from `style.css`**

Delete every rule whose selector starts with `.marquee-section`, `.marquee`, `.marquee-track`, or `.marquee-label`, including the `@keyframes` animation that drives the scroll.

Run: `grep -n "marquee" style.css` — expected output: no matches.

- [ ] **Step 3: Verify**

Open `index.html` in a browser. Expected: hero → compare slider directly. No "Optimized for the sites you use most" label. No console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "refactor: drop marquee section (logo-soup is itself an AI-favorite pattern)"
```

---

### Task 3: Delete the orphaned hero-state-cycle JS handler

**Files:**
- Modify: `script.js:74-102`

- [ ] **Step 1: Locate the handler**

Run: `grep -n "Hero state auto-cycle" script.js`

Expected output: a single match around line 74.

- [ ] **Step 2: Delete the block**

Remove lines 74–102 inclusive. The block starts with the comment `// ---------- Hero state auto-cycle (Light → Dark Blue → Sepia) ----------` and ends with the closing `}` on `}, 3500);`.

- [ ] **Step 3: Verify no remaining references**

Run: `grep -nE "hero-state|data-hero-content|hero-phone-bar|hero-phone-url" script.js`

Expected output: no matches.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "chore: remove hero-state-cycle handler (orphaned by new hero visual)"
```

---

### Task 4: Delete the orphaned hero-phone tilt JS

**Files:**
- Modify: `script.js:209-222`

- [ ] **Step 1: Locate the handler**

Run: `grep -n "Hero phone subtle tilt" script.js`

Expected output: a single match around line 209.

- [ ] **Step 2: Delete the block**

Remove the `// Hero phone subtle tilt follows cursor…` comment and the `if (heroVisual && heroPhone) { … }` block — roughly lines 209–222. Leave the surrounding "3D tilt on cards" block (which handles `[data-tilt]` on bento cards) intact.

- [ ] **Step 3: Also remove the `--phone-float` CSS variable write**

In the parallax block (search for `--phone-float`), delete the single line:

```js
heroEl.style.setProperty('--phone-float', (y * -0.05) + 'px');
```

Keep the surrounding `--mesh-shift`, `--grain-shift`, and `--glow-shift` lines.

- [ ] **Step 4: Verify no remaining references**

Run: `grep -nE "data-tilt-parent|data-hero-phone|--phone-float" script.js`

Expected output: no matches.

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "chore: remove hero-phone tilt + phone-float parallax (orphaned by theme-stack hero)"
```

---

### Task 5: Strip the obsolete CSS classes from style.css

**Files:**
- Modify: `style.css`

Per spec "CSS to delete from style.css" list. Delete blocks for elements whose markup is being replaced this chunk and the next. We do this now while it's easy to identify dead code; the new rules will be added incrementally in later chunks.

- [ ] **Step 1: Remove iPhone-hero classes**

Delete every rule whose selector starts with one of: `.hero-phone-large`, `.hero-phone-notch`, `.hero-phone-screen`, `.hero-phone-bar`, `.hero-phone-url`, `.hero-phone-content`, `.hero-state` (any suffix), `.hero-glow`.

Verify: `grep -nE "hero-phone|hero-state|hero-glow" style.css` → no matches.

- [ ] **Step 2: Remove old feature-mini eye-care classes**

Delete every rule whose selector starts with one of: `.feature-mini`, `.feature-mini-icon`, `.eye-gradient`, `.image-gradient`, `.palette-gradient`, `.list-gradient`, `.features-row`.

Verify: `grep -nE "feature-mini|eye-gradient|image-gradient|palette-gradient|list-gradient|features-row" style.css` → no matches.

- [ ] **Step 3: Remove old single-card pricing classes**

Delete rules for: `.price-card-v2`, `.price-glow`, `.price-tag`, `.price-meta-top`, `.price-num-row`, `.price-currency`, `.price-num-v2`, `.price-meta`, `.price-list-v2`, `.price-check`, `.section-pricing .price-cta`.

Keep `.section-pricing` itself; we'll rewrite its inner rules. Keep `.price-cta` selector for reuse (new pricing uses the same class name).

Verify: `grep -nE "price-card-v2|price-glow|price-tag|price-meta-top|price-num-row|price-currency|price-num-v2|price-meta|price-list-v2|price-check|price-num\b|price-list\b" style.css` → no matches.

> Note: `style.css` also contains older, parallel rules `.price-num` and `.price-list` (without the `-v2` suffix). They're orphaned by Task 12's pricing rewrite. Delete them now alongside the `-v2` set so nothing dangling remains. Expect `.price-cta` itself to still match twice — that selector is reused by the new pricing block and stays.

- [ ] **Step 4: Remove old bento icon-tile gradient classes**

Delete rules for: `.icon-tile-live`, `.icon-tile-focus`, `.icon-tile-cc`, `.icon-tile-sched`, `.icon-tile-siri`. Also delete the per-card gradient backgrounds: `.bento-card-live`, `.bento-card-focus`, `.bento-card-cc`, `.bento-card-sched`, `.bento-card-siri`.

Keep the inner mockup styles: `.bento-island`, `.bento-island-*`, `.bento-focus-row`, `.bento-focus-*`, `.bento-cc-grid`, `.bento-cc-tile`, `.bento-cc-aurora`, `.bento-cc-moon`, `.bento-clock`, `.bento-clock-*`, `.bento-siri-*`. These are reused.

Verify: `grep -nE "icon-tile-(live|focus|cc|sched|siri)|bento-card-(live|focus|cc|sched|siri)" style.css` → no matches.

- [ ] **Step 5: Remove old footer classes**

Delete rules for: `.site-footer`, `.footer-inner`, `.footer-brand`, `.footer-links`, `.footer-contact`. We'll add a minimal replacement in Chunk 4.

Verify: `grep -nE "site-footer|footer-inner|footer-brand|footer-links|footer-contact" style.css` → no matches.

- [ ] **Step 6: Open the page in a browser to confirm it still loads**

Expected: page renders but with broken visuals for hero, eye-care, pricing, iOS bento (color), and footer (no styles). This is fine — these sections get rewritten in Chunks 2–4. Confirm: no console errors, page scrolls.

- [ ] **Step 7: Commit**

```bash
git add style.css
git commit -m "refactor: strip CSS for sections being replaced in this redesign"
```

---

## Chunk 2 · Hero + Manifesto

### Task 6: Replace the hero visual with the theme-card stack

**Files:**
- Modify: `index.html` (the entire `<header id="hero" class="hero hero-v2">…</header>` block — roughly lines 45–132)
- Modify: `style.css` (add new hero rules where the old `.hero-phone-*` rules were)

- [ ] **Step 1: Replace the hero markup in `index.html`**

Find the `<header id="hero" …>` block. Replace its **right-side `.hero-visual` panel only** (the `<div class="hero-visual" data-tilt-parent>…</div>` containing the iPhone mockup) with this theme-stack markup. **Drop the `data-tilt-parent` attribute** in the replacement — its JS handler was removed in Task 4 and the attribute would now be a misleading dead hook:

```html
<div class="hero-visual">
  <div class="theme-stack">
    <div class="theme-card c1">
      <div class="tc-pill">Dark Blue</div>
      <div class="tc-bar"></div>
      <div class="tc-bar m"></div>
      <div class="tc-bar s"></div>
      <div class="tc-bar"></div>
      <div class="tc-bar t"></div>
    </div>
    <div class="theme-card c2">
      <div class="tc-pill">Sepia</div>
      <div class="tc-bar"></div>
      <div class="tc-bar s"></div>
      <div class="tc-bar m"></div>
      <div class="tc-bar t"></div>
      <div class="tc-bar"></div>
    </div>
    <div class="theme-card c3">
      <div class="tc-pill">Forest</div>
      <div class="tc-bar"></div>
      <div class="tc-bar m"></div>
      <div class="tc-bar"></div>
      <div class="tc-bar s"></div>
      <div class="tc-bar t"></div>
    </div>
  </div>
</div>
```

Keep the left-side `.hero-copy` (eyebrow, headline, sub, CTAs, stats) — modifications happen in Task 7.

- [ ] **Step 2: Add theme-stack CSS to `style.css`**

Append in the hero section (where the old `.hero-phone-*` rules used to live):

```css
.theme-stack { position: relative; width: 340px; height: 460px; margin: 0 auto; }
.theme-card { position: absolute; border-radius: 20px; overflow: hidden; border: 1px solid var(--border); padding: 1rem; transition: transform .35s cubic-bezier(.2,.7,.2,1); }
.theme-card.c1 { width: 240px; height: 300px; right: 0; top: 0; background: #0D1B2A; transform: rotate(3deg); z-index: 1; }
.theme-card.c2 { width: 260px; height: 320px; left: 0; top: 60px; background: #1A0A1E; transform: rotate(-2deg); z-index: 2; }
.theme-card.c3 { width: 280px; height: 340px; left: 30px; top: 120px; background: #0F1A14; transform: rotate(1deg); z-index: 3; box-shadow: 0 30px 80px rgba(0,0,0,0.6); }
.theme-stack:hover .theme-card.c1 { transform: rotate(5deg) translateY(-8px); }
.theme-stack:hover .theme-card.c2 { transform: rotate(-4deg) translateX(-8px); }
.theme-stack:hover .theme-card.c3 { transform: rotate(2deg) translateY(4px); }
.tc-pill { display: inline-flex; padding: .25rem .65rem; border-radius: 100px; font-size: .65rem; margin-bottom: .8rem; }
.tc-bar { height: 6px; border-radius: 3px; margin-bottom: .45rem; }
.theme-card.c1 .tc-pill { background: rgba(79,195,200,0.15); color: #4FC3C8; }
.theme-card.c1 .tc-bar { background: rgba(79,195,200,0.15); }
.theme-card.c2 .tc-pill { background: rgba(192,130,96,0.2); color: #C08260; }
.theme-card.c2 .tc-bar { background: rgba(192,130,96,0.12); }
.theme-card.c3 .tc-pill { background: rgba(74,222,128,0.15); color: #4ADE80; }
.theme-card.c3 .tc-bar { background: rgba(74,222,128,0.1); }
.tc-bar.s { width: 60%; }
.tc-bar.m { width: 80%; }
.tc-bar.t { width: 40%; }
```

- [ ] **Step 3: Verify visual**

Reload `index.html`. Expected: hero right side shows 3 tilted cards (Dark Blue back, Sepia middle, Forest front) stacked with rotation. Hover the stack — the cards fan out. No console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat(hero): replace iPhone mockup with stacked theme-card visual"
```

---

### Task 7: Update hero stats (data-counter fixes)

**Files:**
- Modify: `index.html` (the `.hero-stats` block within the hero)

- [ ] **Step 1: Replace the stats block**

Find `<div class="hero-stats">…</div>` in the hero. Replace it with:

```html
<div class="hero-stats">
  <div class="hero-stat">
    <div class="hero-stat-num" data-counter="7">0</div>
    <div class="hero-stat-label">iOS integrations</div>
  </div>
  <div class="hero-stat">
    <div class="hero-stat-num">$5.99</div>
    <div class="hero-stat-label">once, forever</div>
  </div>
  <div class="hero-stat">
    <div class="hero-stat-num stat-privacy">Zero trackers</div>
    <div class="hero-stat-label">ever, on any device</div>
  </div>
</div>
```

Per spec: only the first stat keeps `data-counter`. Stats 2 and 3 are static text. Stat 3 adds the `stat-privacy` class for the teal-color treatment.

- [ ] **Step 2: Add the `.stat-privacy` rule if not already present**

Search `style.css` for `.stat-privacy`. If missing, append in the hero section:

```css
.hero-stat-num.stat-privacy { font-size: .95rem; color: var(--accent2); }
```

- [ ] **Step 3: Verify**

Reload `index.html`. Expected: 3 stats show `7` (animates from 0 → 7 once on scroll), `$5.99`, `Zero trackers` (teal). No console errors. Sub-labels read `iOS integrations`, `once, forever`, `ever, on any device`.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "fix(hero): scope data-counter to numeric stat, label sub-text per spec"
```

---

### Task 8: Add the manifesto strip section

**Files:**
- Modify: `index.html` (insert a new `<section>` between hero and compare slider)
- Modify: `style.css` (append manifesto styles)

- [ ] **Step 1: Insert manifesto markup**

After the closing `</header>` of the hero and before `<section id="features" …>` (the compare slider), insert:

```html
<!-- MANIFESTO — three refusals -->
<section class="manifesto">
  <div class="container manifesto-grid">
    <div class="manifesto-item">
      <div class="manifesto-num">01</div>
      <div class="manifesto-statement">No subscription. Ever.</div>
    </div>
    <div class="manifesto-item">
      <div class="manifesto-num">02</div>
      <div class="manifesto-statement">No tracking. Ever.</div>
    </div>
    <div class="manifesto-item">
      <div class="manifesto-num">03</div>
      <div class="manifesto-statement">No card for the trial.</div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append manifesto CSS**

Add to `style.css`:

```css
/* ─── MANIFESTO ─── */
.manifesto {
  padding: 4.5rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.manifesto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
}
.manifesto-item {
  padding: 1rem 2.5rem 1rem 0;
  position: relative;
}
.manifesto-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 1rem; top: 0; bottom: 0;
  width: 1px;
  background: var(--border);
}
.manifesto-num {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: .7rem;
  color: var(--muted);
  letter-spacing: 0.05em;
  margin-bottom: .8rem;
}
.manifesto-statement {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: clamp(1.25rem, 2.2vw, 1.75rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
}
@media (max-width: 720px) {
  .manifesto-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .manifesto-item:not(:last-child)::after { display: none; }
}
```

- [ ] **Step 3: Verify**

Reload. Expected: after hero, a full-width section with 3 columns, each showing `01 / 02 / 03` muted-small above a bold Syne statement. Vertical dividers between columns. On window resize ≤ 720px, stacks vertically.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add manifesto strip — three refusals between hero and compare"
```

---

## Chunk 3 · Mid-page (compare, iOS bento, eye-care + BLF demo)

### Task 9: Compare slider eyebrow

**Files:**
- Modify: `index.html` (the section's eyebrow + headline block)

- [ ] **Step 1: Replace the compare-section eyebrow**

In `<section id="features" class="section-demo section-v2" data-reveal>`, find the existing:

```html
<div class="section-eyebrow">DRAG TO REVEAL</div>
<h2 class="section-title-v2">See <em>exactly</em> what changes.</h2>
```

Replace with:

```html
<div class="eyebrow-question"><em>What does Aurora actually change?</em></div>
<h2 class="section-title-v2">See exactly what changes.</h2>
```

Removes the `<em>` from `exactly` (per spec: drop the per-headline italic-word trick). Eyebrow becomes an italic question, left-aligned.

- [ ] **Step 2: Add `.eyebrow-question` CSS**

Append in the section-demo block of `style.css`:

```css
.eyebrow-question {
  font-family: 'Syne', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: var(--muted);
  font-style: italic;
  margin-bottom: .9rem;
  text-align: left;
}
```

- [ ] **Step 3: Verify**

Reload, scroll to the compare slider. Expected: italic muted "What does Aurora actually change?" sits above the headline. Headline reads `See exactly what changes.` (no italic on `exactly`). Drag interaction still works.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat(compare): replace all-caps eyebrow with italic question, drop em on exactly"
```

---

### Task 10: iOS bento — apply day → night color story

**Files:**
- Modify: `index.html` (the `<section id="made-for-ios">` block — 5 bento cards)
- Modify: `style.css` (append new bento card classes; the inner mockup classes stay untouched)

- [ ] **Step 1: Update the section eyebrow**

In `<section id="made-for-ios" …>`, replace the existing eyebrow block:

```html
<div class="center">
  <span class="section-badge-only-aurora">ONLY ON AURORA</span>
</div>
<h2 class="section-title-v2">Built into <em>every</em> corner of iOS.</h2>
<p class="section-sub-v2">5 integrations no other Safari dark mode app has. Tap any card.</p>
```

With:

```html
<p class="eyebrow-sentence">Five integrations no other Safari app ships.</p>
<h2 class="section-title-v2">Built into every corner of iOS.</h2>
<p class="section-sub-v2">Each card is a feature only Aurora ships on iOS.</p>
```

(Removes `<em>` from `every`. Eyebrow becomes a prose sentence.)

- [ ] **Step 2: Add `.eyebrow-sentence` CSS**

Append:

```css
.eyebrow-sentence {
  font-family: 'DM Sans', sans-serif;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: .9rem;
  max-width: 380px;
}
```

- [ ] **Step 3: Update each bento card's class**

For each of the 5 `<article class="bento-card bento-card-live">` (and `-focus`, `-cc`, `-sched`, `-siri`) elements, replace the trailing class with the new day-night class:

| Old class | New class | Feature |
|---|---|---|
| `bento-card-live` | `bento-1` | Live Activity (cream) |
| `bento-card-focus` | `bento-2` | Focus Filter (dusk-mauve) |
| `bento-card-cc` | `bento-3` | Control Center (dusk) |
| `bento-card-sched` | `bento-4` | Auto Schedule (late night) |
| `bento-card-siri` | `bento-5` | Siri & Shortcuts (deep night) |

So each `<article>` becomes e.g. `<article class="bento-card bento-1" data-reveal data-tilt>`.

- [ ] **Step 4: Replace each card's icon-tile span with a `.moon-icon` div pointing at the matching SVG**

Within each card, find the existing icon block:

```html
<span class="icon-tile icon-tile-live">
  <img src="assets/icons/pulse.svg" alt="">
</span>
```

Replace with the matching moon file (table below), wrapped in a `.moon-icon` div:

```html
<div class="moon-icon">
  <img src="assets/icons/moon-1.svg" alt="">
</div>
```

| Card | Icon file |
|---|---|
| `bento-1` (Live Activity) | `moon-1.svg` |
| `bento-2` (Focus Filter) | `moon-2.svg` |
| `bento-3` (Control Center) | `moon-3.svg` |
| `bento-4` (Auto Schedule) | `moon-4.svg` |
| `bento-5` (Siri & Shortcuts) | `moon-5.svg` |

- [ ] **Step 5: Append day-night CSS rules + bento grid placement**

In `style.css`, in the iOS bento section block, add:

```css
/* Day → night bento color story */
.bento-card.bento-1 { background: linear-gradient(135deg, #F5E6CC, #E8C68A); color: #1A1A2A; }
.bento-card.bento-2 { background: linear-gradient(135deg, #C4A0A8, #6D5A8E); color: #1A1A2A; }
.bento-card.bento-3 { background: linear-gradient(135deg, #5D5680, #3A2F4F); color: #F0EFF8; }
.bento-card.bento-4 { background: linear-gradient(135deg, #1F1A35, #0F1422); color: #F0EFF8; }
.bento-card.bento-5 { background: linear-gradient(135deg, #0A0E1A, #050610); color: #F0EFF8; border: 1px solid rgba(255,255,255,0.07); }

/* Bento grid placement (Chunk 1 stripped the old .bento-card-X placement; re-add under new class names) */
@media (min-width: 720px) {
  .bento-card.bento-1 { grid-column: 1 / span 2; grid-row: 1 / span 2; }
  .bento-card.bento-2 { grid-column: 3; grid-row: 1; }
  .bento-card.bento-3 { grid-column: 3; grid-row: 2; }
  .bento-card.bento-4 { grid-column: 1; grid-row: 3; }
  .bento-card.bento-5 { grid-column: 2 / span 2; grid-row: 3; }
}
@media (min-width: 1100px) {
  .bento-card.bento-1 { grid-column: 1 / span 2; grid-row: 1 / span 2; }
  .bento-card.bento-2 { grid-column: 3; grid-row: 1; }
  .bento-card.bento-3 { grid-column: 3; grid-row: 2; }
  .bento-card.bento-4 { grid-column: 1; grid-row: 3; }
  .bento-card.bento-5 { grid-column: 2 / span 2; grid-row: 3; }
}

/* Moon icon container */
.moon-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: grid; place-items: center;
  background: rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.12);
  margin-bottom: .9rem;
}
.bento-card.bento-1 .moon-icon img,
.bento-card.bento-2 .moon-icon img { filter: none; }
.bento-card.bento-3 .moon-icon,
.bento-card.bento-4 .moon-icon,
.bento-card.bento-5 .moon-icon {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.12);
}
.moon-icon img { width: 22px; height: 22px; }
.bento-card.bento-3 .moon-icon img,
.bento-card.bento-4 .moon-icon img,
.bento-card.bento-5 .moon-icon img { filter: invert(98%) sepia(3%) saturate(290%) hue-rotate(202deg) brightness(101%); }
```

> **Why the filter:** the moon SVGs use `currentColor`. When loaded via `<img>` they cannot inherit `currentColor`, so for dark-bg cards we colorize them to near-white via a CSS filter approximation of `#F0EFF8`. The light-bg cards leave them black (no filter). An alternative is inlining the SVG markup in `index.html`; the filter approach keeps the SVG files reusable.

- [ ] **Step 6: Adjust the existing bento mockup chrome for cream/mauve backgrounds**

In `style.css`, find the `.bento-island`, `.bento-focus-row`, `.bento-live`, and related rules. Add color overrides so the inner mockups read on the new lighter backgrounds. Append:

```css
/* Mockup contrast against day-night card backgrounds */
.bento-card.bento-1 .bento-island { background: #08080E; color: white; }
.bento-card.bento-1 .bento-lock-time,
.bento-card.bento-1 .bento-lock-date { color: rgba(26,26,42,0.85); }
.bento-card.bento-1 .bento-live { background: rgba(0,0,0,0.05); }
.bento-card.bento-2 .bento-focus-row { background: rgba(255,255,255,0.06); }
.bento-card.bento-2 .bento-focus-row strong,
.bento-card.bento-2 .bento-focus-row span { color: #1A1A2A; }
```

- [ ] **Step 7: Verify visual**

Reload, scroll to "Built into every corner of iOS." Expected:
- 5 cards: cream → dusk-mauve → dusk → late-night → deep-night.
- Each card shows the moon SVG in the top-left rounded square.
- Card 1 (cream) and Card 2 (mauve) use dark text; cards 3–5 use light text.
- Inner mockups (Dynamic Island, Focus row, CC grid, clock, Siri orb) all readable.
- Hover-tilt still works on every card.

- [ ] **Step 8: Commit**

```bash
git add index.html style.css
git commit -m "feat(ios): day→night color story + moon-state custom icons across 5 bento cards"
```

---

### Task 11: Eye-care section — restructure to BLF hero + 3 supporting cards

**Files:**
- Modify: `index.html` (the `<section class="section-eyecare …">` block)
- Modify: `style.css` (append eye-care grid + visual-cue styles)
- Modify: `script.js` (append the BLF slider handler)

- [ ] **Step 1: Replace the eye-care section markup**

Find `<section class="section-eyecare section-v2">…</section>`. Replace its inner contents with:

```html
<section class="section-eyecare section-v2">
  <div class="container">
    <div class="section-marker-wrap">
      <div class="section-marker">
        <div class="section-marker-num">§04</div>
        <div class="section-marker-rule"></div>
      </div>
      <div>
        <h2 class="section-title-v2 eyecare-headline">Reading at 2am, made actually easy.</h2>
        <p class="section-sub-v2 eyecare-sub">Aurora is more than a flat black-and-white swap.</p>
      </div>
    </div>

    <div class="eyecare-grid">
      <!-- Hero feature: Blue Light Filter with live interactive slider -->
      <div class="feat-card hero" id="blfDemo" data-reveal>
        <div>
          <div class="feat-label">Eye-care · Interactive</div>
          <h3 class="feat-title">Blue Light Filter</h3>
          <p class="feat-desc">Up to 100% reduction. Drag the slider to feel the difference — most dark mode apps skip this entirely.</p>
        </div>
        <div class="blf-demo">
          <div class="blf-url">aurora.app · dark blue</div>
          <div class="blf-line" id="l1"></div>
          <div class="blf-line m" id="l2"></div>
          <div class="blf-line s" id="l3"></div>
          <div class="blf-line" id="l4"></div>
          <div class="blf-line t" id="l5"></div>
          <div class="blf-row">
            <span class="blf-row-label">Blue light</span>
            <input type="range" class="blf-slider" id="blfSlider" min="0" max="100" value="40">
            <span class="blf-pct" id="blfPct">40%</span>
          </div>
        </div>
      </div>

      <!-- Supporting cards: each uses a feature-specific visual cue, NO icon -->
      <div class="support-stack">
        <div class="feat-card sm" data-reveal>
          <div class="feat-label">Image Dimming</div>
          <h4 class="feat-title sm">Tame bright photos</h4>
          <p class="feat-desc sm">Granular control, per-site rules.</p>
          <div class="cue-swatches">
            <div style="background:#E0E0E0;"></div>
            <div style="background:#B8B8B8;"></div>
            <div style="background:#909090;"></div>
            <div style="background:#686868;"></div>
            <div style="background:#404040;"></div>
            <div style="background:#202020;"></div>
          </div>
        </div>
        <div class="feat-card sm" data-reveal>
          <div class="feat-label">Unlimited Themes</div>
          <h4 class="feat-title sm">7 built-in + custom</h4>
          <p class="feat-desc sm">Design your own. Syncs via iCloud.</p>
          <div class="cue-dots">
            <div style="background:#0D1B2A;"></div>
            <div style="background:#1A0A1E;"></div>
            <div style="background:#0F1A14;"></div>
            <div style="background:#2A1A0D;"></div>
            <div style="background:#1A2A28;"></div>
          </div>
        </div>
        <div class="feat-card sm" data-reveal>
          <div class="feat-label">Per-Site Rules</div>
          <h4 class="feat-title sm">Whitelist or skip</h4>
          <p class="feat-desc sm">Skip sites you want untouched.</p>
          <div class="cue-list">
            <div><span>wikipedia.org</span> <span class="on">ON</span></div>
            <div><span>youtube.com</span> <span class="on">ON</span></div>
            <div><span>news.ycombinator.com</span> <span class="off">OFF</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append eye-care CSS**

Add to `style.css`:

```css
/* ─── EYE-CARE (restructured) ─── */
.section-marker-wrap {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  margin-bottom: 2.5rem;
}
.section-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .4rem;
  padding-top: .35rem;
  flex-shrink: 0;
}
.section-marker-num {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: .72rem;
  color: var(--accent2);
}
.section-marker-rule {
  width: 1px;
  height: 40px;
  background: rgba(255,255,255,0.15);
}
.eyecare-headline { margin-bottom: .4rem; text-align: left; }
.eyecare-sub { margin-bottom: 0; text-align: left; max-width: 540px; }

.eyecare-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
}
.feat-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem;
}
.feat-card.hero {
  background: linear-gradient(135deg, #0F0F1A, #141428);
  position: relative;
  overflow: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.feat-card.hero::after {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(139,124,248,0.2), transparent 70%);
  pointer-events: none;
}
.feat-label {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: .65rem;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--accent2);
  margin-bottom: .8rem;
}
.feat-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: .5rem;
}
.feat-card.hero .feat-title { font-size: 1.65rem; }
.feat-card.sm { padding: 1.25rem; }
.feat-title.sm { font-size: 1.05rem; }
.feat-desc { font-size: .85rem; color: var(--muted); line-height: 1.55; }
.feat-desc.sm { font-size: .8rem; }

/* BLF live demo */
.blf-demo {
  background: #0A1520;
  border-radius: 12px;
  padding: 1.2rem;
  margin-top: 1.4rem;
  border: 1px solid rgba(79,195,200,0.15);
}
.blf-url {
  font-family: 'DM Mono', 'Menlo', monospace;
  font-size: .65rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: .8rem;
  letter-spacing: .05em;
}
.blf-line {
  height: 8px;
  border-radius: 4px;
  margin-bottom: .5rem;
  background: rgba(79,195,200,0.18);
  transition: background .1s;
}
.blf-line.s { width: 65%; }
.blf-line.m { width: 85%; }
.blf-line.t { width: 45%; }
.blf-row {
  display: flex;
  align-items: center;
  gap: .65rem;
  margin-top: 1rem;
}
.blf-row-label {
  font-size: .7rem;
  color: var(--accent2);
  white-space: nowrap;
}
input[type="range"].blf-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 3px;
  background: rgba(79,195,200,0.3);
  border-radius: 2px;
  outline: none;
}
input[type="range"].blf-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent2);
  cursor: pointer;
}
.blf-pct { font-size: .7rem; color: var(--muted); width: 2.2rem; text-align: right; }

.support-stack { display: flex; flex-direction: column; gap: 1rem; }

/* Visual cues replacing icons */
.cue-swatches {
  display: flex;
  height: 18px;
  border-radius: 4px;
  overflow: hidden;
  margin-top: .8rem;
}
.cue-swatches > div { flex: 1; }
.cue-dots { display: flex; gap: .35rem; margin-top: .8rem; }
.cue-dots > div { width: 14px; height: 14px; border-radius: 50%; }
.cue-list {
  margin-top: .8rem;
  font-family: 'DM Mono', 'Menlo', monospace;
  font-size: .68rem;
  color: var(--muted);
}
.cue-list > div { padding: .25rem 0; display: flex; justify-content: space-between; }
.cue-list .on { color: #4ADE80; }
.cue-list .off { color: rgba(255,255,255,0.3); }

@media (max-width: 900px) {
  .eyecare-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify `DM Mono` is in the Google Fonts link**

In `index.html` `<head>`, confirm the existing `<link href="https://fonts.googleapis.com/css2?…">` includes `&family=DM+Mono:wght@400;500` (it should — added during Chunk 2 cleanup along with the Syne / DM Sans imports that were missing). If absent, append.

- [ ] **Step 4: Append the BLF slider handler to `script.js`**

At the end of the IIFE (before the closing `})();`), add:

```js
// ---------- Blue Light Filter — interactive slider demo ----------
const blfSlider = document.getElementById('blfSlider');
const blfPct    = document.getElementById('blfPct');
const blfDemo   = document.getElementById('blfDemo');
const blfLines  = [1,2,3,4,5].map(i => document.getElementById('l'+i));
if (blfSlider && blfPct && blfDemo && blfLines.every(Boolean)) {
  blfSlider.addEventListener('input', () => {
    const v = parseInt(blfSlider.value, 10);
    blfPct.textContent = v + '%';
    const warmth = v / 100;
    const r = Math.round(79  + warmth * 60);
    const g = Math.round(195 - warmth * 40);
    const b = Math.round(200 - warmth * 150);
    blfLines.forEach(l => { l.style.background = `rgba(${r},${g},${b},0.18)`; });
    blfDemo.style.background = `rgb(${Math.round(10 + warmth*15)},${Math.round(21 - warmth*4)},${Math.round(32 - warmth*18)})`;
  });
}
```

> Note: the `blfDemo` element here is the *outer* card (`#blfDemo`), per the markup. In the reference file the same id named the inner demo box; the handler's effect of subtly tinting the outer area is intentional.

- [ ] **Step 5: Verify visually**

Reload, scroll to the eye-care section. Expected:
- Section opens with a left-edge `§04` marker + a thin vertical rule beside the headline.
- Left column: large BLF card with the slider mockup. Drag the slider — the 5 article-line backgrounds shift hue from teal toward warm amber.
- Right column: 3 stacked supporting cards. Image Dimming shows a 6-cell swatch row. Themes shows 5 colored dots. Per-Site Rules shows a 3-row mono list with `ON / ON / OFF`.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat(eye-care): BLF hero card with live slider, 3 supporting cards, §04 marker"
```

---

## Chunk 4 · Bottom + verification

### Task 12: Pricing — numeric comparison + 3-FAQ merge

**Files:**
- Modify: `index.html` (replace contents of `<section id="pricing">`; also delete the old `<section id="faq">` block)
- Modify: `style.css` (append pricing-block + faq-block rules)

- [ ] **Step 1: Replace the pricing section markup**

Find `<section id="pricing" class="section-pricing section-v2">…</section>`. Replace its inner contents with:

```html
<section id="pricing" class="section-pricing section-v2">
  <div class="container">
    <div class="price-block">
      <div class="price-row-main">
        <div class="price-main">$5.99</div>
        <div class="price-once">once.</div>
      </div>
      <div class="price-compare">
        <div class="price-strike">$29.99/yr</div>
        <div class="price-caption">…what subscription apps charge for less.</div>
      </div>
      <div class="price-divider"></div>
      <p class="price-guarantees"><b>No subscription</b> · <b>3-day free trial</b> · <b>No card needed</b></p>
      <a href="https://apps.apple.com/us/app/aurora-safari-dark-themes/id6751903540" class="price-cta" data-magnetic>
        <img src="assets/app-store-badge.svg" alt="Download on the App Store" height="48">
      </a>
    </div>

    <div id="faq" class="faq-block">
      <div class="faq-eyebrow">Still wondering?</div>
      <details class="faq-item" data-reveal>
        <summary>What's the refund policy?</summary>
        <p>Standard Apple App Store refund policy. The 3-day free trial requires no payment info, so you can try before you buy.</p>
      </details>
      <details class="faq-item" data-reveal>
        <summary>Is there a Mac version?</summary>
        <p>Currently iOS and iPadOS only. Mac support is being evaluated.</p>
      </details>
      <details class="faq-item" data-reveal>
        <summary>How is Aurora different from Noir or Dark Reader?</summary>
        <p>Aurora is the only Safari dark mode built specifically for iOS — with Focus Filter, Control Center widget, Live Activity, Auto Schedule, and Siri/Shortcuts integration. Tested and stable on iOS 18+.</p>
      </details>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Delete the standalone old FAQ section**

Find the existing `<section id="faq" class="section-faq section-v2">…</section>` (after the pricing section in the current markup). Delete the entire block. The new FAQ now lives inside the pricing section with the same `id="faq"` on the inner `.faq-block` so the nav anchor still works.

- [ ] **Step 3: Append pricing + FAQ CSS**

```css
/* ─── PRICING (numeric comparison) ─── */
.section-pricing { padding: 7rem 0 5rem; text-align: center; }
.price-block { max-width: 620px; margin: 0 auto; }
.price-row-main {
  display: flex; align-items: baseline; justify-content: center;
  gap: .9rem; line-height: 1;
}
.price-main {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 7vw, 5rem);
  letter-spacing: -0.03em;
}
.price-once { font-size: 1.4rem; color: var(--muted); }
.price-compare {
  display: flex; align-items: baseline; justify-content: center;
  gap: .8rem; margin-top: 1.3rem; opacity: 0.7;
  flex-wrap: wrap;
}
.price-strike {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--muted);
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
}
.price-caption { font-size: .85rem; color: var(--muted); font-style: italic; }
.price-divider { width: 80px; height: 1px; background: var(--border); margin: 2rem auto; }
.price-guarantees { font-size: .85rem; color: var(--muted); }
.price-guarantees b { color: var(--text); font-weight: 500; }
.price-cta { display: inline-block; margin-top: 2rem; }
.price-cta:hover img { opacity: .9; }

/* ─── FAQ (merged into pricing section) ─── */
.faq-block { max-width: 680px; margin: 5rem auto 0; text-align: left; }
.faq-eyebrow {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: var(--muted);
  margin-bottom: 1.5rem;
}
.faq-block .faq-item {
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--border);
  background: none; border-top: none; border-left: none; border-right: none;
}
.faq-block .faq-item summary {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-block .faq-item summary::-webkit-details-marker { display: none; }
.faq-block .faq-item summary::after {
  content: '+';
  color: var(--muted);
  font-size: 1.2rem;
  font-weight: 300;
  transition: transform .2s;
}
.faq-block .faq-item[open] summary::after { transform: rotate(45deg); }
.faq-block .faq-item p {
  color: var(--muted);
  font-size: .9rem;
  line-height: 1.6;
  margin-top: .75rem;
}
```

> If existing `.faq-item` rules from the old FAQ section live in `style.css`, they may conflict. Search and remove the old `.section-faq .faq-item` styles if present (and any `.section-faq` rules — the section no longer exists).

- [ ] **Step 4: Remove old `.section-faq` CSS**

Run: `grep -nE "section-faq" style.css`

Delete every rule matched. The new FAQ lives inside `.section-pricing` and uses `.faq-block` namespace.

Also sweep for any bare `.faq-item` rules that weren't namespaced under `.section-faq` or `.faq-block`:

Run: `grep -nE "^\.faq-item|^\.faq-list" style.css`

Delete any matches that aren't under `.faq-block` — the new CSS scopes every FAQ rule to `.faq-block .faq-item`, so unscoped declarations are leftover.

- [ ] **Step 5: Verify**

Reload, scroll to pricing. Expected:
- Centered column showing `$5.99` huge + `once.` small.
- Below: strikethrough `$29.99/yr` + italic caption.
- A short hairline rule.
- `No subscription · 3-day free trial · No card needed` (the three bolded).
- App Store badge as CTA.
- Below pricing block: `Still wondering?` + 3 expanding `<details>` items separated by hairlines (no card frames).
- Click `+` icons expand; rotating to `×`.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css
git commit -m "feat(pricing): numeric comparison + merged 3-FAQ, drop standalone FAQ section"
```

---

### Task 13: Founder + minimal footer

**Files:**
- Modify: `index.html` (replace `<footer class="site-footer">…</footer>` with founder section + minimal footer)
- Modify: `style.css` (append founder-block + minimal-footer rules)

- [ ] **Step 1: Replace the footer markup**

Find `<footer class="site-footer">…</footer>` in `index.html`. Replace with:

```html
<!-- FOUNDER NOTE -->
<section class="founder-section">
  <div class="container founder-inner">
    <div class="founder-quote">
      <p>"I built Aurora because I read a lot at night and nothing worked the way I wanted.
        <strong>If you have feedback, just email me — I read everything.</strong>
        Every update comes from real users, not a product roadmap."</p>
      <div class="founder-sig">
        <div class="founder-avatar">D</div>
        <div>
          <div class="founder-name">Danny</div>
          <div class="founder-handle">Maker of Aurora</div>
        </div>
      </div>
    </div>
    <div class="founder-contact">
      <a href="mailto:danny.ng.it@gmail.com">✉ danny.ng.it@gmail.com</a>
    </div>
  </div>
</section>

<!-- MINIMAL FOOTER -->
<footer class="site-footer-min">
  <div class="container site-footer-inner">
    <div>© 2026 Aurora · Made for iOS</div>
    <div class="site-footer-links">
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
      <a href="support.html">Support</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Append founder + minimal-footer CSS**

```css
/* ─── FOUNDER ─── */
.founder-section { padding: 5rem 0 2rem; border-top: 1px solid var(--border); }
.founder-inner {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 2rem;
}
.founder-quote { max-width: 560px; }
.founder-quote p { font-size: 1rem; color: var(--muted); line-height: 1.7; font-style: italic; }
.founder-quote p strong { color: var(--text); font-style: normal; font-weight: 500; }
.founder-sig { display: flex; align-items: center; gap: .75rem; margin-top: 1.2rem; }
.founder-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: grid; place-items: center;
  font-family: 'Syne', sans-serif;
  font-size: .9rem; font-weight: 700; color: white;
  flex-shrink: 0;
}
.founder-name { font-size: .9rem; font-weight: 500; }
.founder-handle { font-size: .78rem; color: var(--muted); }
.founder-contact a {
  display: inline-flex; align-items: center; gap: .5rem;
  color: var(--muted); font-size: .9rem; text-decoration: none;
  border: 1px solid var(--border); border-radius: 100px;
  padding: .55rem 1.1rem;
  transition: color .2s, border-color .2s;
}
.founder-contact a:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }

/* ─── MINIMAL FOOTER ─── */
.site-footer-min {
  padding: 1.5rem 0 2rem;
  border-top: 1px solid var(--border);
  margin-top: 2rem;
  font-size: .78rem;
  color: var(--muted);
}
.site-footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.site-footer-links a {
  color: var(--muted);
  text-decoration: none;
  margin-left: 1.4rem;
  transition: color .2s;
}
.site-footer-links a:hover { color: var(--text); }
@media (max-width: 720px) {
  .site-footer-inner { flex-direction: column; align-items: flex-start; gap: .6rem; }
  .site-footer-links a { margin-left: 0; margin-right: 1rem; }
}
```

- [ ] **Step 3: Verify**

Reload, scroll to the very bottom. Expected:
- A founder block: italic quote with one bolded sentence inline; small avatar circle showing "D" gradient; name + handle stacked; email chip on the right side.
- Below: a hairline-divided minimal footer with `© 2026 Aurora · Made for iOS` on the left and Privacy / Terms / Support links on the right.
- On mobile width, footer-inner stacks vertically.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat(footer): replace generic footer with founder quote + minimal hairline footer"
```

---

### Task 14: Final verification — anti-pattern audit + responsive sweep

**Files:** none (verification only — no edits unless issues found)

- [ ] **Step 1: Run the 6-point anti-pattern audit**

Open `index.html` in a browser at desktop width (~1280px). Walk through this checklist with your eyes — mark each item as passing or note what fails. No code change required if all pass.

| # | Anti-pattern | Pass condition |
|---|---|---|
| 1 | Gradient word | Only `comfortable` in the hero headline uses the purple→teal gradient. No other word on the page is gradient'd. No headline uses `<em>` for single-word italics. |
| 2 | Duplicated eyebrow template | Every section opens differently: dot-badge (hero), 01/02/03 numbered statements (manifesto), italic question (compare), prose sentence (iOS bento), `§04` left-edge marker (eye-care), no opener (pricing — price IS the opener), name+title (founder). No two sections use the same labeled-eyebrow device. |
| 3 | 4-card clone grid | Eye-care section is a 2-column grid: large BLF card with live slider + 3 short supporting cards stacked. No 4 identical icon-cards. |
| 4 | Generic pricing template | No card frame. `$5.99 once.` typeset large + strikethrough comparison + caption. FAQ merged into the same section as plain `<details>`. No badge, no centered card with checklist. |
| 5 | Default Lucide icons | iOS bento uses moon-state SVGs (`moon-1`…`moon-5`). Eye-care section has NO icons (uses swatches, dots, mono-list as visual cues). |
| 6 | "Safe pretty" iOS card colors | The 5 cards visibly progress cream → mauve → dusk → late-night → deep-night, top-left to bottom-right. The color sequence is the visual narrative, not just random hues. |

- [ ] **Step 2: Responsive verification**

Resize the browser window to ~720px. Confirm:
- Manifesto stacks to a single column, dividers hidden.
- iOS bento becomes a single column (cards stacked in order — color story still reads top → bottom).
- Eye-care grid collapses BLF card above the 3 supporting cards.
- Pricing comparison line wraps below the main number on narrow widths (`flex-wrap` on `.price-compare`).
- Minimal footer stacks `©` line above the links row.

Resize to ~360px. Confirm the page is still readable, no horizontal scroll, all CTAs tappable.

- [ ] **Step 3: Interaction check**

At desktop width, verify each interactive element still fires:
- Click the nav anchor links — smooth-scroll fires.
- Hover the theme-stack in the hero — cards fan out.
- Drag the compare slider handle — divider moves left/right.
- Scroll-scrub through the compare section — divider moves on its own.
- Drag the BLF slider — article lines shift toward amber.
- Hover bento cards — 3D tilt fires.
- Click a FAQ `<summary>` — the panel expands; `+` rotates to `×`.
- Click the App Store badge in pricing — opens the App Store URL (don't actually navigate, just confirm the link target).

- [ ] **Step 4: Console check**

Open browser devtools console. Reload `index.html`. Expected: zero errors, zero warnings unrelated to fonts/network.

- [ ] **Step 5: Lighthouse pass (optional but recommended)**

Run Chrome Lighthouse (or the `lighthouse` CLI) on the page. Confirm:
- Performance ≥ 90 (it was before — the new page should be lighter without the iPhone mockup).
- Accessibility ≥ 95 (the new dark-text-on-cream/mauve cards should be checked here for contrast).

If Accessibility drops below 95 due to a flagged contrast issue on the bento tag, follow the spec's contrast fallback (bump that tag's opacity to 1.0).

- [ ] **Step 6: Commit (if no fixes needed)**

If the audit passed without fixes, no commit is needed. If you adjusted anything in step 5:

```bash
git add style.css
git commit -m "fix: address contrast issue flagged by Lighthouse on bento tag"
```

- [ ] **Step 7: Push and verify on GitHub Pages**

```bash
git push origin main
```

Wait ~2 minutes for GitHub Pages to deploy. Open the deployed URL and re-run a quick visual sweep — confirm the deployed version matches local.

---

## Done

All 14 tasks complete. The Aurora marketing site now renders the surgical-fix redesign from the spec. Each of the 6 AI-design anti-patterns is addressed; the underlying aesthetic (dark, Syne + DM Sans, `--accent` purple + `--accent2` teal) is unchanged.

**Follow-up cleanup (not blocking, file a separate task):** delete the now-unreferenced Lucide SVGs from `assets/icons/`: `pulse.svg`, `target.svg`, `sliders-horizontal.svg`, `clock.svg`, `microphone.svg`, `eye.svg`, `image.svg`, `palette.svg`, `list-checks.svg`, `envelope.svg`. Verify with `grep -nrE "(pulse|target|sliders-horizontal|clock|microphone|eye|image|palette|list-checks|envelope)\.svg" index.html style.css script.js privacy.html terms.html support.html` first — only delete files with zero matches.
