# Deployment Config (Concise)

## GitHub Variables

Set these in GitHub repo settings: `Settings -> Secrets and variables -> Actions -> Variables`.

- `SITE_URL`
  - Staging value: `https://flowmatrix-ai.github.io`
  - Production value: `https://flowmatrixai.com`
- `ALLOW_INDEXING`
  - Staging value: `false`
  - Production value: `true`
  - Optional: if unset, indexing is inferred from `SITE_URL` (`github.io` -> noindex).
- `GA_MEASUREMENT_ID`
  - Example: `G-XXXXXXXXXX`
  - Optional: if unset, GA scripts/events are skipped (build/deploy still pass).

## Template-Level Lead Config

In `src/data/templates.json` set per-template:

- `tally_form_id`
- `deliverable_url`
- `status` (`published` routes are statically generated)
- `slug`, `title`, `description`

CI validation (`npm run validate:templates`) fails deploy if any `published` template is missing required fields or uses placeholder values.

## GA4 Setup

1. In GA4, create/select a property and Web data stream.
2. Copy the Measurement ID (`G-...`).
3. Set GitHub variable `GA_MEASUREMENT_ID` when ready.
4. Deploy and verify in GA4 Realtime:
   - `view_item` on `/free/:slug`
   - `generate_lead` on Tally submit

## Tally Setup

1. Create a Tally form.
2. Copy form ID from embed URL (`https://tally.so/embed/<FORM_ID>`) or public URL (`/r/<FORM_ID>`).
3. Put the ID in template `tally_form_id`.
4. In Tally form settings, configure notification recipients (team email).
5. Submit a test entry and confirm:
   - Tally receives submission
   - GA4 `generate_lead` appears in Realtime

## Notes

- `.env` is local-only; CI uses GitHub variables.
- Published templates with placeholder lead fields are blocked by CI validation.
