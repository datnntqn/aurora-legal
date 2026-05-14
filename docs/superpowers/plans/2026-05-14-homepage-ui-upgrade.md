# Aurora Homepage UI Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Push the existing Aurora homepage further with three signature motion moments, a frosted-glass icon system, and a baseline polish pass — staying 100% vanilla on GitHub Pages.

**Architecture:** All work lives in the existing three files — `index.html`, `style.css`, `script.js` — with no build step and no dependencies. New CSS appends to `style.css` following its numbered-section convention. New JS joins the existing IIFE in `script.js`. Parallax/scroll effects are driven by one rAF-throttled `passive` scroll listener; in-card animations reuse the existing `data-reveal` → `.in-view` mechanism. The CSS `translate` property (independent of `transform`) is used for parallax so it composes cleanly with existing `transform`-based animations and cursor tilt.

**Tech Stack:** Vanilla HTML5 / CSS3 / JS (ES5-compatible IIFE). No framework, no bundler. Deployed via GitHub Pages from the repo root.

**Source spec:** `docs/superpowers/specs/2026-05-14-homepage-ui-upgrade-design.md`

**Branch:** Recommended to work on a feature branch (e.g. `ui-upgrade`) and merge to `main` when verified, since `main` auto-deploys to GitHub Pages. The first step of Chunk 1 creates it.

**Verification note:** This repo has no automated test suite. "Verify" steps mean: run a local server (`python3 -m http.server 8080`) and inspect in a browser, and/or use the `document-skills:webapp-testing` skill (Playwright) for screenshots and console-error checks. Each task ends with a commit.

---

## File Structure

| File | Responsibility | Changes |
|------|----------------|---------|
| `index.html` | Homepage markup | Wrap feature/section icons in `.icon-tile` spans; add a clock-hand element to the schedule bento mockup. |
| `style.css` | All styling | Remove dead pre-redesign CSS; add `.icon-tile` system; add signature-moment styles + keyframes; depth/motion/type polish; extend the `prefers-reduced-motion` block. |
| `script.js` | Interactivity (single IIFE) | Add a shared rAF-throttled scroll-progress engine; register hero parallax + phone float; convert the compare slider's one-time auto-demo into a scroll-scrub effect. |

(The `style.css` row's reduced-motion work is a *new* `@media (prefers-reduced-motion: reduce)` block — none exists today; see Chunk 3, Task 8.)
| `privacy.html` / `terms.html` / `support.html` | Legal pages | Not edited — only checked for regressions after the `style.css` dead-CSS removal. |

---

## Chunk 1: Foundation — cleanup & icon system

Establishes a clean baseline (removes dead CSS) and the frosted-glass icon tile system that the rest of the work depends on.

### Task 1: Dead-CSS cleanup

Remove pre-redesign CSS that no current HTML file references. **The grep result is authoritative — never delete a selector that grep finds in any `.html` file.** Several selectors in the legacy regions ARE still used (`.cta-app-store`, `.cta-secondary`, `.feat-icon`, `.wiki-link`) — these must be kept.

**Files:**
- Modify: `style.css` — legacy rules cluster in §6 (~132–245), §9 (~297–478), §10 (the `.demo-*` / `.iphone` rules span ~479–693, interleaved through what the section comments label §10 and §11), §11 (the `.wiki-*` rules ~569–664), but **dead selectors also appear elsewhere**: a duplicate `.siri-*` block under a `/* Siri orb */` comment (~980–1003) and dead selectors (`.trust-strip`, `.hero-phone-stack`, `.iphone-screen`) inside the §17 `@media (max-width: 600px)` block (~888–891). The grep in Step 2 is the authoritative scope — delete every dead rule wherever it appears.

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b ui-upgrade
```

- [ ] **Step 2: Grep-verify each candidate dead selector**

Check whether each selector appears as a whole class token in any HTML file. **Do not use `\b` word boundaries — `\b` matches at hyphens, so `\bhero-title\b` falsely matches `hero-title-v2`.** A class token is bounded by a quote or whitespace, so match on `[" ]`.

The repo's default shell is zsh, where the bare `$sel[...]` in the grep pattern is misparsed as an array subscript. **Run the snippet through `bash` explicitly** (the heredoc below does that — paste it as-is):

```bash
bash <<'SH'
# Candidate list = exactly the Step 3 deletion list, plus the four
# "must keep" selectors as a sanity check.
for sel in \
  hero-orb hero-orb-1 hero-orb-2 hero-inner hero-title hero-sub \
  trust-strip trust-chip hero-cta hero-phone-stack hero-phone hero-phone-left hero-phone-right \
  ios-grid ios-feat ios-feat-live ios-feat-focus ios-feat-cc ios-feat-sched ios-feat-siri ios-feat-wide \
  feat-tag feat-h3 feat-desc phone-mini phone-mini-tall phone-mini-notch phone-mini-screen \
  schedule-viz schedule-clock schedule-sun schedule-moon schedule-center \
  siri-screen siri-prompt siri-response siri-orb-img \
  demo-phone-wrap iphone iphone-notch iphone-screen demo-banner safari-bar url-pill safari-content \
  demo-btn demo-controls demo-caption \
  wiki-title wiki-sub wiki-infobox wiki-img-placeholder wiki-img-caption wiki-table wiki-toc wiki-toc-title wiki-p wiki-section-h \
  cta-app-store cta-secondary feat-icon wiki-link wiki-link-red; do
    hits=$(grep -rlE "[\" ]$sel[\" ]" index.html privacy.html terms.html support.html 2>/dev/null)
    echo "$sel -> ${hits:-DEAD}"
done
SH
```

Expected output: **exactly four** selectors print a file path — `cta-app-store`, `cta-secondary`, `feat-icon`, `wiki-link`. **Every other selector — including `hero-title`, `hero-sub`, `hero-cta`, `hero-phone`, and `wiki-link-red` — must print `DEAD`.** If any selector other than those four prints a path, stop and investigate before deleting anything.

- [ ] **Step 3: Remove the confirmed-dead CSS rules**

Delete every CSS rule whose selector printed `DEAD` in Step 2 — **wherever it appears in `style.css`, including inside `@media` blocks and any duplicate definitions** (the grep result is the authoritative scope, not the section ranges). After deleting, re-run a quick check that none of the dead selectors remain anywhere: `grep -nE '\.(hero-orb|trust-strip|hero-phone-stack|ios-feat|iphone|siri-screen|siri-orb-img|wiki-title|demo-btn)\b' style.css` should return nothing. (`\b` is fine here — this greps CSS rule text, not HTML class attributes, and none of these sampled selectors have a hyphen-suffixed live sibling.)

The dead rules cluster as follows (a guide, not an exhaustive location map):
- §6: `.hero-orb`, `.hero-orb-1`, `.hero-orb-2`, `.hero-inner`, `.hero-title`, `.hero-sub`, `.trust-strip`, `.trust-chip`, `.trust-chip strong`, `.trust-chip span`, `.hero-cta`, `.hero-phone-stack`, `.hero-phone`, `.hero-phone-left`, `.hero-phone-right`. **Keep** `.cta-app-store`, `.cta-app-store::after`, `.cta-secondary`, `.cta-secondary:hover` (used by the v2 hero).
- §9 (entire "9. Feature card" region): `.ios-grid`, all `.ios-feat*`, `.feat-tag`, `.feat-h3`, `.feat-desc`, `.phone-mini*`, `.schedule-*`, `.siri-screen`, `.siri-prompt`, `.siri-response`, `.siri-orb-img`. **Keep** `.feat-icon` (used by the footer email link in `index.html` and also by the legal pages).
- §10 (entire "10. demo iPhone" region): `.demo-phone-wrap`, `.iphone*`, `.demo-banner`, `.safari-bar`, `.url-pill`, `.safari-content`, `.demo-btn*`, `.demo-controls`, `.demo-caption`.
- §11 (the unused `.wiki-*` rules): `.wiki-title`, `.wiki-sub`, `.wiki-infobox`, `.wiki-img-placeholder`, `.wiki-img-caption`, `.wiki-table`, `.wiki-table td`, `.wiki-toc*`, `.wiki-toc-title`, `.wiki-p`, `.wiki-section-h`, and the `.iphone.dark .wiki-*` variants of those (all dead — they were compound selectors on the now-removed `.iphone`). **Keep:** `.wiki-link` (grep-confirmed used in the legal pages) and `.wiki-link-red` (grep-dead, but kept as the companion "red link" style per the spec). Also keep `.iphone.dark .wiki-link` / `.iphone.dark .wiki-link-red` per the spec — note these are now inert (`.iphone` no longer exists in any HTML) but are harmless and the spec explicitly calls for retaining them.
- **Outside the §-clusters:** a duplicate `.siri-screen` / `.siri-screen::after` / `.siri-prompt` / `.siri-response` / `.siri-orb-img` block under a `/* Siri orb */` comment (~lines 980–1003), and the `.trust-strip`, `.hero-phone-stack`, `.iphone-screen` declarations inside the §17 `@media (max-width: 600px)` block (~lines 888–891). Delete these too — they printed `DEAD` in Step 2.

Renumber the remaining `/* ---------- N. ... */` section comments if convenient, or leave them; cosmetic only.

- [ ] **Step 4: Verify no regressions**

Run `python3 -m http.server 8080`. In a browser open `index.html`, `privacy.html`, `terms.html`, `support.html`. Confirm: homepage hero, App Store badge, footer email icon all still styled; legal pages still have styled inline links (`.wiki-link`). Check the browser console for errors. Optionally use `document-skills:webapp-testing` to screenshot all four pages.

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "Remove dead pre-redesign CSS"
```

### Task 2: Frosted-glass icon tile system

Introduce one reusable `.icon-tile` class — a rounded glass tile with a colored glow — and apply it to every feature/section icon: the 5 bento card icons, the 4 eye-care icons, and the footer email icon.

**Files:**
- Modify: `style.css` (add a new section after the "Features row (eye-care)" region, ~line 1874; restyle `.feature-mini-icon` ~line 1852)
- Modify: `index.html` (bento `<img class="bento-icon-svg">` icons ~lines 244, 271, 297, 320, 340; eye-care `.feature-mini-icon` divs ~lines 363, 368, 373, 378; footer `.feat-icon` ~line 465)

- [ ] **Step 1: Add the `.icon-tile` CSS**

Append a new section to `style.css` immediately after the "Features row (eye-care)" region (which ends ~line 1874, just before "Pricing V2"):

```css
/* ---------- Frosted-glass icon tiles ---------- */
.icon-tile {
  --tile-glow: rgba(123, 140, 255, 0.55);
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(150deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow:
    0 6px 20px -6px rgba(80,140,255,0.45),
    inset 0 1px 0 rgba(255,255,255,0.18);
}
.icon-tile::before {
  content: "";
  position: absolute;
  inset: -35%;
  z-index: -1;
  background: radial-gradient(circle at 30% 25%, var(--tile-glow), transparent 62%);
  filter: blur(12px);
}
.icon-tile img,
.icon-tile svg {
  width: 22px;
  height: 22px;
  filter: invert(1) brightness(1.5);
}
/* Per-section glow colors — match existing accent assignments */
.icon-tile-live  { --tile-glow: rgba(139,92,246,0.55); }
.icon-tile-focus { --tile-glow: rgba(236,72,153,0.55); }
.icon-tile-cc    { --tile-glow: rgba(6,182,212,0.55); }
.icon-tile-sched { --tile-glow: rgba(245,158,11,0.55); }
.icon-tile-siri  { --tile-glow: rgba(16,185,129,0.55); }
.icon-tile-sm { width: 26px; height: 26px; border-radius: 9px; }
.icon-tile-sm img, .icon-tile-sm svg { width: 14px; height: 14px; }
```

- [ ] **Step 2: Wrap the bento card icons in `index.html`**

For each of the 5 bento `<h3 class="bento-h">` headings, wrap the `<img class="bento-icon-svg">` in an `.icon-tile` span with the matching modifier. Example for Live Activity:

```html
<h3 class="bento-h">
  <span class="icon-tile icon-tile-live">
    <img src="assets/icons/pulse.svg" class="bento-icon-svg" alt="">
  </span>
  Live Activity
</h3>
```

Apply the same pattern to: Focus Filter (`icon-tile-focus`, `target.svg`), Control Center (`icon-tile-cc`, `sliders-horizontal.svg`), Auto Schedule (`icon-tile-sched`, `clock.svg`), Siri & Shortcuts (`icon-tile-siri`, `microphone.svg`).

- [ ] **Step 3: Restyle `.feature-mini-icon` as an icon tile**

First read the current `.feature-mini-icon` rule (~lines 1852–1858) and `.feature-mini-icon img` to see exactly what it declares. It currently sets `width/height: 48px`, `border-radius: 12px`, `display: flex`, `align-items/justify-content: center`, and `margin-bottom: 14px`.

Add the `icon-tile` class to each of the 4 `.feature-mini-icon` divs in `index.html` (eye-care section), so they become `<div class="feature-mini-icon icon-tile eye-gradient">` etc. Then in `style.css` change the existing gradient classes to set the glow variable instead of a flat background:

```css
/* was: .eye-gradient { background: linear-gradient(...); } — now drives the tile glow */
.eye-gradient   { --tile-glow: rgba(6,182,212,0.6); }
.image-gradient { --tile-glow: rgba(236,72,153,0.6); }
.palette-gradient { --tile-glow: rgba(245,158,11,0.6); }
.list-gradient  { --tile-glow: rgba(16,185,129,0.6); }
```

Delete the now-redundant `width`, `height`, `border-radius`, `display`, `align-items`, `justify-content` declarations from `.feature-mini-icon` (the `.icon-tile` class supplies them); keep only `margin-bottom: 14px` on `.feature-mini-icon`. Delete the `.feature-mini-icon img` rule and let `.icon-tile img` apply instead.

- [ ] **Step 4: Wrap the footer email icon**

In `index.html` footer (~line 465), wrap the `.feat-icon` img in `<span class="icon-tile icon-tile-sm">…</span>`.

- [ ] **Step 5: Verify**

Run the local server. Confirm all 10 icons render as consistent frosted-glass tiles with the correct per-section glow color, are vertically aligned with their text, and look correct on a narrow (mobile) viewport. Check the console for errors.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css
git commit -m "Add frosted-glass icon tile system"
```

---

## Chunk 2: Signature moments

The three showstopper interactions. Task 3 builds the shared scroll engine that Tasks 3 and 4 both consume.

> **Note on reduced-motion:** Chunk 2 introduces pre-reveal hidden states (`opacity: 0` on the bento pill/orb, `scale` on the CC tile). The full `prefers-reduced-motion` fallback that makes these visible in their final static state is added in **Chunk 3, Task 8**. If you test Chunk 2 in isolation with "Reduce motion" enabled, those elements will appear hidden until Task 8 lands — this is expected mid-plan, not a bug.

### Task 3: Shared scroll-progress engine + living hero

Add one rAF-throttled `passive` scroll listener that drives all scroll effects, then register the living-hero parallax (mesh, grain, glow drift at different speeds) and the phone float. Parallax uses the CSS `translate` property so it composes with the existing `transform`-based `mesh-drift` animation and the JS cursor tilt.

**Files:**
- Modify: `script.js` (add inside the existing IIFE, after the "Sticky nav state" block)
- Modify: `style.css` (hero-v2 region ~lines 1067–1320)

- [ ] **Step 1: Add the shared scroll engine to `script.js`**

Insert after the sticky-nav block (~line 18), before the scroll-reveal block:

```javascript
  // ---------- Shared scroll-progress engine ----------
  // One rAF-throttled passive listener. Effects register a callback
  // that receives (scrollY, viewportHeight) each frame.
  const scrollEffects = [];
  let scrollTicking = false;
  const runScrollEffects = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    for (let i = 0; i < scrollEffects.length; i++) scrollEffects[i](y, vh);
    scrollTicking = false;
  };
  const requestScrollTick = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(runScrollEffects);
    }
  };
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', requestScrollTick, { passive: true });
    window.addEventListener('resize', requestScrollTick, { passive: true });
  }
```

- [ ] **Step 2: Register the living-hero parallax effect**

Add after the scroll engine block in `script.js`:

```javascript
  // ---------- Living hero — parallax + phone float ----------
  const heroEl = document.getElementById('hero');
  if (heroEl && !prefersReducedMotion) {
    scrollEffects.push((y) => {
      // Only meaningful while the hero is on/near screen.
      heroEl.style.setProperty('--mesh-shift',  (y * 0.12) + 'px');
      heroEl.style.setProperty('--grain-shift', (y * 0.28) + 'px');
      heroEl.style.setProperty('--glow-shift',  (y * 0.06) + 'px');
      heroEl.style.setProperty('--phone-float', (y * -0.05) + 'px');
    });
    requestScrollTick(); // set initial values
  }
```

- [ ] **Step 3: Wire the parallax variables into the hero CSS**

In `style.css`, add a `translate` declaration to each hero layer (the `translate` property is independent of `transform`, so it composes with the existing `mesh-drift` / `float` animations and the cursor tilt):

```css
.hero-mesh        { translate: 0 var(--mesh-shift, 0); }
.hero-grain       { translate: 0 var(--grain-shift, 0); }
.hero-glow        { translate: 0 var(--glow-shift, 0); }
.hero-phone-large { translate: 0 var(--phone-float, 0); }
```

Add these as new lines within the respective existing rule blocks (do not create duplicate selectors).

- [ ] **Step 4: Refine the hero mesh animation**

The spec asks for a "slow-drifting animated aurora gradient mesh." The `mesh-drift` keyframes already exist; enhance the perceived life by also animating the gradient. In `style.css`, update `.hero-mesh` to add a second, slower animation that shifts a hue/position (keep `mesh-drift`):

```css
/* in the existing .hero-mesh rule, replace the animation line: */
animation: mesh-drift 20s ease-in-out infinite, mesh-breathe 14s ease-in-out infinite alternate;
```

And add the keyframes near `@keyframes mesh-drift`:

```css
@keyframes mesh-breathe {
  from { filter: blur(60px) saturate(1.2) hue-rotate(0deg); }
  to   { filter: blur(70px) saturate(1.35) hue-rotate(18deg); }
}
```

- [ ] **Step 5: Verify**

Run the local server, open `index.html`. Scroll slowly: the mesh, grain, and glow should drift at visibly different speeds; the phone should float gently counter to scroll. Move the cursor over the phone — the existing tilt should still work and compose with the float (no snapping/jumping). Confirm the headline word-rise animation still plays on load.

- [ ] **Step 6: Commit**

```bash
git add script.js style.css
git commit -m "Add scroll engine and living-hero parallax"
```

### Task 4: Scroll-scrubbed comparison

Replace the compare slider's one-time auto-demo sweep with a scroll-scrub: scroll progress through the `#features` section drives the divider from all-light to all-dark. Drag and click-to-jump still work; while the user is dragging, scroll-scrub is suppressed and resumes on release.

**Files:**
- Modify: `script.js` (the "Compare slider" block, ~lines 96–151)

- [ ] **Step 1: Remove the auto-demo IntersectionObserver block**

In `script.js`, delete the "Subtle auto-demo" block (~lines 131–150 — the `demoObserver` that sweeps the slider once). The scroll-scrub replaces it.

- [ ] **Step 2: Register the scroll-scrub effect**

Inside the existing `if (compare && handle && darkSide) { … }` block, after the click handler, add:

```javascript
    // Scroll-scrub: scroll progress through #features drives the divider.
    // Window (per spec): divider fully left when the section top reaches the
    // viewport bottom; fully right by the time the section is vertically
    // centered; holds at all-dark afterward. Suppressed while dragging.
    if (!prefersReducedMotion) {
      scrollEffects.push((y, vh) => {
        if (isDragging) return;
        const rect = compare.getBoundingClientRect();
        const start = vh;                              // top === viewport bottom -> p=0
        const end = vh / 2 - rect.height / 2;          // section centered      -> p=1
        let p = (start - rect.top) / (start - end);
        p = Math.max(0, Math.min(1, p));
        const pct = (p * 100) + '%';
        darkSide.style.width = pct;
        handle.style.left = pct;
      });
      requestScrollTick();
    }
```

- [ ] **Step 3: Verify**

Run the local server. Scroll the `#features` section into view: the divider should sweep light→dark as the section moves toward center, then hold at full dark. Then grab the handle and drag — drag should take over smoothly; release and continue scrolling — scroll-scrub resumes. **Expected (not a bug):** on the first scroll frame after releasing a drag, the divider snaps from the dragged position to the scroll-computed position — this is the intended "scroll-scrub resumes once released" behavior from the spec. Click elsewhere on the image — handle jumps there (the next scroll frame then re-takes control). Resize the window and confirm the scrub still tracks. Check the console for errors.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "Convert compare slider auto-demo to scroll-scrub"
```

### Task 5: Animated bento mockups

Add scroll-triggered, staggered animations *inside* each bento card's mockup, reusing the existing `data-reveal` → `.in-view` class already applied to every `.bento-card` (no new JS needed). Adds one small markup element: a clock hand for the schedule mockup.

**Files:**
- Modify: `style.css` (Bento region — add keyframes + `.in-view`-triggered rules)
- Modify: `index.html` (add one clock-hand element to the schedule bento mockup, ~line 327)

- [ ] **Step 1: Add a clock hand to the schedule mockup in `index.html`**

Inside `<div class="bento-clock">` (~line 327), add as the first child:

```html
<div class="bento-clock-hand"></div>
```

- [ ] **Step 2: Add the bento animation CSS**

Append to the Bento region of `style.css`:

```css
/* ---------- Bento mockup reveal animations ---------- */
/* All triggered by the existing data-reveal -> .in-view on .bento-card.
   Default (pre-reveal) state is set here; .in-view plays the animation. */

/* Live Activity: pill slides into the Dynamic Island */
.bento-card-live .bento-island-pill {
  opacity: 0;
  transform: translateX(26px);
}
.bento-card-live.in-view .bento-island-pill {
  animation: bento-pill-in 0.55s cubic-bezier(0.22,0.61,0.36,1) 0.35s forwards;
}
@keyframes bento-pill-in {
  to { opacity: 1; transform: translateX(0); }
}

/* Control Center: the Aurora tile lights up, then keeps its pulse-glow */
.bento-card-cc .bento-cc-aurora {
  opacity: 0.35;
  transform: scale(0.9);
}
.bento-card-cc.in-view .bento-cc-aurora {
  animation:
    bento-cc-in 0.5s cubic-bezier(0.22,0.61,0.36,1) 0.3s forwards,
    pulse-glow 2s ease-in-out 0.8s infinite;
}
@keyframes bento-cc-in {
  to { opacity: 1; transform: scale(1); }
}

/* Schedule: clock hand sweeps sunset -> night */
.bento-clock-hand {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 46%;
  background: linear-gradient(var(--brand-yellow), transparent);
  transform-origin: top center;
  transform: translateX(-50%) rotate(0deg);
  border-radius: 2px;
}
.bento-card-sched.in-view .bento-clock-hand {
  animation: bento-clock-sweep 1.4s cubic-bezier(0.4,0,0.2,1) 0.3s forwards;
}
@keyframes bento-clock-sweep {
  from { transform: translateX(-50%) rotate(0deg); }
  to   { transform: translateX(-50%) rotate(180deg); }
}

/* Siri: orb scales to life (orb-pulse keeps running afterward) */
.bento-card-siri .bento-siri-orb {
  opacity: 0;
  transform: scale(0.6);
}
.bento-card-siri.in-view .bento-siri-orb {
  animation:
    bento-orb-in 0.5s cubic-bezier(0.22,0.61,0.36,1) 0.3s forwards,
    orb-pulse 2s ease-in-out 0.8s infinite;
}
@keyframes bento-orb-in {
  to { opacity: 1; transform: scale(1); }
}
```

**Important — two existing always-on animations must be moved into the `.in-view` rules so they aren't lost** (the `.in-view` rules above use the `animation` shorthand, which fully replaces any existing `animation` on the element):

- `.bento-siri-orb` (base rule, ~line 1832) currently sets `animation: orb-pulse 2s ease-in-out infinite;` — **delete that declaration** from the base rule. The `.bento-card-siri.in-view .bento-siri-orb` rule above re-adds `orb-pulse` after the intro.
- `.bento-cc-aurora` (base rule, ~line 1735) currently sets `animation: pulse-glow 2s infinite;` — **delete that declaration** from the base rule. The `.bento-card-cc.in-view .bento-cc-aurora` rule above re-adds `pulse-glow` after the intro.

The Focus Filter card's `.bento-focus-row` (`animation: pulse-glow 3s infinite`) and the Live Activity `.bento-live-dot` (`animation: pulse-dot 2s infinite`) are not touched by any reveal rule, so they keep running as-is and need no changes.

- [ ] **Step 3: Verify**

Run the local server. Scroll each bento card into view: the Live Activity pill slides into the island, the Control Center Aurora tile lights up, the schedule clock hand sweeps a half-circle, the Siri orb pops in then keeps pulsing. Scroll back up and down — animations should not re-fire jarringly (the `data-reveal` observer unobserves after first reveal, which is the intended behavior). Check the console.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "Add animated bento mockup reveals"
```

---

## Chunk 3: Baseline polish & verification

The consistent layer that lifts the whole page, plus the final reduced-motion and regression sweep.

### Task 6: Depth & surface refinement

Refine gradients, glow, shadows, and grain so surfaces feel layered rather than flat. Targets the card surfaces and dark sections.

**Files:**
- Modify: `style.css` (`.bento-card`, `.feature-mini`, `.price-card-v2`, dark section backgrounds)

- [ ] **Step 1: Deepen the card surfaces**

In `style.css`, give the three card surfaces a softer multi-stop background plus an inner highlight and a longer ambient shadow. Replace the `background` line in the existing `.bento-card` rule and add the `box-shadow`:

```css
/* in .bento-card — replace its `background:` line, add `box-shadow:` */
  background: linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015));
  box-shadow:
    0 1px 0 rgba(255,255,255,0.06) inset,
    0 24px 50px -24px rgba(0,0,0,0.7);
```

```css
/* in .feature-mini — replace `background: var(--bg-card);` with the gradient, add box-shadow */
  background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012));
  box-shadow:
    0 1px 0 rgba(255,255,255,0.06) inset,
    0 18px 40px -22px rgba(0,0,0,0.65);
```

```css
/* in .price-card-v2 — keep its existing gradient `background`, add box-shadow */
  box-shadow:
    0 1px 0 rgba(255,255,255,0.08) inset,
    0 40px 80px -30px rgba(0,0,0,0.75);
```

- [ ] **Step 2: Add a faint grain over dark sections**

Add a reusable grain overlay so dark sections do not look flat. Append to `style.css`:

```css
/* Faint grain overlay for dark sections (opt-in via .has-grain) */
.has-grain { position: relative; }
.has-grain > .container { position: relative; z-index: 1; }
.has-grain::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Then add the `has-grain` class to the dark section elements in `index.html`: `.section-ios`, `.section-eyecare`, `.section-faq` (and `.section-demo` if it reads flat). **Before relying on the `.has-grain > .container` z-index lift, confirm each of those `<section>` elements has a direct child `<div class="container">`** (check `index.html` — they do today, but verify). If a section's structure differs, adjust the selector so the content still sits above the `::before` grain layer.

- [ ] **Step 3: Unify section accent glows**

Confirm each section's accent color is used consistently for its card glow / `::before` (the bento `::before` accent map already exists; ensure the eye-care and pricing glows use the same `--brand-*` tokens). Adjust any mismatched hardcoded colors to the `--brand-*` tokens.

- [ ] **Step 4: Verify**

Run the local server. Cards should read as layered (subtle top highlight, soft deep shadow); dark sections should have a faint texture, not flat black. Confirm text contrast is unaffected and the grain does not sit above any interactive element. Screenshot desktop + mobile via `document-skills:webapp-testing`.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "Refine surface depth and add section grain"
```

### Task 7: Motion polish on existing interactions + type rhythm

Refine the existing interaction systems (`data-reveal`, `data-tilt`, `data-magnetic`, hover states) and tighten typographic rhythm. No new JS — only easing/transition/spacing refinements.

**Files:**
- Modify: `style.css` (reveal/transition rules, `.bento-card:hover`, `.faq-item`, `.nav-links a`, buttons, `.marquee`, section title spacing)

- [ ] **Step 1: Refine reveal + hover easing**

In `style.css`, find the `[data-reveal]` / `.in-view` transition rule and standardize the easing to `cubic-bezier(0.22, 0.61, 0.36, 1)` with a slightly longer travel (e.g. `translateY(28px)` → `0`). Add explicit `transition` easing to `.bento-card`, `.feature-mini`, `.faq-item`, and `.nav-links a` hover states so they ease in and out consistently.

- [ ] **Step 2: Add hover + press states**

Add a `.bento-card:hover` lift (`transform: translateY(-3px)`). Note the bento cards also carry `data-tilt`, whose JS writes `transform` directly on `pointermove` and clears it on `pointerleave` — so the JS transform overrides the CSS hover lift while the pointer moves, and the lift shows in the brief window before the first `pointermove`. Verify visually that this composes acceptably; if it flickers, drop the CSS lift on `.bento-card` and rely on tilt alone. Add a subtle `:active` press (`transform: scale(0.98)`) to `.nav-download`, `.price-cta`, and `.cta-app-store`. Add a hover background/translate to `.faq-item summary`.

- [ ] **Step 3: Refine the marquee edge fade**

`.marquee` (~line 1340) **already has** `mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent)`. Do not add a duplicate rule — instead, edit the existing `.marquee` rule: add the `-webkit-` prefixed version for Safari support and tighten the stops slightly. The `.marquee` rule's mask declarations should end up as:

```css
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
```

- [ ] **Step 4: Tighten type rhythm**

Review `.section-title-v2`, `.section-eyebrow`, `.section-sub-v2`, and `.section-v2` padding for consistent vertical rhythm. Apply consistent `letter-spacing` on eyebrows and ensure gradient-text accent usage (`.gradient-text`, `.section-title-v2 em`) is consistent across sections. Make spacing changes via the existing rules — do not add new wrapper elements.

- [ ] **Step 5: Verify**

Run the local server. Hover bento cards, FAQ items, nav links, and buttons — all should have smooth, consistent feedback and a press state on buttons. The marquee should fade at both edges. Scroll the page — reveals should feel smooth and consistent. Confirm `data-tilt` on bento cards still works alongside the new hover lift.

- [ ] **Step 6: Commit**

```bash
git add style.css
git commit -m "Polish interaction motion and type rhythm"
```

### Task 8: Reduced-motion audit + full verification

Ensure every new effect has a clean static fallback, then do the full cross-page / cross-viewport / performance sweep from the spec's Section 4.

**Files:**
- Modify: `style.css` (the `prefers-reduced-motion` media block)

- [ ] **Step 1: Create the reduced-motion CSS block**

There is **no `@media (prefers-reduced-motion: reduce)` block in `style.css` today** — reduced-motion is currently handled only in `script.js` (which gates the scroll engine, hero cycle, count-up, tilt, and magnetic effects). So this step creates the CSS block from scratch. It must neutralize **every** CSS animation in the file — the pre-existing ones (`mesh-drift`, `word-rise`, `gradient-shift`, `orb-pulse`, `pulse-glow`, `pulse-dot`, `float`, `marquee`, `sweep`, and any others still referenced after the Chunk 1 cleanup) **and** the ones added by this plan (`mesh-breathe`, `bento-pill-in`, `bento-cc-in`, `bento-clock-sweep`, `bento-orb-in`).

First, list every animation still in use so nothing is missed:

```bash
grep -nE "animation:|animation-name:|@keyframes" style.css
```

Then append this block at the end of `style.css`. It uses the standard global neutralization pattern (which covers every current and future animation/transition in one rule) plus explicit final-state restores for the elements this plan leaves hidden in their base rule:

```css
/* ---------- Reduced-motion fallbacks ---------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  /* Parallax vars are never set (the JS scroll listener is gated off), so the
     hero layers already sit static. The bento reveal elements have opacity:0 /
     transform in their *base* rule — force their final visible state here in
     case the .in-view animation doesn't resolve. */
  .bento-card-live .bento-island-pill,
  .bento-card-siri .bento-siri-orb,
  .bento-card-cc .bento-cc-aurora {
    opacity: 1 !important;
    transform: none !important;
  }
  .bento-clock-hand { transform: translateX(-50%) rotate(180deg) !important; }
}
```

If the `grep` reveals an animation whose `forwards` end-state is *not* its visible/intended resting state (so the global pattern would leave it wrong), add an explicit restore for that element here. Note: `.bento-card-cc.in-view .bento-cc-aurora` and `.bento-card-siri.in-view .bento-siri-orb` are higher-specificity than the restore selectors above, but they only set `animation` (neutralized by the global rule) — they do not set `opacity`/`transform`, so the restores still win for those properties.

- [ ] **Step 2: Reduced-motion verification**

In the browser, enable "Reduce motion" (macOS: System Settings → Accessibility → Display → Reduce motion, or DevTools rendering emulation). Reload `index.html`. Confirm: no parallax, no scrub animation (slider sits at its default 50%), no bento intro animations — but every section is fully visible with content in its final state (no permanently-hidden pills/orbs). No layout breakage.

- [ ] **Step 3: Cross-page regression check**

With reduce-motion off, open `index.html`, `privacy.html`, `terms.html`, `support.html`. Confirm the legal pages are unaffected by the `style.css` changes and `.wiki-link` styling is intact. Watch the console for errors on every page.

- [ ] **Step 4: Cross-viewport visual pass**

Walk the full homepage at a desktop width (~1280px) and a phone width (~390px). Confirm: the three signature moments behave, the glass icon tiles render consistently, nothing overflows or jumps, the bento grid reflows correctly. Use `document-skills:webapp-testing` to capture before/after screenshots at both widths.

- [ ] **Step 5: Performance sanity**

In DevTools, throttle CPU (4–6×) and scroll the full page. Confirm the scroll handler stays smooth (no long frames piling up) and stacked `blur`/`backdrop-filter` layers don't tank the framerate. If a section janks, reduce blur radius or the number of simultaneously-blurred layers in that section.

- [ ] **Step 6: Commit**

```bash
git add style.css
git commit -m "Add reduced-motion fallbacks for new effects"
```

- [ ] **Step 7: Finish the branch**

Use the `superpowers:finishing-a-development-branch` skill to decide how to integrate `ui-upgrade` into `main` (merge / PR). Once merged to `main`, GitHub Pages redeploys automatically.

---

## Done criteria

- All four HTML pages load with no console errors.
- The three signature moments work and degrade cleanly under `prefers-reduced-motion`.
- All feature/section icons use the consistent frosted-glass tile.
- No dead pre-redesign CSS remains; `.wiki-link` and other still-used legacy selectors are intact.
- Homepage is smooth at desktop and mobile widths under CPU throttling.
- Deploy flow is unchanged: merge to `main` → GitHub Pages.
