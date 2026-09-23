# User Guide Page (`guide.html`) — Design

**Date:** 2026-07-21
**Status:** Approved

## Goal

Add a full user guide page to the Aurora legal/marketing site, serving two audiences: new users setting up the Safari extension for the first time (primary), and existing users looking up any feature (complete manual).

## Decisions

- **Structure:** single long page `guide.html` with a table of contents; no sub-pages.
- **Illustrations:** CSS-built mockups in the site's existing visual style (no real screenshots). The iOS Settings flow is illustrated as simulated Settings rows.
- **Language:** English, consistent with the rest of the site.
- **Tech:** vanilla HTML/CSS/JS, no build step, matching the existing site.

## Page layout

- Same header/nav/footer as existing pages.
- Add a "Guide" link to the nav of all five pages (`index.html`, `privacy.html`, `terms.html`, `support.html`, `guide.html`).
- Desktop: sticky TOC in a left column. Mobile: TOC collapses to a dropdown at the top of the page.
- Every section has a stable anchor id (e.g. `guide.html#setup`) so the app and support page can deep-link to steps.

## Sections

1. **Getting Started** (`#setup`) — enabling the extension: Settings → Apps → Safari → Extensions → Aurora → Allow Extension, then grant "All Websites" permission. Include the alternate path via the puzzle/⋮ button in Safari's address bar. This section gets the most detailed CSS illustrations (simulated iOS Settings rows).
2. **Themes & Colours** (`#themes`) — choosing dark themes, customizing colours.
3. **Fonts & Blue Light Filter** (`#reading`) — changing the reading font, enabling the blue light filter.
4. **Quick Controls** (`#controls`) — Control Center toggle, Live Activity, Focus Filter. These are currently answered piecemeal in the support FAQ; the guide becomes the canonical how-to.
5. **Subscription** (`#subscription`) — monthly plan, restoring purchases, link to refund policy.
6. **Troubleshooting** (`#troubleshooting`) — site looks broken with Aurora on, extension not appearing, theme not applying.

## Integration changes

- `support.html`: the "Safari extension setup" section links to `guide.html#setup` instead of duplicating the steps.
- Guide-specific CSS (TOC, step illustrations) lives in a `<style>` block inside `guide.html`, keeping the shared `style.css` unchanged; shared styles continue to come from `style.css`.

## Out of scope

- Real device screenshots.
- Localization beyond English.
- Any change to the app itself.

## Success criteria

- `guide.html` renders correctly on mobile and desktop with working TOC anchors.
- All five pages show the "Guide" nav link.
- Content accurately reflects the app's shipped features (verify feature names against the app before publishing).

## Revision — 2026-07-21 (v2)

After reviewing v1 in the browser, layout revised per user feedback (excess left space from the 220px TOC inside the 720px container):

- **Layout:** platform tab switcher (iOS & iPadOS / macOS) + horizontal sticky chip TOC + single centred ~760px column. Small inline JS handles tab switching; `#mac-*` deep links open the macOS tab.
- **macOS released:** the guide now documents both platforms. Mac facts: Universal Purchase (same App ID 6751903540, one purchase unlocks iOS + Mac), 3-day trial, menu bar toggle replaces Control Center, no Live Activity on Mac, Mac-exclusive web font & size control — fonts and dark mode are fully independent features (explicit user requirement).
- **Site-wide copy fix:** all "Mac coming soon / in active development" copy on index.html and support.html updated to released status.
