# FlowMatrix AI: Website Implementation Plan (v4.2)

**Version:** 4.2 (Execution Tracking)  
**Last Updated:** February 26, 2026  
**Project Lead:** CTO

---

## 1. Objective and Current Position

Primary objective is unchanged:
- Migrate `flowmatrixai.com` from Vercel/Supabase to a static Vue 3 site on GitHub Pages.
- Preserve practical parity with old-site value while reducing long-term maintenance complexity.

Current position:
- Core platform migration is implemented.
- Remaining work is parity completion (`/free` library scope), staged verification, and DNS cutover.

---

## 2. Implemented Architecture Decisions

| Component | Decision in Use | Implementation Notes |
| --- | --- | --- |
| Framework | Vue 3 + Vite + TypeScript | Running |
| SSG | `vite-ssg` + route inclusion from `templates.json` | Running |
| Build Output | Static `.html` routes in `dist/` | Reflected in sitemap generator |
| Hosting | GitHub Pages + Actions deploy | Running |
| Forms | Centralized in `src/data/forms.json` | `mainGetInTouch` + `freeGetAccessNow` |
| Template Data | Content-only `src/data/templates.json` | No form/deliverable fields |
| Deployment Config | `src/config/deployment.json` | Committed, non-secret, environment-agnostic |
| Analytics | GA4 `gtag` wrapper | Optional by config, events wired |
| SEO | Shared `createSeoHead` helper | Canonical + OG + robots consistency |

---

## 3. Implementation Status by Phase

### Phase 1: Foundation

**Status:** Complete

- [x] Repo initialized with Vue 3 + TypeScript + Router.
- [x] `vite-ssg` integration in `src/main.ts`.
- [x] Dynamic route inclusion for `/free/:slug` in `vite.config.ts`.
- [x] Custom `public/404.html` created.
- [x] GitHub Actions Pages workflow created.
- [x] Build artifact generation confirmed in `dist/`.

### Phase 2: Design System & Shell

**Status:** Complete

- [x] Asset migration to `public/`.
- [x] CSS variables/base/animations established.
- [x] Core shell components implemented (`NavBar`, `Footer`, shared `Button`).

### Phase 3: Core Content Migration

**Status:** Complete (with normal QA pass still pending)

- [x] Home page sections ported.
- [x] Service pages (4 routes) ported.
- [x] Legal pages (`/terms`, `/privacy`) ported.
- [x] Core route structure mapped from legacy app.
- [ ] Final visual QA pass versus legacy (desktop/mobile) still needs formal sign-off.

### Phase 4: Templates + Lead Gen

**Status:** In Progress

- [x] Static `/free` listing and `/free/:slug` detail pages implemented.
- [x] Shared Tally form model implemented for `/free` pages.
- [x] Main CTA Tally form implemented on homepage.
- [x] Template and form validation scripts added and wired into CI.
- [x] GA4 event hooks wired (`view_item`, `generate_lead`).
- [ ] Template catalog parity: current 2 published entries; legacy sitemap indicates 10 `/free/*` routes.
- [ ] Add remaining high-value legacy template entries (prioritized subset first, then full parity target).
- [ ] Validate final UX copy/ordering for free library and detail pages.

### Phase 5: Verification + Cutover

**Status:** Pending

Pre-flight:
- [ ] `npm run type-check`
- [ ] `npm run validate:content`
- [ ] `npm run build`
- [ ] Confirm `dist/sitemap.xml` and `dist/robots.txt` are correct for staging config.
- [ ] Crawl/internal link check.
- [ ] Cross-device visual sanity pass.

Cutover:
- [ ] Set Pages custom domain (`flowmatrixai.com`).
- [ ] Lower TTL and perform DNS update (Apex + `www` CNAME).
- [ ] Verify TLS issuance and enforce HTTPS.

Post-cutover:
- [ ] Verify representative route rendering and metadata.
- [ ] Submit and validate Tally flows (home + free detail flow).
- [ ] Verify GA4 realtime events.

---

## 4. Remaining Path to Approx Parity

### 4.1 Must-Have for MVP Parity

1. Expand `/free` content coverage toward old-site set (legacy had 10 live free routes).
2. Complete formal QA and pre-flight checks in staging.
3. Cut over domain only after above checks pass.

### 4.2 Intentionally Out of Scope for MVP

1. Re-introducing backend complexity (Supabase tracking, custom gate APIs, etc.).
2. Re-creating heavy legacy UI/runtime behaviors with low conversion impact.
3. Adding per-template bespoke form backends.

### 4.3 Practical Parity Principle

If a legacy feature adds substantial complexity but limited user/business value, keep the simplified implementation.  
Parity target is user-facing outcomes and SEO/lead integrity, not code-path equivalence.

---

## 5. Decommission Plan (After Stable Cutover)

After 48 hours of stable production operation:

1. Archive/delete Vercel project.
2. Archive Supabase project.
3. Mark legacy repo archived and point all references to `flowmatrix-ai.github.io`.

---

## 6. Exit Criteria

Implementation is complete when all are true:

1. No production runtime dependency on Supabase/Vercel.
2. Intended migrated routes serve static HTML with correct metadata.
3. Lead capture works end-to-end through Tally.
4. GA4 events are confirmed in production.
5. Domain + DNS + HTTPS are stable on GitHub Pages.
