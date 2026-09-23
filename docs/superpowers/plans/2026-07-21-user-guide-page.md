# User Guide Page (`guide.html`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single-page user guide (`guide.html`) to the aurora-legal static site, with a sticky table of contents, CSS-built step illustrations, and a "Guide" nav link on all five pages.

**Architecture:** The site is vanilla HTML/CSS/JS with no build step. `index.html` is fully self-contained (its own inline `<style>` and `<script>`); the legal pages (`privacy.html`, `terms.html`, `support.html`) share `style.css` + `script.js` and a common `site-nav` / `site-footer-min` template. `guide.html` follows the legal-page template, with guide-specific CSS in an inline `<style>` block. Spec: `docs/superpowers/specs/2026-07-21-user-guide-page-design.md`.

**Tech Stack:** HTML5, CSS3, no JS beyond the shared `script.js`. Deployed by pushing to `main` (GitHub Pages).

## Global Constraints

- All copy in English, matching the site's existing voice (first-person "I" = Danny, the solo developer).
- No build step, no new dependencies, no new JS files. Guide-specific CSS lives in a `<style>` block inside `guide.html` — `style.css` must NOT be modified.
- Section anchor ids are fixed API (the app and support page may deep-link them): `#setup`, `#themes`, `#reading`, `#controls`, `#subscription`, `#troubleshooting`.
- Feature facts (verified against `index.html` + `support.html` — do not invent others):
  - 7 built-in themes + unlimited custom themes, iCloud sync
  - Blue Light Filter, 0–100%
  - Image Dimming, per-site granularity
  - Per-site rules: whitelist / blacklist ("Rules" screen in the app)
  - Control Center toggle (requires iOS 18+), Live Activity (iOS 16+), Focus Filter, Auto Schedule, Siri/Shortcuts
  - Pricing: $1.99/month or $5.99 lifetime, 3-day free trial, no payment info needed for trial
  - Changing web font & size is **Mac-only and unreleased** ("coming soon") — must NOT be documented as an iOS feature
- App Store URL: `https://apps.apple.com/us/app/aurora-safari-dark-themes/id6751903540`
- Contact email: `danny.ng.it@gmail.com`
- **Spec deviation (approved rationale):** the spec named section 3 "Fonts & Blue Light Filter", but the font feature is Mac-only/unshipped. Section 3 is instead "Eye care" (Blue Light Filter + Image Dimming), keeping the spec's `#reading` anchor. This satisfies the spec's success criterion "content accurately reflects the app's shipped features".

---

### Task 1: Create `guide.html`

**Files:**
- Create: `guide.html`

**Interfaces:**
- Consumes: shared classes from `style.css` (`.site-nav`, `.nav-inner`, `.brand`, `.brand-mark`, `.nav-links`, `.nav-download`, `.legal-page`, `.legal-container`, `.legal-updated`, `.wiki-link`, `.site-footer-min`, `.site-footer-inner`, `.site-footer-links`, `.container`) and CSS variables (`--bg-elevated`, `--border-card`, `--brand-purple`, `--text-secondary`, `--text-tertiary`, `--success`, `--radius-md`, `--radius-lg`).
- Produces: `guide.html` with anchor ids `#setup`, `#themes`, `#reading`, `#controls`, `#subscription`, `#troubleshooting` that Task 2 links to.

- [ ] **Step 1: Write the complete file**

Create `guide.html` with exactly this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Guide — Aurora</title>
  <meta name="description" content="How to set up and use Aurora — Safari Dark Themes: enable the extension, pick themes, eye-care filters, quick controls, and troubleshooting.">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="User Guide — Aurora">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://datnntqn.github.io/aurora-legal/guide.html">
  <link rel="icon" type="image/png" href="assets/aurora-icon-128.png">
  <link rel="apple-touch-icon" href="assets/aurora-icon-180.png">
  <link rel="stylesheet" href="style.css">
  <style>
  /* Guide-only styles. Shared look comes from style.css; keep this block scoped
     to .guide-* and .mock-* classes so it can't leak into other pages. */
  .guide-grid { display: grid; grid-template-columns: 220px 1fr; gap: 40px; align-items: start; }
  .guide-toc { position: sticky; top: 84px; }
  .guide-toc nav { display: flex; flex-direction: column; gap: 2px; }
  .guide-toc a {
    padding: 7px 12px; border-radius: 8px; font-size: 13.5px;
    color: var(--text-tertiary); border-left: 2px solid var(--border-card);
  }
  .guide-toc a:hover { color: var(--text-primary); background: var(--bg-card); }
  .guide-toc .toc-label {
    font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); margin: 0 0 8px 12px;
  }
  .guide-toc-mobile { display: none; }
  @media (max-width: 760px) {
    .guide-grid { display: block; }
    .guide-toc { display: none; }
    .guide-toc-mobile {
      display: block; margin-bottom: 28px; background: var(--bg-elevated);
      border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 12px 16px;
    }
    .guide-toc-mobile summary { cursor: pointer; font-weight: 700; font-size: 14px; }
    .guide-toc-mobile a { display: block; padding: 8px 4px; font-size: 14px; color: var(--text-secondary); }
  }
  .guide-section { scroll-margin-top: 84px; }
  .step-note {
    background: var(--bg-card); border: 1px solid var(--border-card);
    border-left: 3px solid var(--brand-purple); border-radius: var(--radius-sm);
    padding: 10px 14px; font-size: 13.5px; color: var(--text-secondary); margin: 14px 0;
  }
  /* CSS-built iOS Settings illustration */
  .mock-settings {
    max-width: 340px; background: #000; border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg); padding: 16px 12px 12px; margin: 16px 0;
    font-size: 13px; color: #fff;
  }
  .mock-settings .mock-title { font-size: 15px; font-weight: 700; margin-bottom: 10px; padding-left: 4px; }
  .mock-row {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.08); padding: 10px 12px;
    border-radius: 8px; margin-bottom: 5px;
  }
  .mock-row.hilite { border: 1px solid rgba(139,92,246,0.6); background: rgba(139,92,246,0.18); }
  .mock-icon {
    width: 26px; height: 26px; border-radius: 6px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 14px;
  }
  .mock-icon.aurora { background: linear-gradient(135deg, var(--brand-purple), var(--brand-blue)); }
  .mock-icon.sys { background: #1c1c1e; }
  .mock-row .mock-label { flex: 1; }
  .mock-row .mock-chevron { color: rgba(255,255,255,0.3); }
  .mock-check { color: var(--success); font-weight: 700; }
  .mock-toggle { width: 40px; height: 24px; border-radius: 12px; background: #39393d; position: relative; flex-shrink: 0; }
  .mock-toggle::after {
    content: ""; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px;
    border-radius: 50%; background: #fff;
  }
  .mock-toggle.on { background: var(--success); }
  .mock-toggle.on::after { left: auto; right: 2px; }
  .mock-caption { font-size: 12px; color: var(--text-tertiary); max-width: 340px; margin: -6px 0 16px; }
  /* Theme swatch strip */
  .theme-swatches { display: flex; gap: 8px; margin: 14px 0; }
  .theme-swatches div { width: 34px; height: 24px; border-radius: 6px; border: 1px solid var(--border-strong); }
  </style>
</head>
<body>

<nav class="site-nav">
  <div class="container nav-inner">
    <a href="index.html" class="brand">
      <img src="assets/aurora-icon-128.png" alt="" class="brand-mark">
      <span>Aurora</span>
    </a>
    <div class="nav-links">
      <a href="index.html#features">Features</a>
      <a href="index.html#pricing">Pricing</a>
      <a href="guide.html">Guide</a>
      <a href="support.html">Support</a>
    </div>
    <a href="https://apps.apple.com/us/app/aurora-safari-dark-themes/id6751903540" class="nav-download">Download</a>
  </div>
</nav>

<main class="legal-page">
  <div class="container legal-container">
    <h1>Aurora User Guide</h1>
    <p class="legal-updated">Everything from first setup to fixing a broken site. 5-minute read.</p>

    <details class="guide-toc-mobile">
      <summary>On this page</summary>
      <a href="#setup">1 · Getting started</a>
      <a href="#themes">2 · Themes &amp; colours</a>
      <a href="#reading">3 · Eye care</a>
      <a href="#controls">4 · Quick controls</a>
      <a href="#subscription">5 · Trial &amp; pricing</a>
      <a href="#troubleshooting">6 · Troubleshooting</a>
    </details>

    <div class="guide-grid">
      <aside class="guide-toc">
        <p class="toc-label">On this page</p>
        <nav>
          <a href="#setup">1 · Getting started</a>
          <a href="#themes">2 · Themes &amp; colours</a>
          <a href="#reading">3 · Eye care</a>
          <a href="#controls">4 · Quick controls</a>
          <a href="#subscription">5 · Trial &amp; pricing</a>
          <a href="#troubleshooting">6 · Troubleshooting</a>
        </nav>
      </aside>

      <div class="guide-content">

        <section id="setup" class="guide-section">
          <h2>1 · Getting started</h2>
          <p>Aurora is a Safari extension, so after installing the app you enable it once in iOS Settings. This is the one step everyone gets stuck on — it takes under a minute.</p>
          <ol>
            <li><a href="https://apps.apple.com/us/app/aurora-safari-dark-themes/id6751903540" class="wiki-link">Download Aurora</a> from the App Store and open it once.</li>
            <li>Open <strong>Settings → Safari → Extensions</strong>. (On newer iOS versions the same list is under <strong>Settings → Apps → Safari → Extensions</strong>.)</li>
            <li>Tap <strong>Aurora</strong> and toggle <strong>Allow Extension</strong> on.</li>
          </ol>
          <div class="mock-settings" aria-hidden="true">
            <div class="mock-title">Extensions</div>
            <div class="mock-row hilite"><div class="mock-icon aurora">☾</div><div class="mock-label">Aurora</div><div class="mock-toggle on"></div></div>
            <div class="mock-row"><div class="mock-icon sys">▦</div><div class="mock-label">Other extension</div><div class="mock-toggle"></div></div>
          </div>
          <p class="mock-caption">Settings → Safari → Extensions: toggle Aurora on.</p>
          <ol start="4">
            <li>Still on Aurora's settings page, under <em>Allow Aurora to read and alter webpages on</em>, tap <strong>All Websites</strong> and choose <strong>Allow</strong>. Aurora needs this to re-colour pages; your browsing never leaves the device — see the <a href="privacy.html" class="wiki-link">Privacy Policy</a>.</li>
          </ol>
          <div class="mock-settings" aria-hidden="true">
            <div class="mock-title">Aurora</div>
            <div class="mock-row"><div class="mock-label">Other Websites</div><span class="mock-chevron">Ask ›</span></div>
            <div class="mock-row hilite"><div class="mock-label">All Websites</div><span class="mock-check">✓ Allow</span></div>
          </div>
          <p class="mock-caption">Grant access to All Websites so every page can be themed.</p>
          <ol start="5">
            <li>Go back to Safari and refresh any open tab — the page should now be dark.</li>
          </ol>
          <div class="step-note"><strong>Shortcut:</strong> you can also do this from inside Safari — tap the <strong>aA</strong> (or puzzle-piece) button in the address bar → <strong>Manage Extensions</strong> → enable Aurora.</div>
        </section>

        <section id="themes" class="guide-section">
          <h2>2 · Themes &amp; colours</h2>
          <p>Aurora ships <strong>7 built-in themes</strong> — from deep blue night tones to warm sepia — and lets you design <strong>unlimited custom themes</strong> with your exact background, text, and accent colours.</p>
          <div class="theme-swatches" aria-hidden="true">
            <div style="background:#0d1b2a"></div><div style="background:#10131a"></div><div style="background:#1a0a1e"></div>
            <div style="background:#0f1a14"></div><div style="background:#2a1a0d"></div><div style="background:#20222c"></div><div style="background:#000"></div>
          </div>
          <ol>
            <li>Open the Aurora app and pick any theme — it applies to Safari instantly.</li>
            <li>To make your own, choose <strong>Custom</strong> and adjust the colours until it feels right.</li>
            <li>Custom themes sync across your devices via <strong>iCloud</strong> — nothing to set up.</li>
          </ol>
          <div class="step-note">Themes re-colour pages instead of inverting them, so layout, links, and images stay exactly where the site's designer put them.</div>
        </section>

        <section id="reading" class="guide-section">
          <h2>3 · Eye care</h2>
          <p>Two extra layers on top of dark mode make late-night reading comfortable:</p>
          <ol>
            <li><strong>Blue Light Filter</strong> — warms the page from 0 to 100%. Set it in the Aurora app; higher values feel like a paper page under lamplight.</li>
            <li><strong>Image Dimming</strong> — tones down bright photos that would otherwise glare against a dark page. Adjustable per site, so photography sites can stay vivid while news sites stay calm.</li>
          </ol>
          <div class="step-note">Changing the web font &amp; size is coming in the Mac version of Aurora — it's not part of the iOS app yet.</div>
        </section>

        <section id="controls" class="guide-section">
          <h2>4 · Quick controls</h2>
          <p>You rarely need to open the app once things are set up:</p>
          <ol>
            <li><strong>Control Center toggle</strong> (iOS 18+): <strong>Settings → Control Center</strong> → scroll to <em>More Controls</em> → tap the green <strong>+</strong> next to Aurora. Flip dark mode from anywhere.</li>
            <li><strong>Live Activity</strong> (iOS 16+): shows Aurora's on/off state on the Lock Screen and Dynamic Island. Enable it in the Aurora app.</li>
            <li><strong>Focus Filter</strong>: <strong>Settings → Focus</strong> → pick a mode (e.g. Sleep) → <strong>Focus Filters → Add Filter → Aurora</strong> → set to ON. Aurora switches automatically when that Focus starts — dark at night, light by day.</li>
            <li><strong>Auto Schedule</strong>: in the Aurora app, set times to turn dark mode on and off every day.</li>
            <li><strong>Siri &amp; Shortcuts</strong>: Aurora's toggle actions appear in the Shortcuts app, so you can automate it or ask Siri.</li>
          </ol>
        </section>

        <section id="subscription" class="guide-section">
          <h2>5 · Trial &amp; pricing</h2>
          <ol>
            <li>Every feature is free for <strong>3 days</strong> — no payment info required to start the trial.</li>
            <li>After that, keep Aurora with either plan, purchased inside the app: <strong>$1.99/month</strong> (cancel anytime) or <strong>$5.99 once</strong> for lifetime access and all future updates.</li>
            <li>Reinstalled or switched phones? Tap <strong>Restore Purchases</strong> in the Aurora app.</li>
            <li>Refunds follow the standard App Store policy — request one via your <a href="https://reportaproblem.apple.com/" class="wiki-link">Apple purchase history</a>. Details in the <a href="terms.html" class="wiki-link">Terms of Service</a>.</li>
          </ol>
        </section>

        <section id="troubleshooting" class="guide-section">
          <h2>6 · Troubleshooting</h2>
          <p><strong>Pages aren't turning dark.</strong> Almost always a permissions issue: re-check <a href="#setup" class="wiki-link">Getting started</a> — the extension must be toggled on <em>and</em> have <em>All Websites → Allow</em>. Then refresh the tab.</p>
          <p><strong>Aurora doesn't appear in Settings → Safari → Extensions.</strong> Open the Aurora app once, then check again. If it's still missing, restart your iPhone — iOS occasionally needs it to register new extensions.</p>
          <p><strong>A site looks broken with Aurora on.</strong> In order:</p>
          <ol>
            <li>Open the Aurora app → <strong>Rules</strong> → add the site to the <strong>Blacklist</strong>. Aurora will skip it.</li>
            <li>Try a different theme — some themes apply stronger filters and interact differently with a site's CSS.</li>
            <li>Email the URL to <a href="mailto:danny.ng.it@gmail.com" class="wiki-link">danny.ng.it@gmail.com</a> — I ship site-specific fixes in updates regularly.</li>
          </ol>
          <p>Anything else — see the <a href="support.html" class="wiki-link">Support page</a> for the FAQ and a bug report template.</p>
        </section>

      </div>
    </div>
  </div>
</main>

<footer class="site-footer-min">
  <div class="container site-footer-inner">
    <div>© 2026 Aurora · Made for iOS</div>
    <div class="site-footer-links">
      <a href="index.html">Home</a>
      <a href="guide.html">Guide</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
      <a href="support.html">Support</a>
    </div>
  </div>
</footer>

<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify structure**

Run:
```bash
cd /Users/datnnt/App/Aurora/aurora-legal
grep -c 'class="guide-section"' guide.html
grep -o 'id="[a-z]*"' guide.html | sort
```
Expected: first command prints `6`; second lists `id="controls"`, `id="reading"`, `id="setup"`, `id="subscription"`, `id="themes"`, `id="troubleshooting"` (one line each).

- [ ] **Step 3: Visual check in a browser**

Run: `cd /Users/datnnt/App/Aurora/aurora-legal && python3 -m http.server 8080` (background), then open `http://localhost:8080/guide.html`.
Check: sticky TOC on desktop width; TOC collapses to a "On this page" dropdown below 760px; both Settings mockups render (toggle green/on, ✓ Allow row highlighted); all 6 TOC links jump to their sections. Stop the server when done.

- [ ] **Step 4: Commit**

```bash
cd /Users/datnnt/App/Aurora/aurora-legal
git add guide.html
git commit -m "feat: add user guide page"
```

---

### Task 2: Link the guide from every existing page

**Files:**
- Modify: `index.html:216` (nav) and `index.html:313` (footer)
- Modify: `privacy.html:25-29` (nav) and `privacy.html:132-137` (footer)
- Modify: `terms.html:24-28` (nav) and `terms.html:103-108` (footer)
- Modify: `support.html:24-28` (nav), `support.html:139-149` (footer), `support.html:44-54` (setup section)

**Interfaces:**
- Consumes: `guide.html` and its `#setup` anchor from Task 1.
- Produces: nothing consumed later; final integration.

- [ ] **Step 1: index.html — nav and footer**

In `index.html`, change the `.nlinks` line (currently line 216) to add Guide before Support:

```html
  <div class="nlinks"><a href="#demo">Demo</a><a href="#ios">Made for iOS</a><a href="#reviews">Reviews</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><a href="guide.html">Guide</a><a href="support.html">Support</a></div>
```

And the footer links (currently line 313) to:

```html
<footer><div class="c fin"><div>© 2026 Aurora · Made for iOS · Mac coming soon</div><div><a href="guide.html">Guide</a> · <a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href="support.html">Support</a></div></div></footer>
```

- [ ] **Step 2: privacy.html and terms.html — nav and footer**

In **both** files, replace the `nav-links` block:

```html
    <div class="nav-links">
      <a href="index.html#features">Features</a>
      <a href="index.html#pricing">Pricing</a>
      <a href="guide.html">Guide</a>
      <a href="support.html">Support</a>
    </div>
```

and replace the `site-footer-links` block:

```html
    <div class="site-footer-links">
      <a href="index.html">Home</a>
      <a href="guide.html">Guide</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
      <a href="support.html">Support</a>
    </div>
```

- [ ] **Step 3: support.html — nav, footer, and setup section**

Apply the same `nav-links` block as Step 2 but keep Privacy in it (support's nav currently links Privacy, not Support):

```html
    <div class="nav-links">
      <a href="index.html#features">Features</a>
      <a href="index.html#pricing">Pricing</a>
      <a href="guide.html">Guide</a>
      <a href="privacy.html">Privacy</a>
    </div>
```

Apply the same `site-footer-links` block as Step 2.

Replace the whole "Safari extension setup" section (lines 44–54, the `<section>` containing that `<h2>`) with a short pointer so the steps live in one place:

```html
    <section>
      <h2>Safari extension setup</h2>
      <p>If Aurora isn't working in Safari yet, the extension probably isn't enabled. The <a href="guide.html#setup" class="wiki-link">User Guide — Getting started</a> walks through it with illustrations: enable Aurora in Settings, allow All Websites, refresh the page.</p>
    </section>
```

- [ ] **Step 4: Verify all links**

Run:
```bash
cd /Users/datnnt/App/Aurora/aurora-legal
grep -l 'href="guide.html"' index.html privacy.html terms.html support.html guide.html
grep -c 'guide.html#setup' support.html
grep -c 'Settings → Safari → Extensions' support.html
```
Expected: first command lists all five files; second prints `1`; third prints `0` (steps no longer duplicated on support — they live in the guide).

- [ ] **Step 5: Visual spot-check**

Serve locally again (`python3 -m http.server 8080`) and click the "Guide" nav link from `index.html`, `privacy.html`, `terms.html`, `support.html`; from support's setup section, confirm the link lands on `guide.html#setup` scrolled to section 1. Stop the server.

- [ ] **Step 6: Commit**

```bash
cd /Users/datnnt/App/Aurora/aurora-legal
git add index.html privacy.html terms.html support.html
git commit -m "feat: link user guide from nav, footers, and support setup section"
```

---

### Task 3: Deploy

**Files:** none (git push only)

- [ ] **Step 1: Confirm with the user, then push**

Pushing `main` publishes to GitHub Pages immediately. Confirm the user wants to deploy now, then:

```bash
cd /Users/datnnt/App/Aurora/aurora-legal
git push origin main
```

- [ ] **Step 2: Verify live**

Wait ~1–2 minutes for Pages to rebuild, then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://datnntqn.github.io/aurora-legal/guide.html
```
Expected: `200`. Open `https://datnntqn.github.io/aurora-legal/guide.html` and spot-check the TOC and both mockups.
