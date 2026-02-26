# FlowMatrix AI: MVP Closeout Plan

**Status:** Implementation Complete (Code)  
**Date:** February 26, 2026  
**Goal:** Close MVP with pragmatic parity, then retire the legacy repo from active workspace.

## 1. Implemented Scope

- [x] `/free` filter parity: added label/category filtering alongside search + type.
- [x] Structured data parity: added shared JSON-LD helper and applied to home, services, legal, `/free`, and `/free/:slug`.
- [x] Lead-flow polish: added explicit expectation + submission confirmation messaging and form-size config.
- [x] Service-page polish: applied CSS-only layout/hierarchy improvements without JS-heavy effects.

## 2. Guardrails Kept

- [x] No Supabase runtime or custom lead backend.
- [x] No per-template backend email-gate logic.
- [x] No heavy animation engines/interactions.
- [x] Config/content remain data-driven in committed JSON/TS.

## 3. Acceptance Gates

Automated gates (completed):

- [x] `npm run type-check`
- [x] `npm run validate:content`
- [x] `npm run build` (including sitemap/robots generation)

Manual gates (remaining):

- [ ] Desktop/mobile QA pass on priority routes.
- [ ] Main "Get in Touch" form submission verification.
- [ ] Shared `/free` "Get Access" form submission verification.
- [ ] JSON-LD check in Rich Results Test for representative pages.

## 4. Workspace Transition (Manual)

After manual gates pass:

1. Freeze `Flowmatrix-AI-Website-SebT` as read-only reference.
2. Remove it from active IDE workspace.
3. Continue all execution in `flowmatrix-ai.github.io` exclusively.

## 5. Definition of Done

1. MVP parity is achieved for high-value flows without architecture regression.
2. `flowmatrix-ai.github.io` is the single active codebase.
3. Legacy repo is no longer part of day-to-day workspace.
