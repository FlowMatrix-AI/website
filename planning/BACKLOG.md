# FlowMatrix AI — Post-Phase 4 Backlog

**Created:** March 5, 2026  
**Scope:** All remaining work identified after completing Phase 4 production readiness remediation. All Phase 4 items (REV-A through REV-D) are confirmed closed.

---

## Implementation Status

| Item      | Status         | Notes                                                          |
| --------- | -------------- | -------------------------------------------------------------- |
| OP-1      | Open           | Requires GA4 account setup                                     |
| OP-2      | **Superseded** | Tally replaced entirely by native CF Pages Functions + Resend  |
| OP-3      | Open           | Blocked on OP-1; OP-2 superseded                               |
| BV-1      | **Done**       | Service pages added to `validate-build-artifacts.mjs`          |
| BV-2      | **Done**       | Full OG/Twitter tag set added to `validate-head-artifacts.mjs` |
| DX-1      | **Done**       | ESLint configured, codebase clean, CI gated                    |
| DX-2      | **Done**       | Husky + lint-staged wired to pre-commit                        |
| DX-3      | **Decided**    | Status quo retained — see decision note below                  |
| TEST-1    | **Done**       | 32 unit tests across 2 suites, passing in CI                   |
| TEST-2    | **Decided**    | Deferred — see decision note below                             |
| TD-1      | **Decided**    | Unit tests serve as guard — see decision note below            |
| CONTENT-1 | Open           | Stats authenticity — see Section 6 below                       |

---

## 1. Pre-Production Operational (Blockers for DNS Cutover)

These are not code changes — they are account and configuration tasks that must be resolved before production goes live.

### OP-1 — Set up GA4 and populate `gaMeasurementId`

**What:** Create/configure the production GA4 property and set `gaMeasurementId` in `src/config/deployment.json`.  
**Why:** Analytics is entirely disabled until a valid `G-XXXXXXXX` ID is present. There will be zero measurement data from launch.  
**Acceptance:** `gaMeasurementId` is a valid `G-XXXXXXXX` value in `deployment.json`, `validate:deployment` passes, and `page_view` / `generate_lead` events are visible in GA4 realtime during a staging smoke test.

### ~~OP-2 — Migrate Tally forms to production account~~ — Superseded

Tally was removed entirely and replaced with native Cloudflare Pages Functions (`/api/lead`, `/api/template-access`) sending via Resend. `forms.json`, `forms.ts`, `TallyEmbed.vue`, and `validate-forms.mjs` are all deleted. This item is no longer applicable.

### OP-3 — Update `deployment.json` with production values

**What:** Set `siteUrl` to the main production domain and set `allowIndexing` to `true` in `src/config/deployment.json`.  
**Why:** The site currently deploys as `noindex, nofollow` on every page, and all canonical URLs, sitemap entries, and OG tags point to `flowmatrixai.com`. Both must be correct before search engines and social platforms encounter the production site.  
**Acceptance:** `validate:deployment` passes with the production URL. Sitemap and canonical URLs in a production build reference the correct domain. Generated `robots.txt` allows indexing.  
**Note:** Do this only after OP-1 is complete and the site is stable on staging.

---

## 2. Tooling and Developer Experience

### DX-1 — Add ESLint with CI enforcement

**What:** Install and configure ESLint with `eslint-plugin-vue`, `@typescript-eslint/eslint-plugin`, and `eslint-plugin-vuejs-accessibility` (or equivalent). Add a `lint` script to `package.json`. Add a lint step to the GitHub Actions workflow between type-check and build.  
**Why:** TypeScript strict mode catches type errors, but it does not catch: unused variables, Vue component anti-patterns, accessibility violations, or style/consistency issues that Prettier does not cover. Currently the only guard between a lint regression and a deployed artifact is a developer's eyes.  
**Design notes:**

- Mirror the existing Prettier config semantics (singleQuote, 100 printWidth) to avoid conflicts.
- Start with `eslint:recommended` + `plugin:vue/vue3-recommended` + `@typescript-eslint/recommended` and expand incrementally.
- The `scripts/` directory uses plain `.mjs` and should also be covered by lint.

**Acceptance:** `npm run lint` runs cleanly on the current codebase. A lint failure blocks the CI `build` job.

### DX-2 — Add pre-commit hooks (Husky + lint-staged)

**What:** Install Husky and lint-staged. Configure a pre-commit hook to run Prettier format and ESLint fix on staged files.  
**Why:** The postbuild and CI gates catch issues after the fact. A pre-commit hook catches formatting and lint errors at the point of authoring, before a broken or inconsistently styled commit ever touches the repo.  
**Acceptance:** A commit with a Prettier violation or lint error is blocked pre-commit with a clear error message. Clean commits proceed normally.  
**Note:** DX-1 must be complete before DX-2 can include lint in the hook.

### DX-3 — Resolve JSON data file placement

**What:** Make a deliberate decision about where `templates.json`, `forms.json`, and `deployment.json` live, then move them if the decision is to change the current layout.  
**Why:** Currently `deployment.json` is in `src/config/` while `templates.json` and `forms.json` are in `src/data/`. The inconsistency is a minor DX friction but creates uncertainty about where to look for and place config/data files.  
**Options to evaluate:**

| Option         | Description                                               | Trade-off                                                                                                                                                       |
| -------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A (status quo) | `deployment.json` in `config/`, others in `data/`         | Reflects semantic difference (config vs. content data) but the split is not obvious to newcomers                                                                |
| B              | All three in `src/config/`                                | Centralizes all non-TypeScript structured config; unusual for content data                                                                                      |
| C              | All three in `src/data/`                                  | Consistent location for all raw data; mixes operational config with content                                                                                     |
| D              | Move all three to project root/`config/` (outside `src/`) | Signals they are environment/operational artifacts; aligns with how `deployment.json` is actually used; validation scripts already resolve from `process.cwd()` |

**Recommendation to evaluate:** Option D or A. `deployment.json` is genuinely environment config and arguably belongs outside `src/`. `templates.json` and `forms.json` are content data that the build consumes, making `src/data/` the right home for them. This points back toward A (status quo with explicit documentation) or D for `deployment.json` only.  
**Acceptance:** A decision is made and documented. If files move, all import paths, validation scripts, and CI steps are updated and verified.

**Decision (March 5, 2026):** Option A — status quo retained. The `config/` vs `data/` split reflects a meaningful semantic boundary: `deployment.json` is environment config that varies per deployment. No files moved. (Note: `forms.json` and `templates.json` were subsequently deleted — `forms.json` as part of the Cloudflare migration, `templates.json` when the free templates feature was removed. This item is fully resolved.)

---

## 3. Build Validation Gaps

### BV-1 — Extend `validate-build-artifacts` to cover service pages

**What:** Add the four service route HTML files to the required artifact list in `scripts/validate-build-artifacts.mjs`: `assessment.html`, `database-mobilization.html`, `ai-implementation.html`, `personalized-software.html`.  
**Why:** The current script verifies `index.html`, `terms.html`, `privacy.html`, sitemap, and robots — but the four service pages are not checked. If SSG silently fails to render them, the CI build still passes and broken pages reach production.  
**Acceptance:** `validate:build-artifacts` fails if any of the four service pages are absent or empty in `dist/`. The script passes on a clean build.

### BV-2 — Extend `validate-head-artifacts` to cover the full SEO tag set

**What:** Add checks for the meta tags that `createSeoHead()` produces but `scripts/validate-head-artifacts.mjs` does not currently verify: `og:description`, `og:url`, `og:image`, `og:type`, `og:site_name`, `twitter:title`, `twitter:description`, `twitter:image`.  
**Why:** The current check ensures a baseline (`<title>`, canonical, description, robots, `og:title`, `twitter:card`, JSON-LD), but a regression in the `createSeoHead()` output for the remaining tags would not be caught. All of these tags matter for search result previews and social sharing.  
**Acceptance:** `validate:head-artifacts` checks all eight additional tags against the same sampled pages. The script passes on a clean build and fails when any tag is absent.

---

## 4. Automated Testing

### TEST-1 — Unit tests for data normalization and validation logic

**What:** Add a test runner (Vitest is the natural fit given the existing Vite setup) and write unit tests for the core data normalization modules: `deploymentNormalization.mjs` and related config logic.  
**Why:** These modules are the integrity layer for every piece of content that reaches production. They handle edge cases (null, undefined, wrong types, empty strings) that are easy to break silently.  
**Scope:** Start narrow — pure function inputs/outputs for normalization helpers. Do not attempt component or E2E coverage in this pass.  
**Acceptance:** `npm run test` (or `npm run test:unit`) passes in CI. Coverage includes the normalization happy paths and the primary edge cases for each module.

### TEST-2 — Evaluate E2E test coverage for critical paths

**What:** Assess whether Playwright or a similar E2E framework should be added to cover the highest-value paths: (1) critical routes load correctly from direct URLs, and (2) the homepage lead form submits correctly against a real environment.  
**Why:** Form submission is the primary failure mode with user impact. Build artifact existence checks confirm static output but cannot test runtime function behavior.  
**Note:** This is an evaluation item. The outcome may be "defer until traffic warrants the maintenance cost" — but it should be a deliberate decision, not a default omission.  
**Acceptance:** A decision is documented. If E2E tests are added, they run in CI against the built dist.

**Decision (March 5, 2026):** Deferred. SSG route integrity is already validated by `validate-build-artifacts` and `validate-head-artifacts` post-build. The lead form function (`/api/lead`) can be unit tested in isolation but requires a live Resend account for end-to-end coverage — not suitable for CI. Revisit when the site has stable traffic.

---

## 5. Technical Debt

### TD-1 — Evaluate the `.mjs` + `.d.mts` dual-file pattern

**What:** Assess whether the `deploymentNormalization.mjs`/`.d.mts` pair can be replaced with a single source that both the Vite bundler and Node scripts can consume.  
**Why:** The current pattern works but requires manually keeping `.d.mts` declaration files in sync with their `.mjs` implementations. If either file diverges (added parameter, changed return type, renamed export), the type declarations silently lie without any enforcement.  
**Options to evaluate:**

- Convert to `.mts` (TypeScript ESM) and compile to `dist/` or use `ts-node`/`tsx` in scripts — eliminates the split.
- Use a Vite alias or `tsconfig`/`package.json` exports map to let both consumers import from one `.ts` source at build time and one resolved path at script runtime.
- Keep the current pattern but add a CI linting step that validates the `.d.mts` exports match the `.mjs` exports (simple AST or regex check).

**Acceptance:** A decision is made and either the pattern is replaced or a safeguard against declaration drift is added.

**Decision (March 5, 2026):** Pattern retained. The 15 unit tests in `tests/` directly exercise the `.mjs` implementations. Any behavioral change to a `.mjs` function will surface as a test failure, and any type-level divergence with `.d.mts` will surface as a TypeScript error in the test files when Vitest resolves types. This provides adequate drift protection without a build tooling change. (Note: `templateStatus.mjs`/`.d.mts` were deleted when the free templates feature was removed; only `deploymentNormalization.mjs`/`.d.mts` remains.)

---

## Priority Order (suggested)

| Priority | Item       | Rationale                                                                         |
| -------- | ---------- | --------------------------------------------------------------------------------- |
| 1        | OP-1, OP-3 | Hard blockers; site cannot launch without them (OP-2 superseded)                  |
| 2        | BV-1, BV-2 | Low effort, closes real CI coverage gaps, raises confidence in every future build |
| 3        | DX-1       | Foundational for all code quality enforcement; unblocks DX-2                      |
| 4        | DX-2       | Completes the pre-commit safety layer once DX-1 exists                            |
| 5        | TEST-1     | High-value, narrow scope, natural fit with existing stack                         |
| 6        | DX-3       | Low urgency; resolve when it becomes friction                                     |
| 7        | TEST-2     | Evaluate after TEST-1 is established                                              |
| 8        | TD-1       | Low urgency until the codebase grows or someone is burned by drift                |
| 9        | CONTENT-1  | Must be resolved before production go-live; no code dependency                    |

---

## 6. Content

### CONTENT-1 — Verify or replace homepage stats with FlowMatrix-sourced data

**What:** The three stats displayed in the homepage stakes section (`72%`, `3x`, `18mo`) are currently framed as outcomes but appear to be industry benchmark averages rather than FlowMatrix-specific client results.  
**Why:** A sophisticated B2B buyer evaluating a consultancy will ask “is this your data?” If the numbers are not client-derived, presenting them without attribution is a credibility risk at the exact moment the site is trying to establish trust.  
**Options:**

- Replace with real FlowMatrix client outcome numbers if available
- Add inline attribution: “industry average” with a source citation
- Remove entirely and replace with a different trust signal if no sourced data exists

**Acceptance:** Stats on the homepage are either (a) real FlowMatrix client outcomes, or (b) clearly attributed industry benchmarks with a source. Resolved before production DNS cutover.
