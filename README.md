# flowmatrix-ai.github.io

Static FlowMatrix AI website built with Vue 3 + `vite-ssg`.

## Build

```bash
npm run build
```

Build output goes to `dist/`.

## Environment Configuration

Copy `.env.example` to `.env` and set values for your target environment.
CI builds should set equivalent GitHub Actions variables (see `docs/deployment-configuration.md`).

### Staging (GitHub Pages first)

- `VITE_SITE_URL=https://flowmatrix-ai.github.io`
- `VITE_ALLOW_INDEXING=false`
- `VITE_GA_MEASUREMENT_ID` optional (omit until GA is configured)

### Production (domain cutover)

- `VITE_SITE_URL=https://flowmatrixai.com`
- `VITE_ALLOW_INDEXING=true`

## Lead Capture Configuration

Lead capture is fully template-driven in `src/data/templates.json`.
For every `published` template, CI requires:
- `tally_form_id` (non-placeholder)
- `deliverable_url` (valid absolute `http(s)` URL, non-placeholder)

Run locally:

```bash
npm run validate:templates
```

## SEO Artifacts

- `dist/sitemap.xml` is generated automatically by `scripts/generate-sitemap.mjs`.
- `dist/robots.txt` is generated automatically by `scripts/generate-robots.mjs`.
- Both use build-time env (`SITE_URL`/`VITE_SITE_URL`, `ALLOW_INDEXING`/`VITE_ALLOW_INDEXING`).

## Verification

```bash
npm run type-check
npm run build
npm run preview
```
