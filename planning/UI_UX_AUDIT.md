# FlowMatrix AI — UI/UX & Structural Audit

**Date:** March 6, 2026  
**Scope:** Layout, styling, UI/UX, information architecture, and structural correctness. Does not cover SEO, CI, or backend concerns.  
**Goal:** Identify what needs to change to read as a credible, polished B2B company website.

---

## 2. Navigation & Information Architecture

### 2.1 Nav structure is correct but incomplete for multi-page context

The desktop nav has: Services · Results · Team · FAQ · Start Conversation

All four items (`/#services`, `/#proof`, `/#team`, `/#faq`) are hash anchors to the homepage. When on a service page (`/assessment`, etc.) clicking any of them navigates **back to home** then scrolls to the section. This is technically correct but feels disorienting — there is no nav item that says "we're in services territory right now."

**Consider:** Adding a "Services" page-level link that goes to `/#services` when already home, or keeps you oriented when on a service page (e.g. active state when on `/assessment`). Minor improvement but reduces confusion.

### 2.2 No persistent way to reach individual service pages from nav

Services are the product. The footer now lists all four service pages, but the main nav has no direct path to `/assessment` or `/ai-implementation` — only the `/#services` homepage anchor. A visitor on a service page sees no highlighted nav state and no direct links to the other three phases. A simple dropdown or active-state indicator would solve this without over-engineering.

---

## 3. Homepage Layout & Section Structure

### 3.1 Hero — content is strong, presentation is undersized

`min-height: 420px` on the hero card. On a 1920px screen this is a very short hero. The copy is good (`"Build what lasts."` / strong subheadline) but the spatial weight doesn't match the editorial ambition.

**Fix:** Increase to `min-height: clamp(480px, 60vh, 700px)`. Give the hero more vertical breathing room so the headline lands with impact before the user starts scrolling.

### 3.2 All sections are the same visual treatment

Every section — hero, stakes, services, proof, team, FAQ, CTA — is a `surface-card` with the identical dark card + subtle border treatment. There is no section-to-section rhythm variation. This creates a "wall of uniform cards" effect where the eye has no landmarks.

A real company site alternates section backgrounds or uses whitespace between sections differently to signal transitions.

**Fix options:**

- Give alternating sections a slightly lighter background (use `--color-bg-soft` or `--color-bg-elevated` for even sections)
- Remove the card border on full-width sections and use background fills + whitespace instead
- At minimum, vary section padding to create a sense of visual breathing

### 3.3 Section title size is small

`section-title` is `clamp(1.5rem, 2.9vw, 2.2rem)` — maxes at ~35px. For a B2B site making bold assertions ("The divergence has begun", "Builders, not advisors") the section headlines need more visual authority.

**Fix:** Bump to `clamp(1.75rem, 3.2vw, 2.6rem)`.

### 3.4 Stats grid — numbers are strong, context is weak

The stats section (`72%`, `3x`, `18mo`) are impactful numbers but displayed in plain bordered boxes with no visual emphasis. The gold gradient on the value is the only accent. The surrounding card is entirely generic.

**Fix:** The stat items should have slightly more presence — either remove the card borders and use larger stat values, or add a subtle gold glow border on hover. Currently they read as placeholder-style.

### 3.5 Services section — cards don't feel fully clickable

The pillar grid cards have a `card-lift` hover effect but no visual affordance that they're interactive. The `gold-link` at the bottom ("Explore Assessment") is the only signal.

**Fix (UX):** Make the entire card a `<RouterLink>` wrapping the content with a clear hover state on the border. Users expect the full card to be clickable, not just the link text.

### 3.6 Proof/testimonial section — thin social proof

One quote from one attributed person at one company. For a B2B consultancy asking for serious engagements, this is the weakest section on the page.

**Issues:**

- Single attribution without a headshot (only a company logo)
- The quote itself references "this operations team" anonymously — the attribution to a named CEO partially saves it but it reads as vague
- Client logo marquee runs at `opacity: 0.38` — barely visible, reads as placeholder

**Fix recommendations:**

- Raise logo marquee opacity to `0.55–0.65`
- If there are 2–3 client results, add a second quote or a simple result callout row ("3 clients" / "X processes automated" etc.)
- Otherwise, consider renaming the section away from "Client Results" to something like "In Practice" if only one case study exists — sets expectations correctly

### 3.7 FAQ — no open/close animation

Native `<details>/<summary>` with no CSS transition. Opens and closes with a hard jump. On a polished site this feels unfinished.

**Fix:** Add `max-height` or `grid-row` transition to FAQ items. 10 lines of CSS.

### 3.8 Lead form — not using shared Button component; no two-column layout on desktop

- The submit button in `LeadForm.vue` is a raw `<button>` styled inline with duplicated gradient CSS identical to `Button.vue`. This is a maintenance inconsistency.
- On desktop (wide form container), Name and Email could sit side-by-side with a two-column layout, using all the available width more efficiently.

**Fix:** Replace raw `<button>` in LeadForm with `<Button type="submit">`. Add a two-column layout for name/email on `>= 560px`.

---

## 4. Service Pages

### 4.1 Phase tracker is a useful pattern but visually noisy

The 4-item phase track row at the top of each service page (showing all 4 phases, current one highlighted) is a good orientation device. But at smaller sizes (`grid-template-columns: repeat(4, ...)`) it gets cramped and the text truncates.

**Fix:** On mobile collapse to a simpler `"Phase 2 of 4"` text indicator, or hide non-current phases.

### 4.2 Service sections grid is 2-column but content is dense

`grid-template-columns: repeat(2, 1fr)` for the content cards — fine layout, but `section-index` + `h3` + body paragraph inside each card can be tight if content runs long.

**Fix:** Already collapses to 1 column at 1024px — this is correct. No major change needed, just ensure minimum card `min-height` isn't set causing uneven cards.

---

## 5. Footer

### 5.1 Email displayed is `info@flowmatrixai.com` — verify this is intentional

The site's lead capture sends to `leads@flowmatrixai.com`. The footer shows `info@flowmatrixai.com` as the contact email for human visitors. If this inbox is monitored, it's fine. If not, it should match.

### 5.2 Footer copyright year is dynamic — correct

`new Date().getFullYear()` — good, won't need updating.

---

## 6. Typography & Visual System

### 6.1 No base font size set on `html`

Browser default is 16px, which is fine, but it should be declared explicitly for predictability:

```css
html {
  font-size: 16px;
}
```

### 6.2 Body line-height not globally set

`line-height: 1.65` appears repeatedly across scoped styles but is never set globally. Should be a global reset.

### 6.3 Gold gradient on eyebrow labels is good but overused

`section-eyebrow` appears on every section. "FlowMatrix AI", "The Stakes", "Methodology", "Client Results", "The Team", "FAQ", "Start Here" — every section opens with this same treatment. On a long page it loses meaning. Consider reserving it for 3–4 key sections rather than all 7.

### 6.4 `clamp()` sizing is well-used

Responsive font sizing via `clamp()` throughout is correct and coherent. No changes needed here.

---

## 7. Mobile Experience

### 7.1 Breakpoints are reasonable

- 980px: stacks grids, hides desktop nav
- 760px: minor home hero and logo adjustments

### 7.2 Mobile menu UX is functional

The mobile panel (full-screen overlay) is clean. Button closes on route change — correct behavior.

### 7.3 `page-main` padding on mobile

`padding-top: calc(72px + 2rem)` = ~104px from top of viewport to content. Reasonable.

### 7.4 `stats-grid` on mobile is 3 stat cards stacked vertically

Fine given short content, no issue.

---

## 8. Accessibility

### 8.1 No skip-to-content link

There is no `<a href="#main-content">Skip to main content</a>` link before the nav. This is a WCAG 2.1 AA best practice for keyboard users.

### 8.2 Focus-visible system is implemented correctly

The `:focus-visible` CSS system with gold glow ring is thorough. No changes needed.

### 8.3 `aria-hidden` on decorative elements is correct

Hero atmosphere divs, quote marks, etc. all have `aria-hidden="true"`. Correct.

### 8.4 Form labels are properly associated

All form inputs have matching `for`/`id` pairs. Correct.

### 8.5 `logo-marquee` has no `prefers-reduced-motion` handling

The `logo-marquee` animation and `animate-drift-slow` on the hero orb don't check `prefers-reduced-motion`. Should be paused for users who have this preference set.

---

## 9. Priority Order

| Priority | Item                                                     | Impact                           |
| -------- | -------------------------------------------------------- | -------------------------------- |
| P1       | Hero: increase min-height, more breathing room           | First impression of the site     |
| P1       | Section visual rhythm: vary background treatments        | Removes "wall of cards" monotony |
| P1       | Service card click target: make full card a RouterLink   | Users expect card = clickable    |
| P2       | FAQ open/close transition                                | Polish                           |
| P2       | Lead form: two-column on desktop, use Button component   | Consistency + layout polish      |
| P2       | Section title size increase                              | Visual authority                 |
| P2       | Logo marquee opacity increase                            | Currently reads as placeholder   |
| P2       | `prefers-reduced-motion` on animations                   | Accessibility                    |
| P3       | Add skip-to-content link                                 | Accessibility best practice      |
| P3       | Eyebrow label usage: reserve, don't use on every section | Visual hierarchy                 |
| P3       | Global `line-height` and `font-size` base reset          | CSS hygiene                      |
| P3       | Stats section visual upgrade                             | Minor polish                     |

**P0 items should be fixed before any deployment. P1 items represent the biggest quality-of-life delta for the overall site impression. P2–P3 are polish.**
