# flowmatrixai.com website

[![CI](https://github.com/FlowMatrix-AI/website/actions/workflows/ci.yml/badge.svg)](https://github.com/FlowMatrix-AI/website/actions/workflows/ci.yml)

Static FlowMatrix AI website built with Vue 3 + `vite-ssg`.

## Build

```bash
npm run build
```

Build output goes to `dist/`.

## Deployment Configuration

Public deployment settings are versioned in `src/config/deployment.json`:

- `siteUrl`
- `allowIndexing`
- `gaMeasurementId` (optional)

No GitHub Actions secrets or variables are required for these values.
At production cutover, set `allowIndexing: true` in `deployment.json` and deploy. `siteUrl` is already set to `https://flowmatrixai.com`.

## Google Analytics

GA4 property is configured and active.

| Field          | Value                        |
| -------------- | ---------------------------- |
| Stream Name    | Main Website                 |
| Stream URL     | https://www.flowmatrixai.com |
| Stream ID      | 13882383979                  |
| Measurement ID | G-T2M3GJRNEV                 |

The Measurement ID is set in `src/config/deployment.json` (`gaMeasurementId`). Tracking is implemented via `src/composables/useAnalytics.ts` — the gtag.js script is injected dynamically on mount (SSG-safe), with manual page view tracking on each route change.

For future tag management needs, consider migrating to Google Tag Manager: https://support.google.com/tagmanager/answer/12811173

## Lead Capture

Forms are handled by Cloudflare Pages Functions — no third-party embed service.

- `POST /api/lead` — homepage CTA form

Sends email via Resend to `leads@flowmatrixai.com`. Required environment variables in Cloudflare Pages: `RESEND_API_KEY`, `LEAD_RECIPIENT_EMAIL`. For local dev, create `.dev.vars` at the repo root (gitignored).

Run locally:

```bash
npm run validate:deployment
npm run validate:content
```

## SEO Artifacts

- `dist/sitemap.xml` is generated automatically by `scripts/generate-sitemap.mjs`.
- `dist/robots.txt` is generated automatically by `scripts/generate-robots.mjs`.
- Both use committed config from `src/config/deployment.json`.

## Verification

```bash
npm run type-check
npm run build
npm run preview
```
