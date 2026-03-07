# Deployment Config (Concise)

## Source of Truth

Deployment settings are committed in `src/config/deployment.json`.

```json
{
  "siteUrl": "https://flowmatrixai.com",
  "allowIndexing": false,
  "gaMeasurementId": ""
}
```

These are public values by nature and do not belong in secrets.
No GitHub Actions variables are required for them.

## Cutover Steps (Staging -> Production)

1. Update `src/config/deployment.json`:
   - `allowIndexing`: `true`
   - `gaMeasurementId`: set `G-...` once GA4 stream is ready
2. Run validation/build locally.
3. Commit and deploy.

## Native Forms

Forms are handled by Cloudflare Pages Functions. No config files or third-party services are involved.

Endpoints:

- `POST /api/lead` — main lead form (Home page)
- `POST /api/template-access` — template access request (Template detail pages)

Both functions read two environment variables set in **Cloudflare Pages → Settings → Environment Variables**:

| Variable               | Value                      | Scope                |
| ---------------------- | -------------------------- | -------------------- |
| `RESEND_API_KEY`       | Resend API key (send-only) | Production + Preview |
| `LEAD_RECIPIENT_EMAIL` | `leads@flowmatrixai.com`   | Production + Preview |

For local development, create a `.dev.vars` file at the repo root (gitignored):

```secret
RESEND_API_KEY=re_...
```

```text
LEAD_RECIPIENT_EMAIL=leads@flowmatrixai.com
```

Sending domain: `updates.flowmatrixai.com` (verified in Resend, isolated from main domain reputation).

## Free Template Content Source of Truth

`src/data/templates.json` is content-only for `/free` pages.

Required fields for `published` entries:

- `slug`
- `title`
- `summary` (short listing copy; 40-240 chars)
- `description`
- `deliverable_type`

## Validation Commands

- `npm run validate:deployment`
- `npm run validate:templates`
- `npm run validate:content` (all of the above)

CI runs `npm run validate:content` before build.

## GA4 Setup (deferred — post DNS cutover)

1. Create/configure GA4 property and stream.
2. Set `gaMeasurementId` to `G-...` in `src/config/deployment.json`.
3. Deploy and verify GA4 Realtime:
   - `view_item` on `/free/:slug`
   - `generate_lead` on form submit
