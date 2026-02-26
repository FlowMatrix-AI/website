# FlowMatrix AI: Migration Strategy & Execution Plan (v4.2)

**Status:** In Progress (MVP Parity Pass)  
**Last Updated:** February 26, 2026  
**Source:** `Seabass-T/Flowmatrix-AI-Website` (Vercel/React/Supabase)  
**Target:** `FlowMatrix-AI/flowmatrix-ai.github.io` (GitHub Pages/Vue 3/SSG)

---

## 1. Executive Summary

This migration is actively underway and the new site is live in staging shape within the `flowmatrix-ai.github.io` repo.

Core directive remains unchanged:
- Remove backend runtime complexity.
- Preserve high-value user experience and route coverage.
- Reach practical parity with the old site without reintroducing disproportionate bloat.

---

## 2. Current Architecture (Implemented)

| Component | Implemented Choice | Notes |
| --- | --- | --- |
| Framework | Vue 3 + TypeScript + Vite | Implemented |
| Routing | `vite-ssg` + Vue Router | Implemented; generated output is static `.html` pages |
| Hosting | GitHub Pages via Actions | Implemented (`configure-pages`, `upload-pages-artifact`, `deploy-pages`) |
| Lead Capture | Tally embeds | Implemented with centralized form config |
| Analytics | GA4 via lightweight `gtag` wrapper | Implemented; load/event behavior controlled by config |
| Styling | Vanilla CSS + scoped styles | Implemented |
| Content | Static JSON (`templates.json`) | Implemented; now content-only |
| Deployment Config | Committed config (`src/config/deployment.json`) | Implemented; no env secrets/vars required |

---

## 3. Scope Rules (For MVP Parity)

### 3.1 Keep / Reach

- 1:1 route coverage for core marketing and legal routes.
- High-confidence parity for homepage + service pages + legal pages.
- Practical parity for `/free` library where SEO/value impact is highest.

### 3.2 Intentionally Drop

- Supabase runtime (queries, tracking tables, RLS policies, Edge Functions).
- Vercel runtime dependencies.
- Per-template backend/email gate complexity.
- UI complexity that does not materially affect conversion or clarity.

---

## 4. Execution Status

### Phase 1: Foundation

- [x] Vue 3 + Vite + TypeScript scaffolded.
- [x] `vite-ssg` configured with `includedRoutes` from template slugs.
- [x] GitHub Pages Actions workflow implemented.
- [x] `public/404.html` implemented.
- [x] Static route generation validated in `dist/` (current output format is `.html` files, not nested `index.html`).

### Phase 2: Content Migration

- [x] Core assets migrated into `public/`.
- [x] Base design system and shell components implemented.
- [x] Core static pages implemented (`/`, 4 service routes, `/terms`, `/privacy`, `404`).
- [x] `/free` listing + detail routes implemented.
- [~] Free-template catalog parity is partial (2 templates present; additional legacy high-value entries still pending).

### Phase 3: Analytics & Lead Capture

- [x] Tally integration implemented for main CTA (`mainGetInTouch`) and shared `/free` access form (`freeGetAccessNow`).
- [x] Template-level and home lead analytics events wired (`view_item`, `generate_lead`).
- [x] Config/validation model implemented (`deployment`, `forms`, `templates` validators in CI).
- [ ] Gate validation still required in staging: end-to-end event verification in GA4 realtime and successful Tally receipt for representative flows.

### Phase 4: Cutover

- [ ] DNS TTL lower + cutover execution.
- [ ] Pages custom domain config (`flowmatrixai.com`).
- [ ] TLS confirmation and post-cutover validation.

### Phase 5: Legacy Decommission

- [ ] Archive Vercel project (after stable cutover window).
- [ ] Archive Supabase project.
- [ ] Mark legacy repo archival status.

---

## 5. Remaining Path to MVP Parity (No Bloat)

### Priority A: Parity-Critical (Do Next)

1. Expand `src/data/templates.json` from 2 entries toward the legacy high-value set (legacy sitemap currently indicates 10 `/free/*` pages).
2. Complete staged QA pass:
   - Route rendering and links
   - Mobile and desktop visual checks
   - Form submissions and analytics events
3. Lock go-live checklist in planning docs with explicit pass/fail status.

### Priority B: Quality Hardening

1. Verify sitemap/robots output on every build.
2. Verify canonical/OG coverage across all priority routes.
3. Run crawl-based broken-link/asset checks before cutover.

### Priority C: Cutover + Focus Shift

1. Cut domain to new site only after Priority A+B pass.
2. Keep legacy repo read-only/archive after stability window.
3. Continue product iteration in the new repo only.

---

## 6. Launch Gates (Must Pass)

1. Routing/SSG: All intended routes serve correctly from generated static output.
2. SEO: Title, description, canonical, OG metadata present on priority pages.
3. Technical SEO: Valid `robots.txt`, `sitemap.xml`, and `404.html`.
4. Analytics: `view_item` and `generate_lead` observable in GA4 realtime.
5. Lead Capture: Tally submissions received for both main CTA and `/free` flow.

---

## 7. Rollback Plan

If critical issues appear shortly after cutover:

1. Revert DNS to legacy Vercel endpoint.
2. Confirm legacy site health.
3. Patch issue in new repo.
4. Re-run cutover checklist and retry.
