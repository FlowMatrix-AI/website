# Deployment Reference

**Host:** Cloudflare Pages — `main` branch → `flowmatrixai.com` (production). All other branches → Cloudflare preview deployments.

**Branch protection:** `main` is protected. All changes must go through a pull request. CI must be green before a PR can merge.

**Preview deployments:** Every non-`main` branch is automatically deployed to a Cloudflare preview URL. Test your changes in a live environment before opening a PR — no staging environment to manage separately.

**Production safety:** Nothing reaches `flowmatrixai.com` until it lands on `main`. You can work freely on any branch without risk to production users.

---

## Config

Deployment settings live in `src/config/deployment.json` (committed, not secret):

```json
{
  "siteUrl": "https://flowmatrixai.com",
  "allowIndexing": false,
  "gaMeasurementId": ""
}
```

- Flip `allowIndexing` to `true` only when cutting to production.
- `gaMeasurementId` can remain empty — site launches fine without GA4.

---

## Environment Variables

Set in **Cloudflare Pages → Settings → Environment Variables** (Production + Preview):

| Variable               | Value                      |
| ---------------------- | -------------------------- |
| `RESEND_API_KEY`       | Resend API key (send-only) |
| `LEAD_RECIPIENT_EMAIL` | `leads@flowmatrixai.com`   |

For local dev, create `.dev.vars` at the repo root (gitignored):

```
RESEND_API_KEY=re_...
LEAD_RECIPIENT_EMAIL=leads@flowmatrixai.com
```

---

## Form Endpoints

Handled by Cloudflare Pages Functions — no third-party service config required.

| Endpoint         | Purpose            |
| ---------------- | ------------------ |
| `POST /api/lead` | Homepage lead form |

Sending domain: `updates.flowmatrixai.com` (Resend-verified, isolated from main domain reputation).

---

## Validation Commands

```bash
npm run validate:deployment      # deployment.json schema
npm run validate:content         # alias for validate:deployment (runs in CI before build)
npm run type-check               # TypeScript
npm run build                    # full Vite build + sitemap + robots + head artifact checks
npm run validate:build-artifacts # post-build output checks
```

Full local gate before any production push:

```bash
npm run type-check && npm run build && npm run validate:build-artifacts
```

---

## Staging → Production Cutover

1. In `src/config/deployment.json`, set `allowIndexing: true` (and `gaMeasurementId` if GA4 is ready).
2. Run full local gate (above).
3. Commit and push the branch. Verify the Cloudflare preview deployment looks correct.
4. Open a pull request against `main`. CI must pass before merging.
5. Merge the PR — Cloudflare Pages will automatically deploy to production.
6. Confirm the production deployment succeeds in the Cloudflare Pages dashboard.

### Post-Cutover Verification

**Functional**

- [ ] `https://flowmatrixai.com/` loads
- [ ] `/contact` loads
- [ ] `/terms`, `/privacy`, and unknown route `404` behave correctly

**SEO / Technical**

- [ ] `/sitemap.xml` is reachable and correct
- [ ] `/robots.txt` is reachable and allows indexing
- [ ] Canonical tags resolve to `https://flowmatrixai.com/...`

**Forms**

- [ ] Submit homepage lead form → email arrives at `leads@flowmatrixai.com`
- [ ] `Reply-To` in received email is the submitter's address

**Analytics** _(if GA4 enabled)_

- [ ] `page_view` fires on navigation
- [ ] `generate_lead` fires on form submit

---

## Rollback

1. In Cloudflare Pages dashboard, roll back to the last successful deployment.
2. Confirm previous build is serving.
3. Fix on a branch → verify on preview → re-run cutover checklist before re-promoting.

---

## GA4 Setup (deferred — post DNS cutover)

1. Create GA4 property and stream.
2. Set `gaMeasurementId: "G-..."` in `src/config/deployment.json`.
3. Deploy and verify GA4 Realtime events (`page_view`, `generate_lead`).
