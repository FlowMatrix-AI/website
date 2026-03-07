# FlowMatrix AI — Redesign Vision

**Date:** March 6, 2026  
**Status:** Vision / pre-planning — no code changes yet  
**Scope:** Full homepage redesign, site architecture simplification, and service content consolidation

---

## 1. The Core Direction

Two things need to change at the same time, and they're related:

**1. Visual language:** The site currently wraps every section in an identical bordered dark card (`surface-card`). The result reads like a dashboard rather than a website — uniform boxes stacked from top to bottom with no visual breathing room and no hierarchy. The reference image (Uppit AI) shows the opposite: the hero is completely unbounded, text lives directly on the background, and containment is used sparingly only where it genuinely serves structure. That's the target.

**2. Site architecture:** The four service pages (`/assessment`, `/database-mobilization`, `/ai-implementation`, `/personalized-software`) exist as separate routes but feel disconnected — a visitor lands on the homepage, sees the services grid, clicks through to a detail page, and is suddenly in a completely different context with no easy way to compare phases or move back naturally. The four phases are a _methodology_, not four separate products. They belong together on one screen, navigable as a unit. The separate routes should go away entirely.

The outcome is a **true single-page website** — four routes total (`/`, `/contact`, `/terms`, `/privacy`) — with a redesigned homepage that reads cleanly from top to bottom, and a dedicated contact page that keeps the form separate and extensible.

---

## 2. Architecture Change

### Current routes (7)

- `/` — Homepage
- `/assessment` — Service detail page
- `/database-mobilization` — Service detail page
- `/ai-implementation` — Service detail page
- `/personalized-software` — Service detail page
- `/terms`
- `/privacy`

### Target routes (4)

- `/` — Single-page site (all homepage content, no form)
- `/contact` — Dedicated contact/lead form page
- `/terms`
- `/privacy`

### What happens to service page content

The four service pages each contain a `problem` statement, a list of `outcomes`, and several `sections` with heading + body copy. None of that content disappears — it moves into the methodology carousel on the homepage. Each carousel slide expands into the full detail for that phase. The `ServicePage.vue` component and its four routes are deprecated and removed.

The service-specific content in `src/data/serviceContent.ts` gets restructured to power the carousel, not standalone pages.

---

## 3. New Homepage Section Order

The current order is: Hero → Stakes → Services → Proof → Team → FAQ → Form

The new order:

| #   | Section          | Bounding style                                                                     |
| --- | ---------------- | ---------------------------------------------------------------------------------- |
| 1   | Hero             | Full bleed — two-column on desktop: left text/CTAs, right abstract SVG composition |
| 2   | Stakes           | Full bleed — headline + body copy, no card, no stats here                          |
| 2.5 | Stats Bar        | Full bleed — standalone visual row: three large gold values + labels, no card      |
| 3   | Methodology Tabs | Lightly bounded — the tab panel track has structure but the outer section is open  |
| 4   | Proof            | Full bleed — quote large, logo strip open                                          |
| 5   | Team             | Full bleed — founder cards minimal, just image + name + title                      |
| 6   | FAQ              | Full bleed — open accordion, no card                                               |
| 7   | Closing CTA      | Full bleed — single headline + `/contact` button, no card, directly above footer   |

The form is removed from the homepage entirely and lives at `/contact`. FAQ stays in its current position — this preserves exact parity between the nav anchor order (Services · Results · Team · FAQ) and the visual scroll order on the page. A lightweight closing CTA (headline + single button) sits between FAQ and the footer so a visitor who reads to the bottom has a clear action to take without the page feeling like it ends abruptly.

The Stats bar sits between the stakes copy and the methodology tabs as a deliberate standalone visual pause — three large gold numbers given their own moment before the methodology detail begins. It is not a section in the nav; it has no heading.

---

## 4. Visual Language Rules

### Full bleed by default

Sections live directly on the `#050505` background. No border, no card background, no shadow. The page background _is_ the section background. Whitespace (generous top/bottom padding) creates section separation.

### Contain only when it earns it

The only sections that should use a card/surface treatment are:

- The **`/contact` page form** — a bounded form with a border is correct; it signals “this is an input area”
- Individual founder cards — small contained units make sense for person-level content
- The active methodology tab panel — the content panel has a subtle surface treatment to signal the active state

### Hero layout

The hero uses a two-column layout on desktop (≥ 900px):

- **Left column (~55% width):** eyebrow label, `h1` headline, subheadline, two CTA buttons
- **Right column (~45% width):** abstract SVG composition — a sparse node-and-connection diagram in muted gold and white line strokes. Evokes process flow and systems thinking without being literal. Pure inline SVG, no external asset file.

On mobile/tablet (< 900px) the right column is hidden entirely and the left content centers as a single column. The SVG is decorative only (`aria-hidden="true"`).

This gives the hero visual weight at large viewport widths without resorting to screenshots/mockups or SaaS-style logo grids, which are patterns for product signups — not a high-trust consultancy engagement.

### Container width

The `1120px` max-width container is correct. The change is that it stops being applied as a global wrapper in `App.vue`. Instead each section controls its own container. This allows:

- Hero headlines to break wider on large screens if needed
- Logo marquees and full-bleed decorative elements to extend edge-to-edge
- Section backgrounds to span full viewport width while content stays within the max-width

### Stats bar

The three stats (`72%`, `3x`, `18mo`) are extracted from the stakes section and rendered as a standalone full-width visual row between the stakes copy and the methodology tabs:

- Three items in a single row, evenly spaced, with thin vertical rule dividers between them
- Each item: large gold `clamp()` value (e.g. `3.5rem` minimum) above a small muted label
- No section heading, no card, no border box around each stat
- The row spans the full container width with generous top/bottom padding
- On mobile: stack to a single column, dividers hidden

Rationale: giving the stats their own visual moment between the problem statement (stakes copy) and the solution presentation (methodology tabs) creates a narrative beat — "here's the scale of the problem, here's the proof of the gap, now here's what we do about it." The eyebrow + headline + subtitle pattern is correct but the eyebrow is overused (currently on every single section). Reserve the gold eyebrow label for 3–4 anchoring moments on the page — hero, methodology, proof, and the CTA. The stakes and team sections don't need it.

---

## 5. The Methodology Tab Panel

This is the most significant UX change. The current services grid shows four cards with a `gold-link` that navigates away. The new design keeps everything on one page using a tabbed panel.

### Interaction model

- Four tab buttons in a row across the top of the section: **01 Assessment · 02 Database Mobilization · 03 AI Implementation · 04 Personalized Software**
- Clicking a tab swaps the content panel below it — no scrolling, no animation track, instant content switch
- The active tab has a gold underline/indicator; inactive tabs are muted
- Keyboard navigable (left/right arrow keys move between tabs per ARIA `tablist` spec)
- No page navigation — everything stays in place

**Why tabs, not a scroll carousel:** A scrollable carousel suppresses content discovery — users rarely advance past the first slide. Tabs make all four options visible and equally accessible at all times. For B2B informational content where all four phases are equally important, tabs are the correct pattern.

### What each slide contains

Currently split across `siteContent.ts` (titles, descriptions) and `serviceContent.ts` (problem, outcomes, sections). For the carousel both data sources get merged into a single structure per phase:

```txt
phase: 1
title: "Assessment"
tagline: "..."
description: "..."        ← currently in siteContent.ts
problem: "..."            ← currently in serviceContent.ts
outcomes: [...]           ← derived from section headings in serviceContent.ts
sections: [{ heading, body }, ...] ← the full detail, shown in expanded state
```

### Detail depth

The slide shows the summary (problem + outcomes list). A "See full detail" expand or secondary panel can reveal the full sections content inline — no page navigation needed. This is optional for v1; the summary alone may be sufficient.

### Mobile

On mobile the tab panel collapses to a vertical accordion — each phase label is a tap target that expands the content below it. No horizontal tab row on small screens (too cramped for four long labels).

---

## 6. Navigation Changes

### Remove

- All four service page links from the footer "Explore" column (the pages no longer exist)
- The phase tracker component from `ServicePage.vue` (component goes away with the page)

### Keep

The nav link names stay the same, they just point to homepage anchors:

- **Services** → `/#services` (the carousel)
- **Results** → `/#proof`
- **Team** → `/#team`
- **FAQ** → `/#faq`
- **Start Conversation** → `/contact` (dedicated page, not a scroll anchor)

The "Start Conversation" button in the nav was always visually distinct from the scroll links. Routing it to `/contact` instead of `/#start` is correct — it’s a destination, not a scroll target. Nav anchor order (Services → Results → Team → FAQ) now matches homepage scroll order exactly.

### Footer

The "Explore" column currently lists all four service page routes. Those go away. Replace with:

- Home
- Contact
- Terms
- Privacy

---

## 7. What Stays Exactly As-Is

- Gold accent color system (`#d4a84b`, gradient, glow)
- Dark theme (`#050505` background)
- Inter typeface
- Grain overlay (`grain-overlay`)
- Logo marquee strip
- The testimonial quote and attribution
- Lead form fields and submission logic (no API change) — moves to `/contact`, not removed
- Stats section content (72%, 3x, 18mo)
- Founder content (names, titles, images, LinkedIn) — personal emails removed from public display (see Section 11)
- FAQ content (questions and answers)
- Nav component structure, mobile overlay behavior

---

## 8. What Gets Removed

| Item                                                                                           | Disposition                                                |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/pages/ServicePage.vue`                                                                    | Deleted — content migrated to carousel                     |
| `/assessment`, `/database-mobilization`, `/ai-implementation`, `/personalized-software` routes | Removed from router                                        |
| Phase tracker component/styles                                                                 | Removed                                                    |
| Back-link in service hero                                                                      | Removed (page gone)                                        |
| Service hero section in `ServicePage.vue`                                                      | Removed                                                    |
| Service CTA section in `ServicePage.vue`                                                       | Removed                                                    |
| Footer links to service pages                                                                  | Replaced with simplified footer nav                        |
| `surface-card` on hero, stakes, proof, team, FAQ sections                                      | Removed per new visual rules                               |
| Form / CTA section (`#start`) from homepage                                                    | Moved to `/contact` page                                   |
| Methodology carousel (`pillar-grid`, `pillar-item`)                                            | Replaced by tab panel component                            |
| `home-stack` CSS grid wrapper                                                                  | Restructured — sections lay out naturally in document flow |

---

## 9. What Gets Added / Changed

| Item                  | Change                                                                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero section          | Remove `surface-card`, set `min-height: 100svh` (or 90vh), text centered on background; hero CTA buttons point to `/#services` and `/contact`            |
| `App.vue` container   | Remove global `.container` wrapper; each section owns its own container                                                                                  |
| Methodology tab panel | New component: `MethodologyTabs.vue` — replaces the pillar grid; ARIA `tablist`/`tab`/`tabpanel` roles                                                   |
| `ContactPage.vue`     | New page at `/contact` — the existing `LeadForm.vue` component as-is, with a brief page header. Kept simple for v1; expansion planned for a later phase. |
| Closing CTA section   | New lightweight section above footer: single headline ("Ready to build?") + one `<Button>` to `/contact` — no card, no form                              |
| FAQ section           | Stays in current position; styled as open accordion, `surface-card` removed                                                                              |
| Stats row             | Full bleed — stat items remain as a visual row of large gold value + label; borders and card boxes removed, values/labels stay prominent                 |
| Section eyebrow       | Removed from stakes, team, FAQ — kept on hero, services, proof                                                                                           |
| Footer nav            | Simplified: Home · Contact · Terms · Privacy                                                                                                             |

---

## 10. Open Decisions Before Implementation

These need explicit answers before the technical plan is written:

**A. Carousel depth on v1:** Does each tab panel show only the summary (title + tagline + problem + outcomes), or also the full section detail inline? Summary-only is simpler and sufficient — the goal is to inform and convert, not document. The `serviceContent.ts` detail sections are preserved in the data and wired to a per-tab "Show more" expand toggle, so the full content is accessible without requiring it upfront. **Decision: summary view by default; detail sections available via expand toggle using existing `serviceContent.ts` data.**

**B. Mobile tab panel behavior:** Vertical accordion on mobile (< 768px), full tab row on desktop. **Decision: accordion on mobile, tabs on desktop.**

**C. Route preservation for SEO:** Site is pre-launch; no real indexing risk. **Decision: delete service routes outright, no redirects needed.**

---

## 11. Remaining Detail & Polish Items

These were identified in the UI/UX audit and are not superseded by the architectural changes above. They should be addressed during or after implementation.

### Typography & CSS

- **Section title size:** `section-title` currently maxes at `clamp(1.5rem, 2.9vw, 2.2rem)`. Bump to `clamp(1.75rem, 3.2vw, 2.6rem)` for more visual authority on section headlines.
- **Global `font-size` base:** No explicit `font-size` set on `html`. Add `html { font-size: 16px; }` for predictability.
- **Global `line-height`:** `line-height: 1.65` is repeated in scoped styles throughout the codebase but never set globally. Move to the base reset in `src/styles/base.css`.

### Proof Section

- **Attribution image treatment:** The attribution image slot is a 56px circle — designed for a headshot — but displays the UBL Group company logo. A logo in a headshot circle looks wrong. Change the attribution image to a small rectangular logo display (e.g. `width: auto; height: 28px; border-radius: 0`) instead of a circular crop.
- **Logo marquee opacity:** Currently `0.38` — barely visible, reads as a placeholder. Raise to `0.55–0.65`.

### FAQ

- **No open/close animation:** Native `<details>/<summary>` has no CSS transition. Add a `max-height` or `grid-row` transition so the accordion doesn’t hard-jump on open/close.

### Team Section

- **Founder personal emails:** The current template renders `st@flowmatrixai.com` and `dj@flowmatrixai.com` as public clickable links. These are removed. The founder card will show name, title, and LinkedIn only. Anyone wanting to reach a founder directly will use `/contact`.

### Contact Page (`/contact`)

- **Lead form submit button:** The raw `<button>` in `LeadForm.vue` duplicates the gradient CSS from `Button.vue`. Replace with `<Button type="submit">` for consistency.
- **Form layout:** On desktop (≥ 560px) the name and email fields can sit side-by-side in a two-column layout to use the available width more efficiently.

### Footer

- **Email address:** Footer currently shows `info@flowmatrixai.com`. Confirm this inbox is actively monitored — if not, align with `leads@flowmatrixai.com` or point to `/contact` instead.

### Stats Content (Content Decision — Revisit Later)

- **Stats authenticity:** The three stats (`72%`, `3x`, `18mo`) are framed as outcomes but appear to be industry benchmark averages, not FlowMatrix-specific client results. A sophisticated B2B buyer will question the source. This is tracked in the backlog as **CONTENT-1** and should be resolved before the production go-live: either replace with real client-derived numbers or add attribution ("industry average — [source]").

- **Skip-to-content link:** Add a visually-hidden `<a href="#main-content">Skip to main content</a>` as the first focusable element in `NavBar.vue` or `App.vue`. WCAG 2.1 AA best practice for keyboard users.
- **`prefers-reduced-motion`:** The `logo-marquee` animation and `animate-drift-slow` on the hero orb have no `@media (prefers-reduced-motion: reduce)` guard. Add a rule to pause both when the user has requested reduced motion.
