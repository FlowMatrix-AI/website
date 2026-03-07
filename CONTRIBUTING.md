# Contributing

## Stack

Vue 3.5 + vite-ssg (static site generation) + TypeScript strict. Hosted on Cloudflare Pages.

## Setup

```bash
npm install
npm run dev
```

Requires Node 20+. No other dependencies to install — form handling runs as Cloudflare Pages Functions, not locally.

For local form testing, create `.dev.vars` at the repo root (gitignored):

```
RESEND_API_KEY=re_...
LEAD_RECIPIENT_EMAIL=leads@flowmatrixai.com
```

## Branch & PR Workflow

- `main` is protected — no direct pushes. All changes go through a pull request.
- Branch from `main`. Name your branch by type: `feat/`, `fix/`, `chore/`, `docs/`.
- CI must pass before merging. Cloudflare Pages automatically builds a preview for every branch — review it before opening a PR.
- Squash or rebase before merging to keep history clean.

## Commit Style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add contact form validation
fix: correct mobile nav z-index
chore: bump dependencies
docs: update deployment reference
ui/ux: revise hero layout
```

Use the scope in the subject line only, no body required for small changes.

## Before Opening a PR

```bash
npm run type-check                  # TypeScript — must pass
npm run lint                        # ESLint — fix any errors
npm run build                       # Full build + postbuild checks
npm run validate:build-artifacts    # Verify dist output
```

Husky runs `type-check` and `lint` automatically on commit.

## Key Directories

| Path                         | Purpose                                                  |
| ---------------------------- | -------------------------------------------------------- |
| `src/pages/`                 | One file per route                                       |
| `src/components/`            | `layout/`, `ui/`, `forms/`                               |
| `src/data/`                  | Content — edit here, not in page files                   |
| `src/config/deployment.json` | Deployment config (siteUrl, indexing, GA4)               |
| `functions/api/`             | Cloudflare Pages Functions (form endpoints)              |
| `docs/`                      | Operational docs                                         |
| `planning/`                  | Project planning docs — for AI agents and team reference |

## Versioning & Changelog

This project follows [Semantic Versioning](https://semver.org/). We're pre-1.0, so all releases are `0.x.y`:

| Change type                                | Bump              |
| ------------------------------------------ | ----------------- |
| Breaking change or significant new feature | `0.x+1.0` (minor) |
| Non-breaking feature, UI/UX improvement    | `0.x.y+1` (patch) |
| Bug fix, chore, refactor, docs             | `0.x.y+1` (patch) |

**Every PR that changes user-facing code or project structure must:**

1. Bump `"version"` in `package.json`
2. Prepend an entry to `CHANGELOG.md` in this format:

```markdown
## [0.x.y] — YYYY-MM-DD — Short Label

### Added / Changed / Removed / Fixed

- `ComponentName` — what changed and why
```

Use `### Added`, `### Changed`, `### Removed`, or `### Fixed` as appropriate — include only the headings that apply. Pure doc or chore PRs still get a changelog entry and a patch bump.

## Content Changes

All page copy lives in `src/data/` — `siteContent.ts`, `methodologyContent.ts`, `legalContent.ts`. Edit those files rather than page components directly.

## Deployment

See [docs/deployment.md](docs/deployment.md) for the full deployment reference, environment variables, and the staging → production cutover checklist.
