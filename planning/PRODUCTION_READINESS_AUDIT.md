# Production Readiness Code Audit

**Date:** February 26, 2026
**Auditor:** GitHub Copilot (Senior Architect Role)
**Status:** Ready for Cutover (with recommended polish)

## Executive Summary

The codebase is in excellent shape for a static site. It uses a modern stack (`vite-ssg`, Vue 3, TypeScript) with clean architecture. The recent "hardening" pass addressed the most critical safety issues (like strict template validation).

This audit focuses on "last mile" polish—optimizations that are low effort but offer high returns in user experience, maintainability, and reliability.

## 1. High Value / Low Effort Optimizations (Do Now)

### 1.1 Preconnect to External Origins
**Impact:** Performance (LCP/TBT)
**Context:** We rely heavily on Tally forms for lead capture. The connection to `tally.so` is critical for conversion.
**Recommendation:** Add `preconnect` and `dns-prefetch` tags to `index.html` for Tally and any other critical third parties (e.g., Google Fonts/Analytics).
**Benefit:** Reduces the latency of the first form load by performing DNS lookup and TLS handshake early.

### 1.2 Centralize Global Type Augmentations
**Impact:** Maintainability / Type Safety
**Context:** `window.gtag` and `window.Tally` are currently typed primarily within local files (`useAnalytics.ts`, `TallyEmbed.vue`).
**Recommendation:** Move these augmentations to a central `src/env.d.ts` or `src/types/global.d.ts`.
**Benefit:** Prevents type conflicts and makes global availability explicit to all developers.

### 1.3 Add Global Error Boundary
**Impact:** Reliability
**Context:** Vue 3 apps can crash entirely if an unhandled error occurs during component rendering. Currently, there is no top-level protection.
**Recommendation:** Implement an `onErrorCaptured` hook in `App.vue` or a lightweight ErrorBoundary component to catch runtime errors and log them (to GA4 or console) without unmounting the entire app.
**Benefit:** Prevents "White Screen of Death" for minor component failures.

## 2. Best Practices Review

### 2.1 CSS/Design System
**Status:** **Good.**
The use of CSS variables in `src/styles/variables.css` is clean. The `base.css` handles resets well. The decision to use vanilla CSS with scoped components is appropriate for this scale.

### 2.2 Component Architecture
**Status:** **Good.**
Components are small, focused, and use `script setup`.
- **Observation:** `FreeIndexPage.vue` has a fair amount of filtering logic.
- **Micro-Optimization:** This logic executes on the client. Since the data is static, this is acceptable. For a much larger dataset (1000+ items), we would move this to build-time or a worker, but for current scale (<100 items), client-side filtering is instant and simpler.

### 2.3 Asset Management
**Status:** **Acceptable (Manual).**
Logos and headshots are already `.webp`.
- **Note:** Ensure all new assets added in the future follow this pattern. A CI check or lint rule for image sizes could be added later, but is not blocking now.

### 2.4 Security
**Status:** **Good.**
- **XSS:** No unsafe `v-html` usage found in user-content areas.
- **Tally:** Integration validates origin (`tally.so`).
- **Input:** No backend to exploit (Static Site).

## 3. Recommended Action Plan

1.  **Immediate:** Edit `index.html` to add preconnects.
2.  **Immediate:** Create `src/env.d.ts` and consolidate window types.
3.  **Defer to Post-Launch:** Global error boundary (unless a specific crash is observed).
