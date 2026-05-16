# Restore "Better on your site" marquee section

**Status:** Draft
**Date:** 2026-05-16
**Scope:** index.html, style.css

## Background

Commit `62f7650` ("refactor: drop marquee section — logo-soup is itself an AI-favorite pattern") removed a horizontally-scrolling section that listed supported websites (Wikipedia, YouTube, Reddit, NYT, …). It sat between the hero and the compare slider. The removal note rejected the section as visually generic — the kind of motion-marquee an AI design tool defaults to.

We want the section back. Auroras's value pitch is that it themes the sites people actually read, and the marquee was the page's only beat that named those sites. Without it the home page is heavier on abstract claims and lighter on concrete evidence.

The "AI logo-soup" critique was real, but the fix is editorial framing, not deletion. Same content, voice-led headline.

## Goal

Restore the marquee in its original slot — between hero and the manifesto strip — with refreshed copy that reframes the list as a hand-curated set rather than a generic logo wall.

## Non-goals

- Changing the site list (stays at the 14 names from the removed version).
- Changing the marquee animation, speed, or fade-mask treatment.
- Responsive rework. The original CSS already handled small screens.
- Touching any other section.

## Design

### Placement

Insert immediately after the closing `</header>` of the hero (`index.html:125`) and before the `<section class="manifesto">` block (`index.html:128`). This puts the marquee in the same slot it occupied before commit `62f7650`.

Resulting top-to-bottom flow:

1. Nav
2. Hero
3. **Marquee (new)**
4. Manifesto
5. Compare slider (`#features`)
6. Made for iOS bento
7. Eye care / BLF
8. Pricing + FAQ
9. Founder footer

### HTML

Restore the `<section class="marquee-section">` block from commit `62f7650`, with two copy changes:

- Label: `Better on your site` (was: `Optimized for the sites you use most`).
- New `<p class="marquee-sub">` element between label and marquee track: `Aurora themes every site you read — these are the ones we tune by hand.`

Site list and duplicate-for-seamless-loop ordering are preserved verbatim from the removed block.

```html
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
```

### CSS

Restore the 33 lines of `.marquee*` rules from commit `62f7650` verbatim. All five tokens they reference (`--bg-base`, `--border-card`, `--text-muted`, `--text-tertiary`, `--text-primary`) still exist in `style.css` (lines 8, 14, 27, 29, 30). No token rewrites required.

Insertion point: immediately before the `/* ---------- Section V2 typography ---------- */` comment in `style.css` — the exact slot the rules occupied before commit `62f7650`.

Add one new rule for the subhead:

```css
.marquee-sub {
  font-size: 14px;
  color: var(--text-tertiary);
  text-align: center;
  margin: 0 auto 24px;
  max-width: 520px;
}
```

The restored block (for reference):

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

Add one reduced-motion guard so the section respects OS-level accessibility preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
```

The marquee stays visible (showing the first frame statically) for these users; the message still lands without the scroll.

The `.marquee-label`'s `margin-bottom: 20px` separates the label from the subhead; the subhead's own `margin-bottom: 24px` separates it from the track. No changes needed to the existing label rule.

## Why this addresses the original removal reason

The removal note was: *"logo-soup is itself an AI-favorite pattern."* The fix is not structural — the same horizontal-scroll mechanism is exactly the right shape for the message. The fix is voice:

- Old label: *"Optimized for the sites you use most"* — boilerplate. Reads like a marketing template.
- New label + subhead: *"Better on your site / Aurora themes every site you read — these are the ones we tune by hand."* — first-person editorial voice, claims work was done by hand. The same scrolling list now reads as a curated set, not a logo dump.

This is the smallest change that addresses the critique. If it still reads as generic after launch, the next move is structural (Options 2–4 from brainstorming).

## Verification

- Open `index.html` in a browser; confirm marquee scrolls left continuously with no visible seam at the wrap point (the duplicate-list trick should hide it).
- Check that no horizontal scrollbar appears on the page at desktop widths.
- Resize to mobile (≤480px wide) and confirm the section still reads — label, subhead, and scrolling row all legible.
- Enable "Reduce motion" in the OS (macOS: System Settings → Accessibility → Display → Reduce motion) and confirm the marquee renders statically without animation.
- Verify the marquee respects the hero/manifesto rhythm (no awkward gap above or below).
- Confirm the section's top and bottom hairline borders sit flush against the hero's bottom edge and the manifesto's top edge.

## Risks

- **Critique recurs.** If "logo soup" was the right read regardless of headline, this revert+rephrase won't fix it. Mitigation: ship, look at it in context, and fall back to one of the structural options (Safari-frame rotator, vertical ticker, sentence-marquee) if it still feels generic.
- **Subhead crowds the label.** The original section had one centered line of small text. Adding a second line could weaken the "thin band" rhythm. Mitigation: the subhead is constrained to 520px max-width and `text-tertiary` color so it sits visually quieter than the label.

## Out of scope follow-ups

- Logo treatment (wordmarks/favicons instead of plain text).
- Click-through links from each site name.
- Live count of "themed sites this week" or any dynamic content.
- Per-site theming demo (Option 2 from brainstorming — would be its own spec).
