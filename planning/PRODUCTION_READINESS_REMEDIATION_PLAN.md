# FlowMatrix AI: Production Readiness Remediation Plan

**Date:** February 27, 2026  
**Source Audit:** `planning/PRODUCTION_READINESS_AUDIT.md`  
**Context:** Staging hardening plan for production cutover during week of March 2, 2026

## 1. Purpose

Convert all identified audit findings into a formal, execution-ready remediation plan with:

1. Full assessment of each finding.
2. The proper fix approach (pragmatic, non-rewrite).
3. Acceptance criteria and verification method.
4. Pre-cutover vs post-cutover disposition.

## 2. Decision Framework

An item is `Pre-Cutover Required` if it can directly cause:

1. SEO/indexing failure.
2. Broken route behavior from direct entry/share links.
3. Unsafe or non-deterministic deployment outcomes.

An item is `Pre-Cutover Recommended` if it materially improves reliability, measurement, or accessibility with low implementation risk.

An item is `Post-Cutover Planned` if value is real but not cutover-blocking.

## 3. Finding Disposition Matrix

| ID  | Severity | Decision                          | Target Window                                           |
| --- | -------- | --------------------------------- | ------------------------------------------------------- |
| H1  | High     | Pre-Cutover Required              | Before prod DNS cutover                                 |
| H2  | High     | Pre-Cutover Required              | Before prod DNS cutover                                 |
| H3  | High     | Pre-Cutover Required              | Before prod DNS cutover                                 |
| M1  | Medium   | Pre-Cutover Recommended           | Prefer before cutover; otherwise immediate post-cutover |
| M2  | Medium   | Pre-Cutover Recommended           | Before cutover                                          |
| M3  | Medium   | Pre-Cutover Recommended           | Before cutover                                          |
| M4  | Medium   | Pre-Cutover Recommended           | Before cutover                                          |
| M5  | Medium   | Post-Cutover Planned              | Week 1 post-cutover                                     |
| M6  | Medium   | Mixed (partial pre, partial post) | See item details                                        |
| L1  | Low      | Post-Cutover Planned              | Week 1-2 post-cutover                                   |
| L2  | Low      | Post-Cutover Planned              | Week 1-2 post-cutover                                   |
| L3  | Low      | Pre-Cutover Recommended           | Before cutover                                          |

## 4. Detailed Item Assessments and Proper Fixes

### H1. Built HTML appears to miss SEO head metadata

**Assessment**

- This is a launch blocker if confirmed in fresh CI/staging artifacts.
- Root cause is likely head integration mismatch (dependency/version wiring and/or `main.ts` head bootstrap pattern), or stale artifacts.
- Risk surface includes missing title/canonical/OG/twitter/JSON-LD in static output.

**Proper Fix**

1. Align head integration with supported `vite-ssg` pattern.
2. Remove non-required manual head bootstrapping if it conflicts with SSG-managed head handling.
3. Ensure dependency compatibility between `vite-ssg` and `@unhead/vue` versions.
4. Add build artifact verification script (for representative routes) to fail CI when expected tags are missing.

**Acceptance Criteria**

1. Built `dist/index.html`, `dist/free.html`, one `dist/free/*.html`, and `dist/terms.html` include:
   - `<title>`
   - canonical link
   - description + robots
   - OG meta set
   - twitter card meta set
   - JSON-LD script tags where configured
2. CI fails if metadata checks fail.

**Risk / Rollback**

- If dependency upgrade causes breakage, pin to known-compatible versions and keep artifact-check gate as hard safety net.

### H2. Template status handling inconsistency can create route/content mismatch

**Assessment**

- Current behavior can allow a template to appear in runtime while not being pre-rendered.
- This creates share-link failure risk and undermines static routing guarantees.

**Proper Fix**

1. Define strict status contract: only `draft`, `published`, `archived`.
2. Make validator fail on unknown status values (do not coerce to published).
3. Share one status parsing helper across runtime and SSG inclusion logic.
4. Keep SSG inclusion and runtime listing rules exactly identical.

**Acceptance Criteria**

1. Unknown status causes `npm run validate:templates` to fail.
2. Every template shown in `/free` is statically generated in `dist/free/*.html`.
3. No published template slug is missing from SSG route set.

**Risk / Rollback**

- Low risk. Main operational impact is stricter content validation (intentional).

### H3. CI deploy pipeline not strict enough

**Assessment**

- `npm install` can produce non-deterministic lockfile behavior.
- Missing type-check allows static deploy with type regressions.

**Proper Fix**

1. Replace `npm install` with `npm ci` in GitHub Actions.
2. Add `npm run type-check` as required step before build.
3. Add post-build verification step for critical artifacts (`sitemap.xml`, `robots.txt`, head-check script).

**Acceptance Criteria**

1. CI uses lockfile-faithful install (`npm ci`).
2. Deploy job is blocked by type errors.
3. Build artifact checks run and fail fast on regressions.

**Risk / Rollback**

- Very low. If new gate fails, fix source or content; do not bypass.

### M1. Route/content loading strategy heavier than required

**Assessment**

- Current eager imports increase initial JS for a marketing site.
- Not a blocker, but useful for performance and perceived speed.

**Proper Fix**

1. Convert route components to dynamic imports for non-critical routes.
2. Keep home route optimized for first paint; split `/free` and legal/service chunks.
3. Optionally define manual chunks for template-heavy pages.

**Acceptance Criteria**

1. Main app chunk size decreases measurably from current baseline.
2. Route navigation still functions identically.
3. No SEO/SSG regression in output structure.

**Risk / Rollback**

- Low risk; rollback is reverting import mode.

### M2. SPA pageview tracking likely undercounted

**Assessment**

- Event tracking currently focuses on custom events; navigation pageviews likely incomplete.
- This affects attribution and funnel analysis during early production period.

**Proper Fix**

1. Add `router.afterEach` hook to emit `page_view` on route change.
2. Configure GA init to avoid double-counting (manual pageview strategy).
3. Include route path and document title in payload.

**Acceptance Criteria**

1. Internal route navigation generates one page_view per route change.
2. No duplicate page_view firing on first load.
3. Existing `view_item` and `generate_lead` remain intact.

**Risk / Rollback**

- Low risk; rollback by disabling router hook.

### M3. Legal last-updated date is dynamic and non-authoritative

**Assessment**

- `new Date()` is not legally meaningful for policy revision tracking.
- Could create compliance confusion.

**Proper Fix**

1. Move legal revision dates into static content/config (explicit date strings).
2. Render those values directly in legal pages.
3. Update date only when text changes.

**Acceptance Criteria**

1. Terms/Privacy show stable, intentional revision dates.
2. Date does not change per build unless content changed.

**Risk / Rollback**

- Minimal risk.

### M4. Focus visibility and keyboard navigation polish needed

**Assessment**

- Hover polish is strong; keyboard focus affordance is not consistently explicit.
- Accessibility quality issue, especially for nav/buttons/forms.

**Proper Fix**

1. Add global `:focus-visible` ring styles for links, buttons, form controls.
2. Ensure local component styles do not suppress global focus indicators.
3. Verify contrast and visibility against dark surfaces.

**Acceptance Criteria**

1. Keyboard tab order is visible and obvious across primary UI controls.
2. Focus ring passes contrast checks on key surfaces.

**Risk / Rollback**

- Minimal risk; visual-only behavior.

### M5. `/free` listing cards use long descriptions

**Assessment**

- Reduces scanability and adds unnecessary text payload on listing pages.
- Not a cutover blocker.

**Proper Fix**

1. Add short `summary` field to template schema for listing contexts.
2. Update validator to enforce summary presence/length for published entries.
3. Render summary in listing cards; keep full description in detail pages.

**Acceptance Criteria**

1. Listing cards show concise summaries.
2. Detail pages retain complete content.
3. Content validation prevents missing/overlong summaries.

**Risk / Rollback**

- Low risk; requires content touch across template entries.

### M6. Duplication in constants/normalization logic

**Assessment**

- Some duplication is benign in a small codebase, but current drift points are real.
- Not all duplication needs immediate removal.

**Proper Fix**

1. Pre-cutover: centralize template type label/class maps into shared module.
2. Pre-cutover: centralize template status constants/helpers used by runtime and SSG.
3. Post-cutover: evaluate deployment normalization duplication between runtime and scripts; either consolidate or keep with explicit contract tests.

**Acceptance Criteria**

1. Template type map exists in one source.
2. Status parsing behavior is identical wherever used.
3. Deployment config parsing behavior is tested/documented even if dual-implemented.

**Risk / Rollback**

- Low-to-medium risk if over-refactored before cutover; keep scope tight.

### L1. Dead/weakly-used code paths

**Assessment**

- Small maintainability tax; not cutover-blocking.

**Proper Fix**

1. Remove unused exports/styles confirmed unused.
2. For `shareUrl`, decide one of:
   - Keep and use it in runtime fallback/help states.
   - Remove from schema/validation if not needed operationally.

**Acceptance Criteria**

1. No confirmed unused exported symbols remain.
2. Form schema reflects actual runtime usage intent.

**Risk / Rollback**

- Minimal risk.

### L2. Planning docs stale relative to current structure

**Assessment**

- Operational confusion risk if historical documents are treated as active truth.

**Proper Fix**

1. Mark older planning docs as `Historical` or refresh them.
2. Maintain one canonical execution checklist for cutover.

**Acceptance Criteria**

1. No stale planning doc appears as active operational source-of-truth.
2. Cutover team references one current checklist.

**Risk / Rollback**

- No technical risk.

### L3. 404 pages should explicitly noindex

**Assessment**

- Minor SEO hygiene improvement; low effort and safe.

**Proper Fix**

1. Add `robots` noindex meta to routed 404 component.
2. Add equivalent noindex meta in static `public/404.html`.

**Acceptance Criteria**

1. 404 responses contain explicit noindex directives.

**Risk / Rollback**

- Minimal risk.

## 5. Planned Revision Set

### Revision Set A (Pre-Cutover Required)

1. `REV-A1`: H1 head metadata and artifact validation.
2. `REV-A2`: H2 status consistency and strict validation.
3. `REV-A3`: H3 CI hardening (`npm ci`, `type-check`, artifact checks).

### Revision Set B (Pre-Cutover Recommended)

1. `REV-B1`: M2 pageview tracking.
2. `REV-B2`: M3 static legal revision dates.
3. `REV-B3`: M4 focus-visible accessibility pass.
4. `REV-B4`: L3 explicit noindex for 404.

### Revision Set C (Time-Permitting Pre-Cutover / Immediate Post-Cutover)

1. `REV-C1`: M1 lazy route/code splitting.
2. `REV-C2`: M6 partial dedupe (template maps/status helpers).

### Revision Set D (Post-Cutover Cleanup)

1. `REV-D1`: M5 summary-field content model for `/free` cards.
2. `REV-D2`: L1 dead code/schema cleanup.
3. `REV-D3`: L2 planning docs archival/refresh.
4. `REV-D4`: M6 deployment normalization consolidation decision.

## 6. Verification Plan

For pre-cutover completion, all must pass:

1. CI:
   - `validate:content`
   - `type-check`
   - `build`
   - artifact verification checks
2. Staging functional:
   - all primary routes render correctly
   - `/free` listing/detail direct links resolve
   - Tally submission flows work
3. SEO/technical:
   - expected head metadata present in generated HTML
   - `robots.txt` and `sitemap.xml` reachable and correct
4. Analytics:
   - `page_view` (after M2), `view_item`, `generate_lead` visible in GA4 realtime

## 7. Cutover Go/No-Go Criteria

`Go` only if:

1. Revision Set A is complete and verified.
2. No unresolved P0 issue in staging smoke test.
3. Cutover checklist in `docs/staging-to-production-cutover-checklist.md` is fully green.

`No-Go` if any of the above fails.

## 8. Implementation Guardrails

1. No architectural rewrites before cutover.
2. Favor small, testable changes with clear rollback.
3. Keep content/config validation as strict as possible.
4. Do not bypass failing gates for schedule reasons.
