# Staging to Production Cutover Checklist

Use this checklist when moving from GitHub Pages staging (`flowmatrix-ai.github.io`) to production (`flowmatrixai.com`).

## 1. Preconditions

- [ ] CI is green on latest `main`.
- [ ] Latest staging deploy is healthy.
- [ ] `npm run validate:content`, `npm run type-check`, and `npm run build` pass locally.
- [ ] GitHub repo admin access confirmed.
- [ ] DNS provider access confirmed.
- [ ] Legacy DNS records are saved for rollback.

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

- `gaMeasurementId` may remain empty if GA4 is not ready yet.
- Keep forms in `src/data/forms.json` (do not move to secrets).

Then:

- [ ] Commit config change.
- [ ] Push to `main`.
- [ ] Confirm deploy workflow succeeds.

## 3. GitHub Pages Domain Setup

- [ ] In repository settings, set custom domain to `flowmatrixai.com`.
- [ ] Wait for GitHub Pages to show DNS check status.
- [ ] Enable `Enforce HTTPS` when certificate becomes available.

## 4. DNS Cutover

Recommended:

- [ ] Lower TTL before cutover window (if your provider supports it).

Apply DNS records exactly as required by current GitHub Pages instructions for your repo/domain:

- [ ] Apex/root records for `flowmatrixai.com`.
- [ ] `www` CNAME record.

After saving DNS:

- [ ] Wait for propagation.
- [ ] Re-run a Pages deploy if needed.

## 5. Post-Cutover Verification

Functional:

- [ ] `https://flowmatrixai.com/` loads.
- [ ] Service routes load (`/assessment`, `/database-mobilization`, `/ai-implementation`, `/personalized-software`).
- [ ] `/free` and multiple `/free/:slug` pages load.
- [ ] `/terms`, `/privacy`, and unknown route `404` behavior are correct.

SEO/technical:

- [ ] `https://flowmatrixai.com/sitemap.xml` is reachable and correct.
- [ ] `https://flowmatrixai.com/robots.txt` is reachable and allows indexing.
- [ ] Canonical tags resolve to `https://flowmatrixai.com/...`.

Lead and analytics:

- [ ] Submit homepage Tally form and confirm receipt.
- [ ] Submit shared `/free/:slug` Tally form and confirm receipt.
- [ ] Verify GA4 realtime events (`view_item`, `generate_lead`) if GA is enabled.

## 6. Stabilization Window

For 24-48 hours after cutover:

- [ ] Watch for form failures, routing issues, and certificate issues.
- [ ] Monitor search console/indexing health.
- [ ] Confirm no critical regression before decommissioning legacy services.

## 7. Rollback Procedure

If critical production issues occur:

1. Revert DNS to legacy records.
2. Confirm legacy site is serving correctly.
3. Fix issue in `flowmatrix-ai.github.io`.
4. Re-run this checklist and re-attempt cutover.
