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
At production cutover, set `allowIndexing: true` (and `gaMeasurementId` if GA4 is ready) in `deployment.json` and deploy. `siteUrl` is already set to `https://flowmatrixai.com`.

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
