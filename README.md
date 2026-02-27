# flowmatrix-ai.github.io

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
At domain cutover, update `siteUrl` and `allowIndexing` in `deployment.json` and deploy.

## Lead Capture Configuration

Lead capture config is centralized in `src/data/forms.json`:

- `mainGetInTouch`: form used on homepage CTA
- `freeGetAccessNow`: shared form used across `/free/:slug` pages

`src/data/templates.json` is content-only for free resources.
For each `published` template, CI requires:

- `slug`
- `title`
- `description`
- `deliverable_type`

Run locally:

```bash
npm run validate:deployment
npm run validate:forms
npm run validate:templates
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
