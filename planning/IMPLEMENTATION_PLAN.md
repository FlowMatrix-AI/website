# FlowMatrix AI: Website Implementation Plan (v4 Final)

**Version:** 4.1 (Implementation Ready)  
**Date:** February 26, 2026  
**Project Lead:** CTO

---

## 1. Project Overview

### 1.1 Objective

Migrate `flowmatrixai.com` from Vercel/Supabase to a static Vue 3 site on GitHub Pages. Remove all backend code. Preserve visual quality while ensuring SEO-safe routing via Static Site Generation (SSG).

### 1.2 Artifacts

- **Source:** `Seabass-T/Flowmatrix-AI-Website` (Legacy)
- **Target:** `FlowMatrix-AI/flowmatrix-ai.github.io` (New Production)
- **Live Domain:** `flowmatrixai.com`

---

## 2. Final Technical Decisions

| Component      | Final Choice         | Execution Constraint                                                                   |
| -------------- | -------------------- | -------------------------------------------------------------------------------------- |
| **Framework**  | Vue 3 + Vite + TS    | Use router-based app with SSG output.                                                  |
| **Build Tool** | `vite-ssg`           | Must define `includedRoutes` from `templates.json` for dynamic `/free/:slug` pages.    |
| **Styles**     | Vanilla CSS (Scoped) | No Tailwind. Use CSS variables (`#D4A84B`, `#000`, `#FFF`).                            |
| **Hosting**    | GitHub Pages         | Deploy with GitHub Actions custom workflow (`upload-pages-artifact` + `deploy-pages`). |
| **Forms**      | Tally.io             | Embed/Popup only. No custom form backend.                                              |
| **Analytics**  | GA4                  | Canonical events: `view_item`, `generate_lead`.                                        |
| **Head/SEO**   | `@unhead/vue`        | Use route-level SEO metadata from static content.                                      |

---

## 3. Implementation Phases

### Phase 1: Foundation (Days 1-2)

**Goal:** Working SSG scaffold deployed to GitHub Pages via Actions.

1. **Repository Setup**
   - Clean target repo.
   - Initialize Vue 3 + TypeScript + Router.
   - Install dependencies: `vite-ssg`, `@unhead/vue`.

2. **SSG Configuration**
   - Update `src/main.ts` to export `ViteSSG` app.
   - Create `src/data/templates.json` with one test template.
   - Implement `includedRoutes` in `vite.config.ts` to generate `/free/<slug>` pages from JSON.
   - Create `public/404.html` as the custom GitHub Pages unknown-route fallback.

3. **CI/CD Workflow**
   - Create `.github/workflows/deploy.yml` with:
     - build job on `main`
     - `actions/configure-pages@v5`
     - `actions/upload-pages-artifact@v4` (path `dist`)
     - deploy job using `actions/deploy-pages@v4`
   - Use GitHub Pages source = `GitHub Actions`.
   - Do not use `gh-pages` branch deployment in this plan.

4. **Quality Gate 1**
   - Run `npm run build`.
   - Verify generated files:
     - `dist/index.html`
     - `dist/free/<dummy-slug>/index.html`
   - Verify title/meta tags render in generated HTML.

### Phase 2: Design System & Shell (Days 2-3)

**Goal:** Visual parity without legacy styling dependencies.

1. **Assets**
   - Copy required assets from legacy `public/` (logos, videos, icons).

2. **CSS Foundation**
   - Add `src/styles/variables.css` (brand colors, type scale, spacing).
   - Add reset/base styles.
   - Port essential animations only (grain/fade), avoiding heavy runtime effects.

3. **Core Components**
   - Build `NavBar.vue`, `Footer.vue`, and reusable CTA `Button.vue`.

### Phase 3: Content Migration (Days 3-5)

**Goal:** All core static pages complete.

1. Port Home page sections (Hero, Stakes, Pillars, Proof, Founders, FAQ).
2. Port Service pages (4 routes).
3. Port legal pages (`/terms`, `/privacy`).
4. Visual QA on desktop + mobile against current production.

### Phase 4: Templates & Lead Gen (Days 5-7)

**Goal:** Fully static template system + no-backend lead capture.

1. **Data Migration**
   - Export Supabase `templates` table to `src/data/templates.json`.
   - Define TS interface `Template` and validate required fields (`slug`, `title`, `description`, `tallyFormId`, etc.).

2. **Template Routes**
   - Build `/free` listing page.
   - Build `/free/:slug` detail page using static JSON lookup.
   - Inject SEO tags via `@unhead/vue` (title, description, canonical, OG).

3. **Tally + GA4**
   - Embed Tally form.
   - Fire GA4 `view_item` on template page mount.
   - Fire GA4 `generate_lead` on confirmed form completion (redirect/callback/webhook confirmation path).

### Phase 5: Verification & Cutover (Day 8+)

1. **Pre-Flight Checklist**
   - [ ] `npm run build` succeeds.
   - [ ] Every expected route has generated HTML output in `dist/`.
   - [ ] `dist/404.html` exists and renders custom not-found content.
   - [ ] `robots.txt` and `sitemap.xml` present in `dist/`.
   - [ ] Canonical/meta/OG tags validated on all priority pages.
   - [ ] Internal links and static assets pass crawl check.

2. **DNS + Pages Cutover**
   - [ ] Ensure Pages source is `GitHub Actions`.
   - [ ] Set custom domain to `flowmatrixai.com` in Pages settings.
   - [ ] Update DNS:
     - apex A records -> GitHub Pages IPs
     - `www` CNAME -> `flowmatrix-ai.github.io`
   - [ ] Wait for TLS certificate and enforce HTTPS.

3. **Post-Flight Checks**
   - [ ] Submit test Tally forms on representative pages.
   - [ ] Confirm GA4 realtime events (`view_item`, `generate_lead`).
   - [ ] Validate top routes return expected status/content.

---

## 4. Decommissioning Plan

After 48 hours stable production runtime with no critical issues:

1. Archive/delete Vercel project.
2. Archive Supabase project.
3. Mark legacy repo as archived and update pointers to new production repo.

---

## 5. Implementation Exit Criteria

Execution is complete only when all are true:

1. No production dependency on Supabase or Vercel runtime services.
2. All migrated routes serve static HTML with valid SEO metadata.
3. Lead capture works through Tally end-to-end.
4. GA4 events are visible and mapped to dashboard requirements.
5. Domain, DNS, and HTTPS are stable on GitHub Pages.

---

_This document is the implementation source of truth. Any deviation requires explicit approval._
