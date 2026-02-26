# flowmatrix-ai.github.io

Static FlowMatrix AI website built with Vue 3 + `vite-ssg`.

## Build

```bash
npm run build
```

Build output goes to `dist/`.

## SEO Artifacts

- `public/robots.txt` is source-controlled and copied to `dist/` during build.
- `dist/sitemap.xml` is generated automatically by `scripts/generate-sitemap.mjs` via `postbuild`.
- Set `SITE_URL` when needed (default: `https://flowmatrixai.com`).

Example:

```bash
SITE_URL=https://flowmatrixai.com npm run build
```
