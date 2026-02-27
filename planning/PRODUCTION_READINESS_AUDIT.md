# FlowMatrix AI Repository: Production Readiness Audit

**Date:** February 27, 2026  
**Environment context:** Staging build/repo review ahead of production cutover next week

## 1. Scope

Comprehensive review of:

- Source code and architecture (`src/`)
- Configuration and content data (`src/config`, `src/data`)
- Build tooling and scripts (`vite`, `vite-ssg`, `scripts/`)
- CI/CD workflow (`.github/workflows`)
- Public assets (`public/`)
- Documentation and operational checklists (`docs/`, `README`, `planning/`)
- Current generated output in `dist/` as produced in this repo snapshot

## 2. Executive Summary

The project is structurally lean and close to production-ready for a static marketing website, but three issues should be treated as cutover blockers:

1. Generated `dist/*.html` files currently do not contain expected SEO head metadata.
2. Template status handling is inconsistent between validation/runtime and SSG inclusion.
3. CI gates are not strict enough for deployment safety (`npm install`, no required type-check in workflow).

Everything else is mostly hardening and maintainability improvement.

## 3. Severity Breakdown

- `High`: 3
- `Medium`: 6
- `Low`: 3

## 4. High Impact Findings

### H1. Built HTML appears to be missing head SEO metadata

**Impact**

- Potential major SEO regression at launch (missing canonical, OG, twitter cards, JSON-LD in final HTML).

**Evidence**

- `dist/index.html:1` and `dist/free.html:1` currently show only charset/viewport and asset tags in `<head>`.
- SEO head helpers are defined and used:
  - `src/lib/seo.ts:21`
  - `src/pages/HomePage.vue:37`
  - `src/pages/FreeIndexPage.vue:112`
  - `src/pages/TemplateDetailPage.vue:97`

**Recommendation**

- Fix head integration with `vite-ssg` + `@unhead/vue` so generated HTML includes title/meta/link/script tags.
- Add a CI smoke check that validates head tags exist in representative built pages (`/`, `/free`, one `/free/:slug`, `/terms`).

### H2. Template status normalization is inconsistent with SSG route inclusion

**Impact**

- `published` content can appear in runtime list/detail but not be statically generated, causing direct URL failures.

**Evidence**

- Runtime defaults unknown/missing status to published:
  - `src/data/templates.ts:43`
- Validator also defaults unknown status to published:
  - `scripts/validate-templates.mjs:30`
- SSG route inclusion only accepts exact `published` status:
  - `vite.config.ts:22`

**Recommendation**

- Enforce strict status validation (`draft | published | archived` only, fail on unknown).
- Share one status normalization strategy across runtime/validator/SSG.

### H3. CI workflow is not strict enough for safe production deploys

**Impact**

- Non-deterministic install behavior and possible type regressions can pass deploy pipeline.

**Evidence**

- Workflow uses `npm install`:
  - `.github/workflows/deploy.yml:35`
- Workflow does not run `npm run type-check`:
  - `.github/workflows/deploy.yml:37`
- Type-check script exists:
  - `package.json:18`

**Recommendation**

- Replace `npm install` with `npm ci`.
- Add required `npm run type-check` prior to build/upload.

## 5. Medium Impact Findings

### M1. Route and content loading strategy can be lighter

**Impact**

- More JS than needed for a marketing site, slower time-to-interactive on low-end devices.

**Evidence**

- Eager route imports:
  - `src/router.ts:2`
- `/free` page imports full templates dataset in main client app:
  - `src/pages/FreeIndexPage.vue:7`

**Recommendation**

- Lazy-load route components via dynamic imports.
- Defer loading of heavy `/free` route content where practical.

### M2. Analytics pageview tracking likely incomplete for SPA navigation

**Impact**

- Underreported traffic and attribution drift in GA4.

**Evidence**

- GA setup happens on mount only:
  - `src/composables/useAnalytics.ts:40`
- No router navigation hook for page_view event.

**Recommendation**

- Add `router.afterEach` pageview tracking with `page_path`, `page_title`, and canonical URL context.

### M3. Legal “Last updated” date is dynamic per build/runtime, not legal versioned

**Impact**

- Legal date does not represent actual policy revision date.

**Evidence**

- `new Date().toLocaleDateString(...)`:
  - `src/pages/TermsPage.vue:7`

**Recommendation**

- Store explicit revision date in content/config and update only when policy text changes.

### M4. Keyboard focus visibility is not consistently explicit

**Impact**

- Accessibility and usability degradation for keyboard users.

**Evidence**

- Strong hover styles, no equivalent global `:focus-visible` treatment:
  - `src/components/ui/Button.vue:81`
  - `src/components/layout/NavBar.vue:174`

**Recommendation**

- Add global and component-level `:focus-visible` styles with clear contrast and outlines.

### M5. `/free` listing renders very long body copy in card context

**Impact**

- Lower scanability and unnecessary DOM/text weight on listing page.

**Evidence**

- Card uses full `template.description`:
  - `src/pages/FreeIndexPage.vue:233`

**Recommendation**

- Introduce short excerpt for list cards or truncate server-side content field for listing context.

### M6. Duplication of normalization/constants creates maintenance drift risk

**Impact**

- Higher chance of subtle behavior mismatch over time.

**Evidence**

- Deployment normalization duplicated:
  - `src/config/deployment.ts:17`
  - `scripts/read-deployment-config.mjs:7`
- Type label/class maps duplicated:
  - `src/pages/FreeIndexPage.vue:19`
  - `src/pages/TemplateDetailPage.vue:37`

**Recommendation**

- Centralize shared normalization and enum/display mappings into reusable modules.

## 6. Low Impact Findings

### L1. Dead or weakly-used code/config paths remain

**Impact**

- Minor cognitive load and drift risk.

**Evidence**

- Unused export:
  - `src/data/templates.ts:134` (`templateSlugs`)
- Possibly unused style utility:
  - `src/styles/base.css:98` (`.section-divider`)
- `shareUrl` validated and typed, but not used in runtime rendering:
  - `src/config/forms.ts:5`
  - `src/data/forms.json:4`

**Recommendation**

- Remove unused exports/styles or wire them intentionally.
- Keep `shareUrl` only if required for operations/documentation; otherwise simplify schema.

### L2. Planning docs contain stale path assumptions

**Impact**

- Documentation trust erosion for future maintainers.

**Evidence**

- Legacy path references in planning asset audit:
  - `planning/ASSET_AUDIT.md:33`

**Recommendation**

- Mark planning docs as historical snapshots or update them to current structure.

### L3. 404 indexing can be explicitly hardened

**Impact**

- Minor SEO hygiene gap.

**Evidence**

- 404 route sets title/description but no explicit robots noindex:
  - `src/pages/NotFoundPage.vue:5`
  - `public/404.html`

**Recommendation**

- Add `noindex,follow` on 404 surfaces.

## 7. Strengths

1. Lean architecture suitable for static marketing delivery.
2. Solid content/config validation baseline (`validate:deployment`, `validate:forms`, `validate:templates`).
3. Automated sitemap/robots generation integrated into build.
4. Motion reduction support is implemented (`prefers-reduced-motion` handling).

## 8. Cutover-Oriented Priority Order (Staging -> Prod)

1. Resolve `H1` (head metadata in built HTML) and verify on built output, not just runtime dev mode.
2. Resolve `H2` (template status consistency) to eliminate hidden route failures.
3. Resolve `H3` (CI hardening) so cutover deploy path is deterministic.
4. Address selected medium issues (`M2`, `M3`, `M4`) before or immediately after cutover window.

## 9. Audit Constraint Note

During this review session, local Node/npm execution was unavailable in the environment (`WSL 1` runtime limitation), so findings are based on full repository inspection plus existing `dist/` artifacts in this workspace snapshot.
