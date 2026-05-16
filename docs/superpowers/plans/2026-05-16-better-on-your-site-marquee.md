# "Better on your site" Marquee Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the horizontally-scrolling supported-sites marquee that was removed in commit `62f7650`, in its original slot, with refreshed editorial copy ("Better on your site" + hand-tuned subhead) and a new `prefers-reduced-motion` guard.

**Architecture:** Pure HTML + CSS edit to two existing files. No JS, no new assets, no build step. Section is a single `<section class="marquee-section">` with one `<div class="marquee-track">` containing 28 `<span>` elements (14 sites + 14 duplicates) animated by a `transform: translateX(-50%)` keyframe. The duplicate-list trick gives the seamless loop.

**Tech Stack:** Static HTML5, vanilla CSS, CSS custom properties (already-defined tokens in `style.css`), CSS `@media (prefers-reduced-motion: reduce)`.

**Spec:** `docs/superpowers/specs/2026-05-16-better-on-your-site-marquee-design.md`

---

## File Structure

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | Modify (insert at line 126) | New `<section class="marquee-section">` between hero `</header>` and the manifesto strip. |
| `style.css` | Modify (insert at line 620) | New `.marquee-section` / `.marquee-label` / `.marquee-sub` / `.marquee` / `.marquee-track` rules + `@keyframes marquee` + `prefers-reduced-motion` guard. |

No new files. No deletions.

## Verification approach (no test framework)

This is a static site with no automated test runner. Verification is browser-based. For each task, the agent opens `index.html` directly in a browser (`open index.html` on macOS) and visually confirms the documented behavior. The plan calls out exactly what to look for.

---

## Task 1: Add the marquee section (HTML + base CSS)

**Files:**
- Modify: `index.html:125-128` (insert new section between `</header>` on line 125 and `<!-- MANIFESTO …` on line 127)
- Modify: `style.css:619-620` (insert new rule block immediately before `/* ---------- Section V2 typography ---------- */` on line 620)

- [ ] **Step 1: Confirm the current "before" state in a browser**

Run: `open /Users/datnnt/Desktop/DatNNT/App/AuroraDarkMode/safari-legal/index.html`

Expected: Page loads. Below the hero (the dark page with the three "theme cards" — Dark Blue / Sepia / Forest), the next thing visible is the manifesto strip ("01 No subscription. Ever. / 02 … / 03 …"). There is **no** scrolling list of site names between them.

- [ ] **Step 2: Insert the HTML section**

In `index.html`, locate this exact span (lines 125–128):

```html
</header>

<!-- MANIFESTO — three refusals -->
```

Insert a new block between `</header>` and the `<!-- MANIFESTO` comment so it becomes:

```html
</header>

<!-- BETTER ON YOUR SITE — supported-sites marquee -->
<section class="marquee-section">
  <p class="marquee-label">Better on your site</p>
  <p class="marquee-sub">Aurora themes every site you read — these are the ones we tune by hand.</p>
  <div class="marquee">
    <div class="marquee-track">
      <span>Wikipedia</span><span>·</span>
      <span>YouTube</span><span>·</span>
      <span>Google</span><span>·</span>
      <span>Reddit</span><span>·</span>
      <span>Twitter / X</span><span>·</span>
      <span>Amazon</span><span>·</span>
      <span>Medium</span><span>·</span>
      <span>The New York Times</span><span>·</span>
      <span>CNN</span><span>·</span>
      <span>Pinterest</span><span>·</span>
      <span>IMDb</span><span>·</span>
      <span>Walmart</span><span>·</span>
      <span>Etsy</span><span>·</span>
      <span>Slack</span><span>·</span>
      <!-- duplicate for seamless loop -->
      <span>Wikipedia</span><span>·</span>
      <span>YouTube</span><span>·</span>
      <span>Google</span><span>·</span>
      <span>Reddit</span><span>·</span>
      <span>Twitter / X</span><span>·</span>
      <span>Amazon</span><span>·</span>
      <span>Medium</span><span>·</span>
      <span>The New York Times</span><span>·</span>
      <span>CNN</span><span>·</span>
      <span>Pinterest</span><span>·</span>
      <span>IMDb</span><span>·</span>
      <span>Walmart</span><span>·</span>
      <span>Etsy</span><span>·</span>
      <span>Slack</span>
    </div>
  </div>
</section>

<!-- MANIFESTO — three refusals -->
```

The site list and "duplicate for seamless loop" pattern are byte-identical to what commit `62f7650` removed; the only intentional differences from the deleted block are (1) the new section comment, (2) the label text ("Better on your site" instead of "Optimized for the sites you use most"), and (3) the new `<p class="marquee-sub">` element.

- [ ] **Step 3: Reload in browser and confirm HTML is in place but unstyled**

Run: `open /Users/datnnt/Desktop/DatNNT/App/AuroraDarkMode/safari-legal/index.html` (or just reload the existing tab)

Expected: Between hero and manifesto, an unstyled blob of text appears showing "Better on your site", "Aurora themes every site you read — these are the ones we tune by hand.", followed by the site list wrapping across the page width. No scrolling animation yet. This is correct mid-task state.

- [ ] **Step 4: Insert the CSS rules**

In `style.css`, locate line 620:

```css
/* ---------- Section V2 typography ---------- */
```

Insert this block immediately above it (so the new block sits between the existing `.tc-bar.t { width: 40%; }` rule on line 619 and the `Section V2 typography` comment, which becomes line 656 or so):

```css
/* ---------- Marquee ---------- */
.marquee-section {
  background: var(--bg-base);
  padding: 40px 0;
  border-top: 1px solid var(--border-card);
  border-bottom: 1px solid var(--border-card);
  overflow: hidden;
}
.marquee-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 20px;
}
.marquee-sub {
  font-size: 14px;
  color: var(--text-tertiary);
  text-align: center;
  margin: 0 auto 24px;
  max-width: 520px;
}
.marquee {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
}
.marquee-track {
  display: inline-flex;
  gap: 28px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-tertiary);
  white-space: nowrap;
  animation: marquee 40s linear infinite;
}
@keyframes marquee { to { transform: translateX(-50%); } }
.marquee-track span:nth-child(odd) { color: var(--text-primary); }
```

The five token references (`--bg-base`, `--border-card`, `--text-muted`, `--text-tertiary`, `--text-primary`) all already exist in `style.css` at lines 8, 14, 30, 29, 27 respectively — do not redefine them.

- [ ] **Step 5: Reload and verify the styled marquee**

Run: reload `index.html` in the browser.

Expected, checked in order:
1. The section sits between the hero and the manifesto with a thin horizontal hairline border at top and bottom.
2. Two short centered lines of text appear above the scrolling row:
   - A small uppercase tracked label reading **BETTER ON YOUR SITE** (faint white).
   - A normal-case line reading **Aurora themes every site you read — these are the ones we tune by hand.** (also faint, slightly larger).
3. Below them, the site names scroll continuously from right to left.
4. Site names alternate brightness: odd-position spans (Wikipedia, Google, Twitter / X, Medium, CNN, IMDb, Etsy, …) are bright white; even-position spans (the `·` dividers and the in-between names) are a dimmer grey. (This is the `.marquee-track span:nth-child(odd)` rule.)
5. The left and right edges of the marquee fade into the background (the `mask-image` linear gradient).
6. The animation loops without a visible seam — when "Slack" passes the left edge, "Wikipedia" enters from the right with no gap or jump.
7. The page does **not** show a horizontal scrollbar.

If any of (1)–(7) is wrong, fix before committing. Common causes:
- Seam visible → the duplicate list was not copied verbatim.
- Horizontal scrollbar → `.marquee` is missing `overflow: hidden`.
- No fade at edges → `mask-image` typo.

- [ ] **Step 6: Mobile-width check**

In the browser, resize the window narrow (≤480px) or open DevTools → device toolbar → set width to 375px.

Expected: Label, subhead, and scrolling row all remain legible. The subhead may wrap to two lines (it's capped at 520px max-width, so on narrow viewports the centered text will wrap, which is intended). The marquee continues to scroll. No horizontal page scrollbar.

- [ ] **Step 7: Commit**

```bash
cd /Users/datnnt/Desktop/DatNNT/App/AuroraDarkMode/safari-legal
git add index.html style.css
git commit -m "$(cat <<'EOF'
feat(home): restore "Better on your site" marquee

Brings back the supported-sites scrolling marquee that was removed in
62f7650, in its original slot between hero and manifesto. Editorial
copy ("Better on your site" + hand-tuned subhead) reframes the same
content as curation rather than the generic logo-soup the previous
headline implied.

Spec: docs/superpowers/specs/2026-05-16-better-on-your-site-marquee-design.md
EOF
)"
```

---

## Task 2: Add the prefers-reduced-motion guard

**Files:**
- Modify: `style.css` — append one new `@media` block immediately after the `.marquee-track span:nth-child(odd)` rule added in Task 1.

- [ ] **Step 1: Confirm the current behavior with reduced motion enabled**

On macOS: System Settings → Accessibility → Display → enable **Reduce motion**. Reload `index.html`.

Expected: The marquee still scrolls. (This is the bug we are about to fix — the section is currently motion-only and ignores the OS preference.)

- [ ] **Step 2: Insert the reduced-motion guard**

In `style.css`, locate the rule added in Task 1:

```css
.marquee-track span:nth-child(odd) { color: var(--text-primary); }
```

Immediately after it, append:

```css
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
```

- [ ] **Step 3: Reload and verify the scroll is paused**

With "Reduce motion" still enabled in System Settings, reload `index.html`.

Expected:
- The marquee row is visible but static. No scrolling.
- The label, subhead, and site names are all still readable.
- The first few site names of the un-duplicated list (Wikipedia · YouTube · Google …) are visible at the left edge; the rest extend off-screen to the right (hidden by `overflow: hidden` on `.marquee`).
- The edge fade (mask gradient) still applies.

- [ ] **Step 4: Disable reduced motion and re-verify normal behavior**

Turn off "Reduce motion" in System Settings → reload `index.html`.

Expected: Animation resumes — the marquee scrolls continuously as it did at the end of Task 1.

- [ ] **Step 5: Commit**

```bash
cd /Users/datnnt/Desktop/DatNNT/App/AuroraDarkMode/safari-legal
git add style.css
git commit -m "$(cat <<'EOF'
feat(a11y): pause "Better on your site" marquee when reduced motion is on

Respect OS-level prefers-reduced-motion by setting animation: none on
.marquee-track. Section stays visible (first frame), only the scroll
is suppressed.

Spec: docs/superpowers/specs/2026-05-16-better-on-your-site-marquee-design.md
EOF
)"
```

---

## Task 3: Integration sweep

**Files:** none modified — read-only verification.

- [ ] **Step 1: Full-page sanity scroll**

Reload `index.html`. Scroll from top to bottom of the page.

Expected, in order:
1. Nav
2. Hero (theme stack)
3. **Marquee — "Better on your site"** (new)
4. Manifesto (01 / 02 / 03)
5. Compare slider (`#features`)
6. Made for iOS bento
7. Eye care / BLF
8. Pricing + FAQ
9. Founder footer

No section appears broken, mis-spaced, or off-color compared to before. The marquee sits flush against the hero's bottom edge and the manifesto's top edge (hairline borders touch with no gap).

- [ ] **Step 2: Other pages untouched**

Open `privacy.html`, `terms.html`, `support.html` in the browser.

Expected: Each loads as before. The marquee does **not** appear on any of these pages (it lives in `index.html` only). Footer, header, and content all unchanged.

- [ ] **Step 3: Console clean**

Open browser DevTools → Console tab on `index.html`.

Expected: No new errors or warnings introduced by this change. (Any errors already present before this work are not in scope.)

- [ ] **Step 4: No commit needed**

This task is read-only. If anything failed, return to the relevant task and fix; otherwise the work is complete.

---

## Done definition

- `index.html` contains the new `<section class="marquee-section">` between `</header>` and `<!-- MANIFESTO`.
- `style.css` contains the new `.marquee-*` rule block + `@keyframes marquee` + `prefers-reduced-motion` guard, in the slot immediately before the `Section V2 typography` comment.
- Browser verification all green: marquee scrolls seamlessly, edges fade, no horizontal scrollbar, mobile width legible, reduced-motion preference is honored.
- Two commits on `main` (or feature branch): one for the section, one for the reduced-motion guard.
- No other files modified.
