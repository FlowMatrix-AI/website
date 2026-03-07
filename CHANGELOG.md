# Changelog

All notable changes to this project are documented here.

Pre-release versioning uses sequential phase labels aligned to the historical planning and execution at the inception of the project. Versioning should follow to [Semantic Versioning](https://semver.org/) starting at `0.1.0` (see `package.json`).

---

## [0.1.2] — 2026-03-06 — SPA Navigation Fix

### Fixed

- `HomePage.vue` — converted service pillar card `<a :href="phase.href">` links to `<RouterLink :to="phase.href">` to prevent full-page reloads when navigating to service pages within the SPA

---

## [0.1.1] — 2026-03-06 — Broken Link Fixes

### Fixed

- `Footer.vue` — removed dead `<RouterLink to="/free">Free Templates</RouterLink>`; replaced with links to all four service pages (`/assessment`, `/database-mobilization`, `/ai-implementation`, `/personalized-software`) plus Terms and Privacy
- `ServicePage.vue` — removed dead `<Button href="/free">See Free Templates</Button>` from CTA section; CTA now has a single "Start the Conversation" button
- `ServicePage.vue` — converted `<a href="/#services">← All services</a>` back-link to `<RouterLink>` to prevent full-page reload in the SPA

---

The following items are from the initial project planning and execution phases, included here for historical context and traceability of decisions and changes made during the development of the FlowMatrix AI website. They represent the version 0.1.0 in total.

---

## [Phase 5.1] — 2026-03-06 — Remove Free Templates

**Branch:** `deploy/cloudflare-cutover`  
**Decision:** The free templates library (`/free`, `/free/:slug`) will not ship with v0.1.0. The feature can be restored from git history when ready.

### Removed

- `/free` listing page (`FreeIndexPage.vue`) and `/free/:slug` detail page (`TemplateDetailPage.vue`) — routes and SSG output gone
- `TemplateAccessForm.vue` — template access form component
- `functions/api/template-access.ts` — Cloudflare Pages Function for template access form
- `src/data/templates.json`, `templates.ts`, `templateTypes.ts` — all template content and type definitions
- `src/data/templateStatus.mjs`, `templateStatus.d.mts` — template status parsing and type declarations
- `scripts/validate-templates.mjs` — template content CI validator
- `tests/templateStatus.test.ts` — 17 unit tests for template status logic (15 tests remain in suite)
- `validate:templates` npm script

### Changed

- `src/router.ts` — `/free` and `/free/:slug` routes and their lazy-loaded page imports removed
- `vite.config.ts` — dynamic SSG route expansion from `templates.json` removed; config simplified to static routes only
- `src/components/layout/NavBar.vue` — "Free Templates" nav item removed; `/free`-specific `isActive` branch removed
- `scripts/generate-sitemap.mjs` — `/free` and `/free/**` priority/changefreq branches removed
- `scripts/validate-build-artifacts.mjs` — `free.html` and `dist/free/` directory checks removed
- `scripts/validate-head-artifacts.mjs` — `free index` and `free detail` pages removed from head metadata checks
- `package.json` — `validate:content` simplified to `validate:deployment` only
- Site now renders 7 static routes: `/`, `/assessment`, `/database-mobilization`, `/ai-implementation`, `/personalized-software`, `/terms`, `/privacy`

---

## [Phase 5] — 2026-03-06 — Cloudflare Migration

**Branch:** `deploy/cloudflare-cutover`  
**Status:** Staging — pending `allowIndexing` flip and DNS cutover  
**Replaces:** Tally embedded forms and GitHub Pages hosting

### Added

- `functions/api/lead.ts` — Cloudflare Pages Function for homepage CTA form submissions; validates name, email, message, checks honeypot, sends lead notification email via Resend REST API
- `functions/api/template-access.ts` — Cloudflare Pages Function for template sidebar form submissions; validates name, email, template slug/title, same delivery pattern
- `src/components/forms/LeadForm.vue` — native Vue lead capture form with name, email, company (optional), message, and honeypot fields; manages loading and error states internally
- `src/components/forms/TemplateAccessForm.vue` — native Vue template access form with name, email, hidden template slug/title fields, and honeypot
- Honeypot spam protection on both forms: hidden `website` field using CSS `position: absolute` ensures bot rejection without a visible challenge widget
- `tsconfig.functions.json` — TypeScript config for Cloudflare Pages Functions using `@cloudflare/workers-types`
- `@cloudflare/workers-types` dev dependency
- `.dev.vars` added to `.gitignore` for local secrets isolation

### Changed

- `HomePage.vue` — replaced `TallyEmbed` with `LeadForm`; updated analytics event to `lead_source: 'native'`
- `TemplateDetailPage.vue` — replaced `TallyEmbed` with `TemplateAccessForm`; removed `missing-form` fallback and share-link blocks; updated analytics
- `index.html` — removed Tally preconnect hints
- `src/env.d.ts` — removed `TallyWidget` window interface declaration
- All documentation and planning files updated to remove GitHub Pages and Tally references

### Fixed

- `replyTo` field corrected from `reply_to` (snake_case) to `replyTo` (camelCase) in both Resend API payloads — Resend REST API requires camelCase for this field; snake_case would cause a 422 Unprocessable Entity on field validation

### Removed

- `src/components/forms/TallyEmbed.vue`
- `src/data/forms.json`
- `src/config/forms.ts`
- `scripts/validate-forms.mjs`
- `validate:forms` npm script

---

## [Phase 4.1] — 2026-03-05 — Quality Hardening

**Branch:** `main` (via PR #1 from `stage/url-real`)

### Added

- ESLint 10 flat config (`eslint.config.js`) with `@typescript-eslint` strict rules, `eslint-plugin-vue`, and `eslint-plugin-prettier` — enforced in CI
- Vitest 4 test suite — 32 tests across two files: `deploymentNormalization.test.ts` (covers `normalizeSiteUrl`, `normalizeAllowIndexing`, `normalizeMeasurementId`) and `templateStatus.test.ts` (covers `readTemplateStatus`, `isPublishedTemplateStatus`)
- `validate-build-artifacts.mjs` — post-build script verifying presence and structure of critical `dist/` output files
- `validate-head-artifacts.mjs` — post-build script verifying SEO metadata is present in representative built HTML pages
- Husky + `lint-staged` pre-commit hook running `eslint --fix` and `prettier --write` on staged files

### Changed

- GitHub Actions workflow renamed from `deploy.yml` → `ci.yml`; deploy job removed — CI is now a pure quality gate (lint → type-check → test → build → validate); deployments are handled natively by Cloudflare Pages
- `siteUrl` in `deployment.json` set to `https://flowmatrixai.com` (replaced development placeholder)
- CI job renamed to a descriptive label compatible with branch protection rule requirements

---

## [Phase 4] — 2026-02-26 — Production Readiness Remediation

**Branch:** `main`

### Added

- Prettier with `prettier-plugin-vue`; `format` and `format:check` npm scripts added; all source files formatted
- Global `focus-visible` accessibility system (REV-B3): reusable CSS focus ring tokens applied across all interactive elements; keyboard navigation indicators restored
- Build artifact head verification: built HTML pages confirmed to contain `<title>`, canonical link, description meta, OG meta set, Twitter card meta, and JSON-LD script tags for representative routes

### Changed

- Template status handling unified across runtime and SSG (REV-A2): strict contract of `draft | published | archived`; unknown values fail `validate:templates`; status parsing shared between listing filter and SSG route inclusion — guarantees every template visible at runtime has a pre-rendered static page
- CI hardened (H3): `npm install` → `npm ci` for lockfile-faithful installs; `type-check` required before build; post-build artifact validation added as a required gate
- GA4 auto-pageview collection disabled; explicit SPA `page_view` event wired to router `afterEach` hook for accurate single-page navigation tracking (REV-B1)
- Config validation hardened: `deployment.json` and `site.ts` strictly validated at build time; invalid config aborts build
- Internal links converted from `<a href>` to `<RouterLink>` throughout — prevents full-page navigation on in-app route transitions
- `<link rel="preconnect">` hints added for Google Analytics origin; global ambient type definitions centralized in `src/env.d.ts`

### Fixed

- Missing SEO metadata in built HTML pages (H1): `vite-ssg` + `@unhead/vue` head integration corrected; all static routes in `dist/` now contain full metadata at build time

---

## [Phase 3.3] — 2026-02-26 — MVP Closeout

**Branch:** `main`

### Added

- `/free` listing page filter parity: label/category filtering added alongside existing search and deliverable-type filters
- Shared JSON-LD structured data helper applied to home, services, legal, `/free`, and all `/free/:slug` pages
- Lead form UX: explicit expectation messaging added below form; submission confirmation state rendered on success

### Changed

- Service pages: CSS-only layout and hierarchy improvements applied; no new JavaScript interactions introduced

---

## [Phase 3.2] — 2026-02-26 — Visual Polish

**Branch:** `main`

### Changed

- Navigation: scrolled-state clarity improved, active-link treatment added, cleaner layout on mobile
- Footer: hierarchy and spacing tightened
- Homepage: hero visual depth improved, CTA headline/kicker hierarchy strengthened; service cards upgraded with CSS-only border-glow and lift effects; testimonial section given stronger editorial treatment; proof section updated with lightweight logo strip
- `/free` listing: filter section visual hierarchy improved; template card media overlays, badge readability, and hover consistency tightened
- `/free/:slug` detail: excessive vertical empty space removed; layout and form framing tightened
- Team headshots: scaling corrected so images render at intended proportions on all viewport sizes
- Section spacing rhythm and typography hierarchy standardized across all pages

---

## [Phase 3.1] — 2026-02-26 — Free Templates Migration

**Branch:** `main`

### Added

- 10 legacy free resources migrated to `templates.json` with normalized metadata: `slug`, `title`, `description`, `deliverable_type`, `status`, `category`, `tags`
- `/free` listing page with search, deliverable-type, and category filtering
- `/free/:slug` detail page with full template metadata and Tally access form sidebar
- SSG route inclusion driven from `templates.json` — all `published` templates pre-rendered to `dist/free/*.html` at build time
- Staging-to-production cutover checklist added to `docs/`

### Removed

- Legacy resource transfer text files removed from repository

---

## [Phase 3] — 2026-02-26 — Content Migration

**Branch:** `main`

### Added

- Full homepage content: hero, services overview, proof/testimonials, founders section, FAQ, and CTA
- Four service pages: Assessment (`/assessment`), Database Mobilization (`/database-mobilization`), AI Implementation (`/ai-implementation`), Personalized Software (`/personalized-software`)
- Legal pages: Privacy Policy (`/privacy`) and Terms of Service (`/terms`)
- 404 catch-all route (`NotFoundPage.vue`) with `public/404.html` fallback for direct entry
- Build-generated `sitemap.xml` covering all static routes and dynamic `/free/:slug` paths
- `robots.txt` standardized; `allowIndexing` config flag gates `Disallow: /` in pre-production environments
- Tally form embed component (`TallyEmbed.vue`) with centralized form registry (`forms.json`): `mainGetInTouch` (homepage CTA) and `freeGetAccessNow` (template access sidebar)
- SEO artifact generation documented in `docs/`

### Changed

- Navigation updated to reflect complete site structure
- Sitemap generator updated to support `vite-ssg` `.html` output format
- SEO helper applied consistently (canonical, OG, robots meta) across all routes
- `.env` file approach removed; all config values committed directly in `deployment.json` — no environment secrets required by design

---

## [Phase 1–2] — 2026-02-26 — Foundation & Design System Shell

**Branch:** `main`

### Added

- Vue 3.5 + Vite + TypeScript strict project scaffold
- `vite-ssg` static site generation with Vue Router; all routes pre-rendered to `.html` files at build time
- GitHub Actions Pages workflow (`configure-pages`, `upload-pages-artifact`, `deploy-pages`)
- `404.html` fallback for deep-link and direct-entry navigation on GitHub Pages
- Core design system: CSS custom properties (`variables.css`), base reset (`base.css`), animation utilities (`animations.css`)
- Shared layout shell: `NavBar.vue`, `Footer.vue`, reusable `Button.vue` component
- `src/config/deployment.json` committed config pattern: `siteUrl`, `allowIndexing`, `gaMeasurementId` — no environment secrets required
- `useAnalytics.ts` composable: conditional GA4 load gated by `allowIndexing`; `generate_lead` and `view_item` event helpers
- `structuredData.ts` shared JSON-LD builder
- `seo.ts` shared head meta helper (title, canonical, description, OG, Twitter card)

### Removed

- Stale placeholder assets cleared after initial scaffold

---

## [Bootstrap] — 2026-02-26 — Project Initialization

### Added

- Repository initialized: `FlowMatrix-AI/flowmatrix-ai.github.io`
- Vue 3 + Vite project bootstrapped with zero backend dependencies
- Migration source: `Seabass-T/Flowmatrix-AI-Website` (Vercel / React / Supabase)
- Target architecture: static Vue 3 SSG, no runtime server, no database
