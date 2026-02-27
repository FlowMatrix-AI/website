# FlowMatrix AI: Visual Polish Plan (MVP Parity)

> Status: Historical planning reference as of February 27, 2026. Use `planning/PRODUCTION_READINESS_REMEDIATION_PLAN.md` for active remediation scope.

**Status:** Proposed  
**Last Updated:** February 26, 2026  
**Owner:** CTO

---

## 1. Goal

Improve aesthetic professionalism and reach approximate visual parity with the legacy site, without reintroducing heavy runtime complexity.

---

## 2. Constraints

- Keep stack simple: Vue + scoped/vanilla CSS.
- Prefer CSS-first effects and shared style utilities.
- Preserve existing SEO/SSG behavior and route coverage.
- Respect `prefers-reduced-motion`.

---

## 3. Non-Goals

- No canvas-heavy background systems.
- No JS-driven card tilt/parallax interactions.
- No backend or data-model expansion for styling work.

---

## 4. Priority Workstreams

### P0: Global Design Polish (Shared)

1. Add reusable atmosphere utilities (aurora gradient layer, subtle grid, refined divider treatments).
2. Standardize section spacing rhythm and typography hierarchy across pages.
3. Improve nav/footer polish (scrolled state clarity, active-link treatment, cleaner footer hierarchy).

**Done when:** shared style primitives exist and are reused (not copied page-by-page).

### P0: Homepage Visual Upgrade

1. Hero: stronger visual depth + improved headline/kicker/CTA hierarchy.
2. Stakes + Services: upgraded card styling (border glow, lift, spacing), CSS-only.
3. Proof: stronger editorial testimonial treatment + lightweight logo strip.
4. Founders, FAQ, CTA: improved hierarchy, trust-signal row under form, cleaner spacing.

**Done when:** homepage feels materially closer to legacy quality on desktop and mobile, without interaction-heavy JS.

### P1: `/free` Experience Polish

1. Strengthen `/free` header/filter visual hierarchy.
2. Improve template card media overlays, badge readability, and hover consistency.
3. Tighten `/free/:slug` layout and form framing (remove excess empty vertical space patterns).

**Done when:** `/free` pages match home design language and read as a single cohesive system.

---

## 5. Execution Order

1. Shared/global style utilities.
2. Homepage section upgrades.
3. `/free` listing/detail polish.
4. Cross-page pass for consistency and cleanup.

---

## 6. Validation Gates

Technical:

- `npm run type-check`
- `npm run validate:content`
- `npm run build`

Manual QA:

- Desktop + mobile visual review.
- Focus/hover states on nav, cards, buttons, forms.
- Reduced-motion behavior sanity check.
- Tally embeds still render correctly on home + `/free/:slug`.

---

## 7. Exit Criteria

1. Visual quality is clearly upgraded versus current staging.
2. No significant complexity regression versus current architecture.
3. SEO metadata, sitemap generation, and SSG output remain unaffected.
