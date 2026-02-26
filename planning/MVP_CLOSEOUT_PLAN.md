# FlowMatrix AI: MVP Closeout Plan

**Status:** Proposed  
**Date:** February 26, 2026  
**Goal:** Close MVP with pragmatic parity, then retire the legacy repo from active workspace.

## 1. Scope (What We Will Implement Next)

1. `/free` filter parity (simple): add label/category filtering back to the listing UX.
2. Structured data parity (safe): add JSON-LD where it is maintainable and page-accurate.
3. Lead-flow polish (no backend): improve post-submit messaging/next-step UX for forms.
4. Service-page polish (CSS-only): close remaining visual professionalism gaps without JS-heavy effects.

## 2. Guardrails (Do Not Reintroduce)

1. No Supabase runtime or custom lead backend.
2. No per-template backend email-gate logic.
3. No heavy animation engines or interaction frameworks.
4. Keep all config/content data-driven in committed JSON/TS files.

## 3. Execution Sequence

### Step A: `/free` UX Parity

- Add label/category filter controls to `/free`.
- Keep current search + type filters; avoid overcomplicating state.
- Confirm each template has consistent labels in `templates.json`.

### Step B: JSON-LD Coverage

- Add shared JSON-LD helper/composable for maintainability.
- Implement minimal, valid schema only:
  - Home/services/legal: `WebPage` + site-level `Organization` (if applicable).
  - `/free/:slug`: page-specific content schema where fields are complete.
- Validate with Rich Results Test before merge.

### Step C: Lead Capture UX Tightening

- Improve embed container sizing and spacing consistency for short forms.
- Add explicit post-submit expectation text (what happens next + timing).
- Ensure analytics events map cleanly to visible user actions.

### Step D: Final Visual Pass (Services)

- Apply the same spacing/type hierarchy standards used on home and `/free`.
- Tighten section rhythm and CTA consistency.
- Keep effects CSS-first and low-cost.

## 4. Acceptance Gates (Before Legacy Repo Retirement)

1. `npm run type-check` passes.
2. `npm run validate:content` passes.
3. `npm run build` passes and sitemap/robots are regenerated.
4. Manual QA pass on desktop + mobile for:
   - Home, 4 service pages, legal pages, `/free`, 2 sample template detail pages.
5. Forms test:
   - Main "Get in Touch" submission verified.
   - Shared `/free` "Get Access" submission verified.
6. SEO sanity:
   - Canonical + OG present on priority routes.
   - JSON-LD valid on implemented pages.

## 5. Workspace Transition (Leave Old Site Behind)

After the acceptance gates pass:

1. Freeze legacy repo as read-only reference (no active feature work).
2. Remove `Flowmatrix-AI-Website-SebT` from active workspace in local IDE.
3. Keep legacy repo archived externally for rollback/reference only.
4. Continue all execution in `flowmatrix-ai.github.io` exclusively.

## 6. Definition of Done

1. MVP parity is achieved for high-value flows without architecture regression.
2. The new repo is the single active codebase.
3. Legacy repo is no longer part of day-to-day development workspace.
