# Phase 6 — Site Redesign Implementation Plan

**Created:** March 6, 2026  
**Reference:** `planning/REDESIGN_VISION.md`  
**Branch strategy:** `redesign/phase-6` — single branch, merged to `main` when all sprints are green  
**Acceptance gate:** `npm run type-check` + `npm run build` + `npm run validate` pass clean at the end of every sprint
**Feature Branch:** `feat/spa-homepage-redesign`

---

## Overview

Phase 6 converts the site from a multi-route card-stack layout into a clean single-page site with a dedicated `/contact` route. The work is broken into six sprints in strict dependency order. Each sprint is independently deployable to staging and leaves the build in a passing state.

**Target route count after Phase 6:** 4 (`/`, `/contact`, `/terms`, `/privacy`)  
**Components added:** `MethodologyTabs.vue`, `ContactPage.vue`  
**Components removed:** `ServicePage.vue`  
**Files restructured:** `router.ts`, `App.vue`, `src/styles/base.css`, `src/styles/variables.css`, `Footer.vue`, `NavBar.vue`, `HomePage.vue`, `siteContent.ts`

---

## Sprint 1 — Foundation: CSS & Layout Architecture

**Goal:** Restructure the CSS foundation so full-bleed section layout is possible. No visual changes to the end user yet — this is an enabling change.

### 1.1 Add global base resets to `src/styles/base.css`

- Add `html { font-size: 16px; }` to the existing `html` rule block
- Add `line-height: 1.65;` to the `body` rule block
- Remove all duplicate `line-height: 1.65` from scoped styles across components (search and eliminate)

### 1.2 Remove the global `.container` wrapper from `App.vue`

Currently `App.vue` wraps `<RouterView />` in a `<div class="container">`. This forces every page into the same 1120px box regardless of whether it wants full-bleed content.

- Remove the outer `<div class="container">` from `App.vue`
- Each section in `HomePage.vue` (and other pages) will now add its own `<div class="container">` internally where needed
- Add `.container` divs inside each existing `HomePage.vue` section to preserve current layout during the transition period (this is structural scaffolding — visual changes come in Sprint 3)
- Verify all pages (`/terms`, `/privacy`, `/404`) still render correctly within their own layout

### 1.3 Verify

- `npm run type-check` passes
- `npm run build` passes
- All 4 existing routes render without layout breakage

---

## Sprint 2 — Route Cleanup: Remove Service Pages

**Goal:** Delete all four service page routes and their associated code. Data is restructured to serve the upcoming tab panel.

### 2.1 Merge data sources

The tab panel needs a unified data structure per phase. Currently data is split:

- `src/data/siteContent.ts` — `servicePhases[]`: id, phase, title, tagline, description, href
- `src/data/serviceContent.ts` — `serviceBody{}`: problem, sections[]

Create a single exported array `methodologyPhases` in `src/data/siteContent.ts` (or a new `src/data/methodologyContent.ts`) that merges both:

```ts
export interface MethodologyPhase {
  id: string;
  phase: number;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  outcomes: string[]; // derived from section headings
  sections: { heading: string; body: string }[];
}
```

Keep `serviceContent.ts` as the source of truth — just re-export through the new interface. Do not delete `serviceContent.ts` yet; wait until the tab panel consumes it.

### 2.2 Remove service routes from `router.ts`

Remove all four service route entries:

- `/assessment`
- `/database-mobilization`
- `/ai-implementation`
- `/personalized-software`

Remove the `ServicePage` lazy import.

### 2.3 Remove `ServicePage.vue`

Delete `src/pages/ServicePage.vue`.

### 2.4 Update `vite.config.ts` if needed

Confirm that no static SSG route expansion references the four service paths. (These were cleaned up in Phase 5.1 but verify.)

### 2.5 Update `scripts/validate-build-artifacts.mjs`

The four service page HTML files (`assessment.html`, etc.) were added in BV-1. Remove those checks — the files will no longer exist in `dist/`.

### 2.6 Update `scripts/validate-head-artifacts.mjs`

Remove any service page sampling entries added in BV-2.

### 2.7 Update Footer

Remove the four service page `<RouterLink>` entries from the `footer-links-block` "Explore" column. Final footer nav: **Home · Contact · Terms · Privacy** (Contact link is placeholder until Sprint 4 creates the route).

### 2.8 Verify

- `npm run type-check` passes
- `npm run build` passes — `dist/` contains no `assessment/`, `database-mobilization/`, `ai-implementation/`, `personalized-software/` directories
- `npm run validate` passes (build artifacts validator updated)
- Nav and footer links resolve without 404

---

## Sprint 3 — Homepage Visual Redesign: Full Bleed Layout

**Goal:** Apply the new visual language to all homepage sections. Every section moves from `surface-card` to full-bleed. No new components yet — only layout and style changes to `HomePage.vue`.

### 3.1 Hero section

- Remove `surface-card` class
- Set `min-height: 90svh`
- Convert hero inner to a **two-column grid** on desktop (≥ 900px):
  - Left column (~55%): eyebrow, `h1`, subtitle, CTA buttons
  - Right column (~45%): abstract SVG node-connection diagram (inline, `aria-hidden="true"`)
- The SVG is a sparse composition of circles (nodes) connected by thin lines at irregular angles — muted gold (`rgba(212,168,75,0.35)`) and white (`rgba(255,255,255,0.12)`) strokes on the dark background. Approximately 8–12 nodes, 10–15 connecting lines. No animation needed (or a very slow `opacity` pulse on 2–3 nodes if desired).
- Below 900px: right column `display: none`; left content is single-column centered
- Increase `page-title` to `clamp(2.4rem, 6vw, 4rem)` — more visual authority
- Remove `hero-note` element (redundant with subtitle)
- Update hero CTA buttons: primary → `/#services`; ghost → `/contact` (forward reference, resolves in Sprint 4)
- Keep `hero-atmosphere` orb and grain overlay as-is

### 3.2 Stakes section

- Remove `surface-card` class from the section wrapper
- Remove the `stats-grid` and all `stat-item` elements from this section — they move to 3.2a
- Keep section eyebrow removal (handled in 3.7), headline, and body copy
- Add generous top/bottom padding as the sole section separator

### 3.2a Stats bar (new standalone section)

Insert a new section immediately after the stakes section and before the methodology section:

```html
<section class="stats-bar" aria-label="Key outcomes">
  <div class="container">
    <ul class="stats-bar-list">
      <li v-for="stat in homeContent.stakes.stats" :key="stat.label" class="stats-bar-item">
        <span class="stats-bar-value gold-gradient-text">{{ stat.value }}</span>
        <span class="stats-bar-label">{{ stat.label }}</span>
      </li>
    </ul>
  </div>
</section>
```

CSS rules:

```css
.stats-bar {
  padding: var(--space-10) 0;
}
.stats-bar-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  list-style: none;
  padding: 0;
  margin: 0;
}
.stats-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
}
.stats-bar-item + .stats-bar-item {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}
.stats-bar-value {
  font-size: clamp(2.4rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1;
}
.stats-bar-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
}
@media (max-width: 600px) {
  .stats-bar-list {
    grid-template-columns: 1fr;
  }
  .stats-bar-item + .stats-bar-item {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

### 3.3 Services section (placeholder)

- Remove `surface-card` class from section wrapper
- Leave the `pillar-grid` intact for now — it will be replaced in Sprint 5
- This section will be visually incomplete until Sprint 5; that is acceptable on the `redesign/phase-6` branch

### 3.4 Proof section

- Remove `surface-card` class
- Increase `blockquote` quote font size — large, left-aligned pull-quote treatment
- Fix attribution image: change from `border-radius: 50%` circle to a rectangular logo display (`border-radius: 4px; width: auto; height: 28px; object-fit: contain`)
- Raise logo marquee `opacity` from `0.38` to `0.6`

### 3.5 Team section

- Remove `surface-card` class from section wrapper
- Keep individual `founder-card` component cards (small contained units are correct here)
- **Remove founder personal email links** from `founder-links` — LinkedIn only
- Update `siteContent.ts` `founders.team[]` entries: remove `email` field usage in template (field can stay in data for internal use; just stop rendering it)

### 3.6 FAQ section

- Remove `surface-card` class from section wrapper
- Add CSS open/close animation to `<details>/<summary>` items:
  ```css
  details > p {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.25s ease;
  }
  details[open] > p {
    grid-template-rows: 1fr;
  }
  details > p > span {
    overflow: hidden;
  }
  ```
  (Requires wrapping FAQ answer `<p>` content in an inner `<span>`)
- Remove `faq-number` index display (`01`, `02`) — the numbering adds noise without value on an open page

### 3.7 Remove section eyebrows from stakes, team, FAQ

- Delete `<p class="section-eyebrow">` from the stakes, team, and FAQ sections
- Keep on: hero, methodology (services), proof

### 3.8 Add closing CTA section

New lightweight section between FAQ and footer — not a card, not a form, just a conversion nudge:

```html
<section class="section-block section-block--closing-cta">
  <h2>Ready to build?</h2>
  <button to="/contact" size="lg">Start the Conversation</button>
</section>
```

Full bleed, centered, generous vertical padding.

### 3.9 Add `prefers-reduced-motion` guards to `src/styles/animations.css`

```css
@media (prefers-reduced-motion: reduce) {
  .logo-marquee-track {
    animation: none;
  }
  .animate-drift-slow {
    animation: none;
  }
}
```

### 3.10 Bump `section-title` globally

Update `.section-title` in `base.css` or `variables.css`:  
`clamp(1.5rem, 2.9vw, 2.2rem)` → `clamp(1.75rem, 3.2vw, 2.6rem)`

### 3.11 Verify

- `npm run type-check` passes
- `npm run build` passes
- Visual smoke test on staging: hero, stakes, proof, team, FAQ, closing CTA all render correctly
- Services section still shows pillar grid in interim state (expected)

---

## Sprint 4 — Contact Page

**Goal:** Create `/contact` and wire up all nav/footer links pointing to it.

### 4.1 Create `src/pages/ContactPage.vue`

Structure:

```
ContactPage
  page-header (full bleed)
    section-eyebrow: "Get in Touch"
    h1: "Start the Conversation"
    p.page-subtitle: brief sentence (1 line)
  form-section
    surface-card (bounded — form card is correct containment)
      LeadForm.vue (existing component, unchanged)
```

The page uses the existing `LeadForm.vue` exactly as-is. No changes to form fields, the API endpoint, or submission logic.

Add `useHead()` with appropriate title and description meta for the `/contact` route.

### 4.2 Update `LeadForm.vue`

- Replace the raw `<button type="submit">` with `<Button type="submit" size="lg">` from `Button.vue`
- Remove the duplicated inline gradient CSS from `LeadForm.vue` styles
- Add two-column layout for name + email fields at `>= 560px`:
  ```css
  @media (min-width: 560px) {
    .form-row-pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }
  }
  ```
  Wrap the name and email `<div class="form-group">` pairs inside a `<div class="form-row-pair">`.

### 4.3 Add `/contact` route to `router.ts`

```ts
const ContactPage = () => import('./pages/ContactPage.vue');
// ...
{ path: '/contact', name: 'contact', component: ContactPage }
```

### 4.4 Update `scripts/validate-build-artifacts.mjs`

Add `contact.html` to the required artifact list.

### 4.5 Update `scripts/validate-head-artifacts.mjs`

Add `/contact` to the sampled pages for head tag validation.

### 4.6 Update Footer

Replace the Contact placeholder added in Sprint 2 with a live `<RouterLink to="/contact">Contact</RouterLink>`.

### 4.7 Update Nav

Update the "Start Conversation" nav button `href`/`to` from `/#start` to `/contact`.

### 4.8 Update homepage closing CTA button

The `/contact` forward reference added in Sprint 3.8 now resolves — no code change needed, just verify.

### 4.9 Verify

- `npm run type-check` passes
- `npm run build` passes — `dist/contact/index.html` exists
- `npm run validate` passes
- Form on `/contact` submits successfully against the CF Pages Function
- Nav "Start Conversation" button routes to `/contact`

---

## Sprint 5 — Methodology Tab Panel

**Goal:** Replace the `pillar-grid` with the new `MethodologyTabs.vue` component.

### 5.1 Create `src/components/ui/MethodologyTabs.vue`

**Props:** `phases: MethodologyPhase[]`

**Template structure:**

```html
<div class="methodology-tabs">
  <!-- Tab button row -->
  <div role="tablist" aria-label="Implementation phases" class="tab-list">
    <button
      v-for="phase in phases"
      :key="phase.id"
      role="tab"
      :id="`tab-${phase.id}`"
      :aria-controls="`panel-${phase.id}`"
      :aria-selected="activeId === phase.id"
      @click="activeId = phase.id"
      @keydown="handleTabKey"
      class="tab-btn"
      :class="{ 'tab-btn--active': activeId === phase.id }"
    >
      <span class="tab-num">{{ String(phase.phase).padStart(2, '0') }}</span>
      {{ phase.title }}
    </button>
  </div>

  <!-- Panel -->
  <div
    v-for="phase in phases"
    :key="`panel-${phase.id}`"
    role="tabpanel"
    :id="`panel-${phase.id}`"
    :aria-labelledby="`tab-${phase.id}`"
    :hidden="activeId !== phase.id"
    class="tab-panel"
  >
    <p class="panel-phase-label">Phase {{ phase.phase }}</p>
    <h3 class="panel-title">{{ phase.title }}</h3>
    <p class="panel-tagline">{{ phase.tagline }}</p>
    <p class="panel-problem">{{ phase.problem }}</p>
    <ul class="panel-outcomes">
      <li v-for="outcome in phase.outcomes" :key="outcome">{{ outcome }}</li>
    </ul>

    <!-- Expand toggle for full detail -->
    <button class="panel-expand-btn" @click="toggleExpanded(phase.id)">
      {{ expandedId === phase.id ? 'Show less' : 'Show detail' }}
    </button>
    <div v-if="expandedId === phase.id" class="panel-sections">
      <div v-for="section in phase.sections" :key="section.heading" class="panel-section">
        <h4>{{ section.heading }}</h4>
        <p>{{ section.body }}</p>
      </div>
    </div>
  </div>

  <!-- Mobile accordion (visible only < 768px via CSS) -->
  <div class="mobile-accordion">
    <details v-for="phase in phases" :key="`acc-${phase.id}`" class="accordion-item">
      <summary>
        <span class="tab-num">{{ String(phase.phase).padStart(2, '0') }}</span>
        {{ phase.title }}
      </summary>
      <div class="accordion-body">
        <p>{{ phase.tagline }}</p>
        <p>{{ phase.problem }}</p>
        <ul>
          <li v-for="outcome in phase.outcomes" :key="outcome">{{ outcome }}</li>
        </ul>
      </div>
    </details>
  </div>
</div>
```

**Script:**

```ts
const activeId = ref(phases[0].id);
const expandedId = ref<string | null>(null);

function handleTabKey(e: KeyboardEvent) {
  // ArrowRight / ArrowLeft cycle through tabs and move focus
}

function toggleExpanded(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}
```

**CSS rules:**

- `.tab-list`: flex row, gap, border-bottom with gold accent on active
- `.tab-btn--active`: gold underline indicator (`border-bottom: 2px solid var(--color-gold)`)
- `.tab-panel`: `surface-card` treatment — this is one of the approved containment uses
- `.mobile-accordion`: `display: none` at `>= 768px`
- `.tab-list` + all `.tab-panel`: `display: none` at `< 768px` (accordion takes over)
- Panel transition: `opacity` fade on panel swap (`transition: opacity 0.2s ease`)

### 5.2 Replace `pillar-grid` in `HomePage.vue`

- Remove `<ul class="pillar-grid">` and all `<li class="pillar-item">` markup
- Remove the `servicePhases` import (replaced by `methodologyPhases` from Sprint 2.1)
- Add `<MethodologyTabs :phases="methodologyPhases" />`
- Import `MethodologyTabs` component

### 5.3 Clean up `serviceContent.ts`

Now that the data is consumed only through `MethodologyTabs`, remove any exports that are no longer referenced. Keep the file if it still supplies `methodologyPhases`; otherwise it can be deleted in a follow-up.

### 5.4 Verify

- All four tab panels render correct content
- Keyboard navigation (arrow keys) cycles between tabs
- Active tab has gold indicator
- Show detail / Show less toggle works
- Mobile: accordion renders and tab list is hidden below 768px
- `npm run type-check` passes
- `npm run build` passes

---

## Sprint 6 — Polish, Accessibility & Validation

**Goal:** Apply all remaining Section 11 polish items, add accessibility improvements, update all validators, and prepare the branch for merge review.

### 6.1 Skip-to-content link

In `App.vue` or `NavBar.vue`, add as the very first focusable element:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

Add `id="main-content"` to the `<main>` element in `App.vue`.

CSS:

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  z-index: 200;
  padding: var(--space-2) var(--space-4);
  background: var(--color-gold);
  color: #000;
  font-weight: 600;
  border-radius: var(--radius-sm);
  text-decoration: none;
}
.skip-link:focus {
  top: var(--space-2);
}
```

### 6.2 Footer email

Decide and apply: update `info@flowmatrixai.com` in `Footer.vue` to either a known active inbox or replace with a `<RouterLink to="/contact">Get in touch</RouterLink>` text link. Remove the `mailto:` link if replaced.

### 6.3 Final nav audit

Confirm:

- "Start Conversation" → `/contact` ✓ (done in Sprint 4)
- All four hash anchors (`/#services`, `/#proof`, `/#team`, `/#faq`) still resolve correctly to the redesigned sections
- `isActive` logic in `NavBar.vue` correctly highlights the `/contact` link when on that route

### 6.4 Update `scripts/validate-build-artifacts.mjs`

Final state of required artifacts:

- `index.html`
- `contact/index.html`
- `terms/index.html`
- `privacy/index.html`
- `404.html`
- `sitemap.xml`
- `robots.txt`

Remove any remaining service page artifact checks if not already done in Sprint 2.

### 6.5 Update `scripts/generate-sitemap.mjs`

Ensure `/contact` is in the sitemap with appropriate priority (`0.8`) and changefreq (`monthly`). Confirm the four service paths are absent.

### 6.6 Final `npm run validate` clean run

All validators must pass:

- `validate:deployment`
- `validate:build-artifacts`
- `validate:head-artifacts`

### 6.7 Type-check and build

- `npm run type-check` — zero errors
- `npm run build` — clean
- `npm run test` — all 15 unit tests pass

### 6.8 Staging smoke test checklist

- [ ] `/` loads, hero is full-bleed, no card borders anywhere except founder cards, tab panel, and `/contact` form card
- [ ] Tab panel: all four tabs clickable, content swaps, expand toggles work, keyboard navigable
- [ ] Mobile: accordion renders for methodology section, nav overlay works
- [ ] `/contact`: page loads, form submits, success state displays
- [ ] `/terms`, `/privacy`: unaffected
- [ ] `/404`: unaffected
- [ ] Nav anchors: Services, Results, Team, FAQ all scroll correctly
- [ ] "Start Conversation" navigates to `/contact`
- [ ] Footer links all resolve
- [ ] No console errors

---

## Dependency Order Summary

```
Sprint 1 (CSS foundation)
    ↓
Sprint 2 (Remove service routes)
    ↓
Sprint 3 (Homepage full-bleed redesign)
    ↓
Sprint 4 (Contact page)       Sprint 5 (Methodology tabs)
    ↓                                ↓
              Sprint 6 (Polish + validation)
                        ↓
                   Merge to main
```

Sprints 4 and 5 can be worked in parallel if needed — they have no dependency on each other, only on Sprints 1–3 completing first.

---

## Files Changed Summary

| File                                    | Sprint  | Change                                                    |
| --------------------------------------- | ------- | --------------------------------------------------------- |
| `src/styles/base.css`                   | 1, 3    | Global resets; section-title size; skip-link              |
| `App.vue`                               | 1, 6    | Remove container wrapper; add #main-content; skip link    |
| `src/data/siteContent.ts`               | 2       | Add `methodologyPhases` merged type; remove email render  |
| `src/data/serviceContent.ts`            | 2, 5    | Restructured to feed `MethodologyPhase`; may be deleted   |
| `src/router.ts`                         | 2, 4    | Remove 4 service routes; add `/contact`                   |
| `src/pages/ServicePage.vue`             | 2       | **Deleted**                                               |
| `src/pages/ContactPage.vue`             | 4       | **Created**                                               |
| `src/components/ui/MethodologyTabs.vue` | 5       | **Created**                                               |
| `src/components/forms/LeadForm.vue`     | 4       | Button component swap; two-column layout                  |
| `src/pages/HomePage.vue`                | 3, 5    | Full-bleed sections; remove eyebrows; replace pillar grid |
| `src/components/layout/NavBar.vue`      | 4, 6    | Update CTA href; isActive for /contact                    |
| `src/components/layout/Footer.vue`      | 2, 4, 6 | Remove service links; add Contact; fix email              |
| `src/styles/animations.css`             | 3       | prefers-reduced-motion guards                             |
| `scripts/validate-build-artifacts.mjs`  | 2, 4, 6 | Remove service pages; add /contact                        |
| `scripts/validate-head-artifacts.mjs`   | 2, 4    | Remove service pages; add /contact                        |
| `scripts/generate-sitemap.mjs`          | 6       | Add /contact; confirm service pages absent                |
| `vite.config.ts`                        | 2       | Confirm no service route references remain                |
