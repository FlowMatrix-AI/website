# Staging to Production Cutover Checklist

Use this checklist when moving from Cloudflare Pages staging (preview deployments) to production (`flowmatrixai.com` on the `main` branch).

**Hosting:** Cloudflare Pages — `main` branch serves production via the custom domain. Preview deployments are built from other branches.

## 1. Preconditions

- [ ] CI is green on latest `main`.
- [ ] Latest staging preview deploy is healthy.
- [ ] `npm run validate:content`, `npm run type-check`, and `npm run build` pass locally.
- [ ] Cloudflare Pages dashboard access confirmed.
- [ ] `RESEND_API_KEY` and `LEAD_RECIPIENT_EMAIL` are set in Cloudflare Pages → Settings → Environment Variables (Production).

## 2. Production Config Commit

Update `src/config/deployment.json`:

```json
{
  "siteUrl": "https://flowmatrixai.com",
  "allowIndexing": true,
  "gaMeasurementId": "G-XXXXXXXXXX"
}
```

Notes:

- `gaMeasurementId` may remain empty if GA4 is not ready yet — site will launch without analytics.
- `siteUrl` is already `https://flowmatrixai.com`; confirm it is correct before flipping `allowIndexing`.

Then:

- [ ] Commit config change.
- [ ] Push to `main`.
- [ ] Confirm CI workflow passes and Cloudflare Pages deployment succeeds.

## 3. Post-Cutover Verification

Functional:

- [ ] `https://flowmatrixai.com/` loads.
- [ ] Service routes load (`/assessment`, `/database-mobilization`, `/ai-implementation`, `/personalized-software`).
- [ ] `/free` and multiple `/free/:slug` pages load.
- [ ] `/terms`, `/privacy`, and unknown route `404` behavior are correct.

SEO/technical:

- [ ] `https://flowmatrixai.com/sitemap.xml` is reachable and correct.
- [ ] `https://flowmatrixai.com/robots.txt` is reachable and allows indexing.
- [ ] Canonical tags resolve to `https://flowmatrixai.com/...`.

Forms:

- [ ] Submit homepage lead form (`POST /api/lead`) and confirm email arrives at `leads@flowmatrixai.com`.
- [ ] Submit a `/free/:slug` template access form (`POST /api/template-access`) and confirm email arrives.
- [ ] Confirm `Reply-To` in received emails is the submitter's address.

Analytics (if GA4 is enabled):

- [ ] Verify GA4 realtime events (`view_item`, `generate_lead`) fire correctly.

## 4. Stabilization Window

For 24-48 hours after cutover:

- [ ] Watch for form failures, routing issues, and certificate issues.
- [ ] Monitor search console/indexing health.
- [ ] Confirm no critical regression.

## 5. Rollback Procedure

If critical production issues occur:

1. In Cloudflare Pages dashboard, roll back to the previous successful deployment.
2. Confirm the previous build is serving correctly.
3. Fix the issue on a branch, verify on a preview deployment.
4. Re-run this checklist before re-promoting to production.
