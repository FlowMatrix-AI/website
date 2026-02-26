# Deployment Config (Concise)

## Source of Truth

Deployment settings are committed in `src/config/deployment.json`.

```json
{
  "siteUrl": "https://flowmatrix-ai.github.io",
  "allowIndexing": false,
  "gaMeasurementId": ""
}
```

These are public values by nature and do not belong in secrets.
No GitHub Actions variables are required for them.

## Cutover Steps (Staging -> Production)

1. Update `src/config/deployment.json`:
   - `siteUrl`: `https://flowmatrixai.com`
   - `allowIndexing`: `true`
   - `gaMeasurementId`: set `G-...` once GA4 stream is ready
2. Run validation/build locally.
3. Commit and deploy.

## Form Config Source of Truth

`src/data/forms.json` owns all Tally forms.

Required keys:
- `mainGetInTouch`
- `freeGetAccessNow`

Each key must include:
- `formId` (Tally form ID)
- `shareUrl` (`https://tally.so/r/<id>` or `https://tally.so/embed/<id>`)

## Free Template Content Source of Truth

`src/data/templates.json` is content-only for `/free` pages.

Required fields for `published` entries:
- `slug`
- `title`
- `description`
- `deliverable_type`

Do not put lead fields in templates:
- `tally_form_id`
- `deliverable_url`

Lead capture is shared at the page level via `forms.json`.

## Validation Commands

- `npm run validate:deployment`
- `npm run validate:forms`
- `npm run validate:templates`
- `npm run validate:content` (both)

CI runs `npm run validate:content` before build.

## Tally + GA4 Quick Setup

1. Create/configure Tally forms and notification recipients in Tally.
2. Put IDs/URLs in `src/data/forms.json`.
3. Set `gaMeasurementId` in `src/config/deployment.json` once GA4 stream is ready.
4. Deploy and verify GA4 Realtime:
   - `view_item` on `/free/:slug`
   - `generate_lead` on form submit
