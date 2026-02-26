# FlowMatrix AI: Migration Strategy & Execution Plan (v4 Final)

**Status:** Approved for Execution  
**Date:** February 26, 2026  
**Source:** `Seabass-T/Flowmatrix-AI-Website` (Vercel/React)  
**Target:** `FlowMatrix-AI/flowmatrix-ai.github.io` (GitHub Pages/Vue 3)

---

## 1. Executive Summary

This document defines the definitive path to migrate FlowMatrix.com to a high-performance static site on GitHub Pages.

**Core Directive:** Radical simplification. We are removing the backend entirely. All lead capture moves to Tally. All content becomes static.

**Critical Technical Strategy:**
We will use **`vite-ssg` (Static Site Generation)**.
This provides the best balance:

- **Authoring:** Modern Vue 3 components (Nav, Footer, Pages) for maintainability and consistency with company standards.
- **Output:** Real static HTML files for every route (e.g., `/free/invoice-manager/index.html`) to ensure SEO compatibility with GitHub Pages.
- **Performance:** Instant SPA-style navigation after initial load.

---

## 2. Architecture & Stack

| Component            | Decision                  | Rationale                                                                                         |
| -------------------- | ------------------------- | ------------------------------------------------------------------------------------------------- |
| **Framework**        | Vue 3 + TypeScript + Vite | Company standard. Lightweight, performance-first.                                                 |
| **Routing Strategy** | **SSG (vite-ssg)**        | **CRITICAL:** Generates real `index.html` files for every route. Solves GitHub Pages 404/SEO gap. |
| **Hosting**          | GitHub Pages              | Deploy with GitHub Actions custom workflow (`upload-pages-artifact` + `deploy-pages`).            |
| **Lead Capture**     | Tally.io                  | Zero-maintenance backend. Handles storage, notification, and export.                              |
| **Analytics**        | Google Analytics 4 (GA4)  | Replaces custom database tracking. Standardized on `view_item` and `generate_lead` events.        |
| **Styling**          | Vanilla CSS + Scoped      | Dropping Tailwind to reduce build complexity and dependency overhead.                             |
| **Content**          | Static JSON               | "Database" content (templates) exported to JSON and bundled at build time.                        |

---

## 3. Migration Scope

### 3.1 What we keep (Ported)

- **Domain:** `flowmatrixai.com` (DNS switch required)
- **Assets:** All ~32MB of existing video/images (well within GitHub Pages limits).
- **Routes:** 1:1 mapping of all 10 existing verified routes.
- **Content:** Copy from logic-less `constants.ts` and hardcoded components.

### 3.2 What we drop (Decommissioned)

- ❌ **Supabase:** Database, Auth, Edge Functions, Row Level Security.
- ❌ **Vercel:** Hosting, Analytics, Logs.
- ❌ **React Ecosystem:** Tailwind, shadcn/ui, Radix, framer-motion.
- ❌ **Custom Logic:** `EmailGate.tsx`, `email-storage.ts`, API fetchers.
- ❌ **Legacy:** `newsletter-signup` function, heavy `VisualEffects.tsx` (simplified port).

---

## 4. Key Solutions to Identified Risks

### Risk 1: "SPA on GitHub Pages kills SEO" (HTTP 404s)

**Solution: Explicit SSG Config via `includedRoutes`**

We will configure `vite-ssg` with an `includedRoutes` function that reads `templates.json` and returns all dynamic paths:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import templates from "./src/data/templates.json";

export default defineConfig({
  ssgOptions: {
    includedRoutes(paths) {
      const templatePaths = templates.map(
        (t: { slug: string }) => `/free/${t.slug}`,
      );
      return [...new Set([...paths, ...templatePaths])];
    },
  },
});
```

This ensures a physical HTML file is generated for every template page, guaranteeing 200 responses for valid migrated routes.

### Risk 2: Loss of Granular Analytics

We replace Supabase `template_views` with standard GA4 events:

- `view_item`: fired on `/free/:slug` mount. Params: `{ item_id: slug, item_name: title }`.
- `generate_lead`: fired on successful Tally form completion.

### Risk 3: "No Backend" Limiting CRM Needs

**Solution: Tally Webhooks.**

Tally native integrations/webhooks can send data to Zapier/Make/Airtable instantly. We rely on Tally infrastructure, not our own backend.

---

## 5. Execution Plan

### Phase 1: Foundation (Days 1-2)

- [ ] Initialize Vue 3 + Vite + TypeScript repository.
- [ ] Configure `vite-ssg` with `includedRoutes` for template generation.
- [ ] Set up GitHub Actions custom Pages workflow:
  - Build on push to `main`
  - `actions/configure-pages@v5`
  - `actions/upload-pages-artifact@v4` (path: `dist`)
  - `actions/deploy-pages@v4`
- [ ] Add `public/404.html` custom fallback page (served for unknown routes on GitHub Pages).
- [ ] **Gate 1:** Verify generated output includes `dist/free/<slug>/index.html` for all template slugs.

### Phase 2: Content Migration (Days 2-4)

- [ ] Port assets (`public/`).
- [ ] Port design system (CSS variables for Black/White/Gold theme).
- [ ] Build shell (Nav, Footer).
- [ ] Build static pages (Index, Service Details x4, Legal).
- [ ] Export Supabase `templates` table to `src/data/templates.json`.
- [ ] Build template detail page (dynamic route component).

### Phase 3: Analytics & Lead Capture (Day 5)

- [ ] Implement GA4 (`vue-gtag`) with `view_item` and `generate_lead`.
- [ ] Replace custom Email Gate with Tally Popup/Embed.
- [ ] **Gate 2:** Verify end-to-end flow: landing -> analytics event -> Tally submit -> lead captured.

### Phase 4: Cutover (Day 6)

- [ ] **Pre-Flight:** Lower DNS TTL for `flowmatrixai.com` to 300 seconds (24h prior).
- [ ] **Deploy:** Final push to `main` and confirm successful Pages deployment from Actions artifact.
- [ ] **Pages Config:** Ensure Pages source is `GitHub Actions` and custom domain is set to `flowmatrixai.com` in repository settings.
- [ ] **DNS Switch:** Update apex A records to GitHub Pages IPs and `www` CNAME to `flowmatrix-ai.github.io`.
- [ ] **HTTPS:** Wait for certificate provisioning, then enforce HTTPS.
- [ ] **Post-Flight:** Validate all routes, forms, and GA4 real-time events.

### Phase 5: Cleanup (Day 7+)

- [ ] Archive Vercel project.
- [ ] Archive Supabase project.
- [ ] Benchmark Lighthouse (mobile) >= 90.

---

## 6. Launch Gates (Required)

Launch is blocked until all checks pass:

1. **Routing/SSG:** every expected route has generated HTML and serves correctly.
2. **SEO:** each key route has title, meta description, canonical, and OG tags.
3. **Technical SEO:** `robots.txt`, `sitemap.xml`, and custom `404.html` are present and valid.
4. **Analytics:** `view_item` and `generate_lead` visible in GA4 Realtime during test flow.
5. **Lead Capture:** successful Tally submissions received by configured destination.

---

## 7. Rollback Plan

If the new site fails critically within 2 hours of cutover:

1. Revert DNS (A/CNAME) back to Vercel.
2. Confirm legacy site health.
3. Fix root cause in Vue app.
4. Retry cutover.
