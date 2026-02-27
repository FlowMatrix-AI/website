# FlowMatrix AI: Website Implementation Plan (v4.3)

> Status: Historical build record as of February 27, 2026. Active execution is tracked in `docs/staging-to-production-cutover-checklist.md`.

**Version:** 4.3 (Closed for Build Execution)  
**Last Updated:** February 26, 2026  
**Project Lead:** CTO

---

## 1. Objective and Outcome

Primary objective:

- Migrate `flowmatrixai.com` from Vercel/Supabase to a static Vue 3 site on GitHub Pages.
- Preserve practical user-facing parity while reducing long-term complexity.

Execution outcome:

- Build/migration phases are complete in staging.
- Preflight checks passed locally and in CI.
- GitHub Pages deployment is healthy.
- Remaining scope is production cutover and post-cutover validation only.

---

## 2. Final Implemented Architecture

| Component         | Decision in Use                                    | Implementation Notes                         |
| ----------------- | -------------------------------------------------- | -------------------------------------------- |
| Framework         | Vue 3 + Vite + TypeScript                          | Running                                      |
| SSG               | `vite-ssg` + route inclusion from `templates.json` | Running                                      |
| Build Output      | Static `.html` routes in `dist/`                   | Used by sitemap generator                    |
| Hosting           | GitHub Pages + Actions deploy                      | Running                                      |
| Forms             | `src/data/forms.json`                              | `mainGetInTouch` + shared `freeGetAccessNow` |
| Template Content  | `src/data/templates.json`                          | 10 migrated `/free/*` resources              |
| Deployment Config | `src/config/deployment.json`                       | Committed, non-secret                        |
| Analytics         | GA4 `gtag` wrapper                                 | Optional by config, events wired             |
| SEO               | Shared helper + generated sitemap/robots           | Canonical/OG/robots consistent               |

---

## 3. Phase Closeout

### Phase 1: Foundation

**Status:** Complete

- [x] Vue app scaffold + routing + SSG setup.
- [x] Dynamic `/free/:slug` SSG inclusion.
- [x] GitHub Actions Pages workflow.
- [x] `404.html` and static build output validated.

### Phase 2: Design System and Shell

**Status:** Complete

- [x] Core assets and base styles migrated.
- [x] Shared shell components implemented.
- [x] Responsive behavior for core layouts implemented.

### Phase 3: Core Content Migration

**Status:** Complete

- [x] Home, service routes, legal routes, and 404 migrated.
- [x] Route structure aligned with intended production paths.

### Phase 4: Templates and Lead Gen

**Status:** Complete

- [x] `/free` listing and `/free/:slug` detail pages implemented.
- [x] 10 legacy `/free/*` resources migrated into static template data.
- [x] Shared Tally lead flow integrated for free resources.
- [x] Main homepage Tally form integrated.
- [x] Analytics events wired (`view_item`, `generate_lead`).
- [x] Content/config validation scripts wired into CI.

### Phase 5: Verification and Cutover

**Status:** In Progress (Cutover Pending)

Preflight:

- [x] `npm run type-check`
- [x] `npm run validate:content`
- [x] `npm run build`
- [x] CI green and GitHub Pages deploy healthy

Cutover and post-cutover:

- [ ] Production domain cutover
- [ ] TLS/HTTPS confirmation
- [ ] Post-cutover SEO/analytics/form verification

---

## 4. Remaining Work

Only production execution tasks remain:

1. Run staging-to-production checklist.
2. Execute DNS + GitHub Pages domain cutover.
3. Complete post-cutover validation window.
4. Decommission legacy infrastructure after stability window.

See runbook: `docs/staging-to-production-cutover-checklist.md`

---

## 5. Decommission Plan (After Stable Cutover)

After 48 hours of stable production operation:

1. Archive/delete Vercel project.
2. Archive Supabase project.
3. Mark legacy repo archived and point references to `flowmatrix-ai.github.io`.

---

## 6. Document Status

This implementation plan is now closed as the build-execution record.  
Operational execution is tracked in `docs/staging-to-production-cutover-checklist.md`.
