# Cloudflare Migration Plan — Final

**Created:** March 5, 2026  
**Updated:** March 6, 2026  
**Goal:** Remove all Tally form infrastructure, replace with native Cloudflare Pages Functions + Resend, and clean up all GitHub Pages remnants from the codebase.

**Out of scope for this migration:** `deployment.json` domain/indexing flip and GA4 setup. Those remain as pre-DNS-cutover steps already documented in `docs/staging-to-production-cutover-checklist.md`.

---

## Decisions — All Resolved

### Email sender address

**Decision:** `from: "FlowMatrix AI <no-reply@updates.flowmatrixai.com>"` with `replyTo` set to the submitter's email address.  
**Rationale:** `updates.flowmatrixai.com` is the verified Resend sending domain — transactional mail is intentionally isolated to this subdomain to protect the main domain's reputation. `no-reply@` signals an automated email. Setting `replyTo` to the submitter means the team can hit Reply in their inbox and reach the lead directly.

### Email recipient address

**Decision:** Stored in a Cloudflare Pages environment variable named `LEAD_RECIPIENT_EMAIL`. Value: `leads@flowmatrixai.com`.  
**Rationale:** `leads@flowmatrixai.com` is a Google Group with all founding team members as recipients — no individual inbox is a single point of failure, and no extra Google Workspace license is required. Using an env var means the address can be changed in the Cloudflare dashboard without a code deploy. Both forms send to the same address; subject line differentiates them.

### Spam protection

**Decision:** Honeypot field named `website` on both forms.  
**Rationale:** Zero external dependency, zero UI friction, good enough for a low-traffic B2B site. Turnstile adds a visible challenge widget which conflicts with the form UX.  
**Implementation:** `<input name="website">` with CSS `position: absolute; opacity: 0; height: 0; width: 0; overflow: hidden; pointer-events: none;` plus `tabindex="-1"` and `autocomplete="off"`. Do not use `display: none` — unsophisticated bots skip `display: none` fields but still fill `position: absolute` hidden fields. The function rejects any request where `website` is non-empty.  
**Future upgrade:** Cloudflare WAF rate limiting will be added as a separate WAF rule post-launch — no code changes required.

### Template access form behavior

**Decision:** Team notification only. The function emails `LEAD_RECIPIENT_EMAIL` with the submitter's details and which template they requested. The team follows up manually.  
**Rationale:** (1) Template resources are not stored in the codebase — they're external links, files, or docs that vary per template. Auto-reply would require every template to have a configured delivery URL, adding a new data model concern. (2) Manual follow-up is a deliberate touch point for a B2B consultancy — it's not a bug, it's the business model. (3) Consistent with how the lead form already works.

---

## Context: What's Being Replaced

Two Tally form flows exist today:

**Flow 1 — Main lead form** (`mainGetInTouch`)  
Used in: `HomePage.vue` `#start` section  
Purpose: "Start the Conversation" — user shares goals, expects follow-up from the team  
Replaced by: `LeadForm.vue` → `POST /api/lead`

**Flow 2 — Template access form** (`freeGetAccessNow`)  
Used in: `TemplateDetailPage.vue` sidebar  
Purpose: User requests access to a specific free template, expects team to follow up with the resource  
Replaced by: `TemplateAccessForm.vue` → `POST /api/template-access`

---

## Prerequisite: Resend Setup — ✅ Complete

Resend is already configured:

- Verified sender domain: `updates.flowmatrixai.com`
- DNS records (DKIM + SPF) active
- API key created

Remaining step — add env vars to **Cloudflare Pages → Settings → Environment Variables** (both Production and Preview):

```
RESEND_API_KEY = re_...
LEAD_RECIPIENT_EMAIL = leads@flowmatrixai.com
```

**These env vars must exist before the functions will work in any deployed environment.**

For local testing, create a `.dev.vars` file at the repo root (must be in `.gitignore` — verify):

```
RESEND_API_KEY=re_...
LEAD_RECIPIENT_EMAIL=leads@flowmatrixai.com
```

---

## Files to Delete

| File                                  | Reason                                            |
| ------------------------------------- | ------------------------------------------------- |
| `src/components/forms/TallyEmbed.vue` | Replaced by native form components                |
| `src/data/forms.json`                 | Tally form registry — no longer needed            |
| `src/config/forms.ts`                 | Typed wrapper for `forms.json` — no longer needed |
| `scripts/validate-forms.mjs`          | Validates `forms.json` — no longer needed         |

---

## Files to Create

### 1. Cloudflare Pages Functions

```
functions/
  api/
    lead.ts
    template-access.ts
```

**`functions/api/lead.ts`**  
Route: `POST /api/lead`  
Accepts JSON body.

Request shape:

```ts
{
  name: string;       // required
  email: string;      // required
  company?: string;   // optional
  message: string;    // required — "Tell us your current situation and goals"
  website?: string;   // honeypot — must be absent or empty
}
```

Validation rules:

- `name`, `email`, `message` must be non-empty strings
- `email` must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `website` non-empty → respond `400` immediately, no log (silent reject)

Email sent on success:

```
To:       LEAD_RECIPIENT_EMAIL
From:     FlowMatrix AI <no-reply@updates.flowmatrixai.com>
Reply-To: <submitter email>
Subject:  New lead: {name}
Body (HTML):
  Name: {name}
  Email: {email}
  Company: {company | "—"}
  Message: {message}
```

Responses:

- `200` `{ success: true }`
- `400` `{ error: "Missing required fields." }` or `{ error: "Invalid email address." }`
- `405` `{ error: "Method not allowed." }` (non-POST)
- `500` `{ error: "Failed to send. Please email us at leads@flowmatrixai.com." }`

---

**`functions/api/template-access.ts`**  
Route: `POST /api/template-access`  
Accepts JSON body.

Request shape:

```ts
{
  name: string;            // required
  email: string;           // required
  template_slug: string;   // required — injected by component as hidden field
  template_title: string;  // required — injected by component as hidden field
  website?: string;        // honeypot — must be absent or empty
}
```

Validation rules: same as above, plus `template_slug` and `template_title` must be non-empty strings.

Email sent on success:

```
To:       LEAD_RECIPIENT_EMAIL
From:     FlowMatrix AI <no-reply@updates.flowmatrixai.com>
Reply-To: <submitter email>
Subject:  Template access request: {template_title}
Body (HTML):
  Name: {name}
  Email: {email}
  Template: {template_title} (slug: {template_slug})
```

Responses: identical shape to `/api/lead`.

---

### 2. TypeScript config for functions

**`tsconfig.functions.json`** at repo root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["functions/**/*.ts"]
}
```

---

### 3. New Vue form components

**`src/components/forms/LeadForm.vue`**  
Replaces `TallyEmbed` in `HomePage.vue`.

Props: none  
Emits: `submitted` (no payload — matches how `homeLeadSubmitted` is set today)

Fields rendered:

- `name` — text, required, label "Name"
- `email` — email, required, label "Email"
- `company` — text, optional, label "Company (optional)"
- `message` — textarea, required, label "What can we help with?", placeholder "Tell us your current situation and goals."
- `website` — honeypot input, hidden via CSS

States:

- Default: form visible
- Loading: submit button shows "Sending…", disabled
- Success: emit `submitted`, hide form, show success message externally (caller controls this — same pattern as today's `homeLeadSubmitted`)
- Error: show inline error message above submit button; form remains usable

Error message text: `"Something went wrong. Please try again or email us directly at leads@flowmatrixai.com."`

---

**`src/components/forms/TemplateAccessForm.vue`**  
Replaces `TallyEmbed` in `TemplateDetailPage.vue`.

Props:

```ts
{
  templateSlug: string;
  templateTitle: string;
}
```

Emits: `submitted` (no payload — caller sets `submitted.value = true`)

Fields rendered:

- `name` — text, required, label "Name"
- `email` — email, required, label "Email"
- `template_slug` — hidden input, value bound to `templateSlug` prop
- `template_title` — hidden input, value bound to `templateTitle` prop
- `website` — honeypot input, hidden via CSS

States: same loading / success-emit / error pattern as `LeadForm.vue`.

---

## Files to Update

### `package.json`

- Remove `"validate:forms": "node scripts/validate-forms.mjs"` script
- Update `"validate:content"` to: `"npm run validate:deployment && npm run validate:templates"`
- Add `@cloudflare/workers-types` to devDependencies (via `npm install --save-dev`)

### `src/env.d.ts`

Remove the entire `Tally` block from the `Window` interface:

```ts
// DELETE THIS:
Tally?: {
  loadEmbeds?: () => void;
  openPopup?: (formId: string, options?: unknown) => void;
  closePopup?: (formId: string) => void;
};
```

### `index.html`

Remove Tally preconnect and dns-prefetch lines:

```html
<!-- DELETE THESE: -->
<link rel="preconnect" href="https://tally.so" />
<link rel="dns-prefetch" href="https://tally.so" />
```

### `src/pages/HomePage.vue`

- Remove imports: `TallyEmbed`, `forms`, `mainFormMinHeight`, `mainFormShareUrl`
- Check whether `ref` import is still needed (`homeLeadSubmitted` still uses it — likely yes)
- Replace `<TallyEmbed ... @submitted="handleHomeLeadSubmitted" />` with `<LeadForm @submitted="handleHomeLeadSubmitted" />`
- In `handleHomeLeadSubmitted`, update the analytics event:
  - Remove `form_id` field (no longer meaningful)
  - Change `lead_source: 'tally'` → `lead_source: 'native'`

### `src/pages/TemplateDetailPage.vue`

- Remove imports: `TallyEmbed`, `forms`, `currentForm`, `currentFormId`, `freeTemplateFormMinHeight`, `currentFormShareUrl`
- Replace `<TallyEmbed ... @submitted="handleLeadSubmitted" />` with `<TemplateAccessForm :template-slug="template.slug" :template-title="template.title" @submitted="handleLeadSubmitted" />`
- Remove the `<div class="missing-form">` fallback block (was there for missing Tally config — native form is always present)
- Remove the `<p class="lead-share-link">` block (Tally share URL — gone)
- In `handleLeadSubmitted`, update the analytics event:
  - Remove `form_id` field
  - Change `lead_source: 'tally'` → `lead_source: 'native'`

### `docs/staging-to-production-cutover-checklist.md`

- Remove the "GitHub Pages Domain Setup" section (GitHub-specific, no longer applies)
- Replace "Submit homepage Tally form" and "Submit shared /free/:slug Tally form" verification steps with native form equivalents
- Add: confirm `RESEND_API_KEY` and `LEAD_RECIPIENT_EMAIL` are set in Cloudflare Pages production env

### `docs/deployment-configuration.md`

- Remove the "Form Config Source of Truth" section entirely (Tally-specific)
- Add a "Native Forms" section noting that form endpoints are `POST /api/lead` and `POST /api/template-access`, and that `RESEND_API_KEY` / `LEAD_RECIPIENT_EMAIL` are set as Cloudflare Pages env vars

### `planning/BACKLOG.md`

- Mark OP-2 (Tally migration) as superseded — Tally was replaced entirely, not migrated to a new account

### `.gitignore`

- Add `.dev.vars` if not already present

---

## What Is Not Changing

- `deployment.json` — `siteUrl` and `allowIndexing` are unchanged; domain flip is a separate pre-prod step
- `deploymentNormalization.mjs` — `DEFAULT_SITE_URL` unchanged
- All template data, `/free` routes, SEO pipeline, structured data
- Analytics event names and structure — only `lead_source` value and removal of `form_id` field
- CI pipeline — already clean; `validate:content` change is the only CI-adjacent touch

---

## New Dependency

```
npm install --save-dev @cloudflare/workers-types
```

No runtime dependencies added — Resend is called via `fetch` (native to the Workers runtime, no SDK needed).

---

## Local Development

To test functions locally after building:

```bash
npm run build
npx wrangler pages dev dist --compatibility-date=2024-09-23
```

This requires `.dev.vars` to exist with `RESEND_API_KEY` and `LEAD_RECIPIENT_EMAIL` set. The `dist/` directory must be built first since Wrangler serves the static output.

---

## Implementation Order

All steps are in dependency order. Steps with the same number can run in parallel.

| Step | Task                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------ |
| 1    | ~~Resend setup complete~~ — add `RESEND_API_KEY` + `LEAD_RECIPIENT_EMAIL` env vars to Cloudflare Pages |
| 2a   | Create `functions/api/lead.ts`                                                                         |
| 2b   | Create `functions/api/template-access.ts`                                                              |
| 2c   | Create `src/components/forms/LeadForm.vue`                                                             |
| 2d   | Create `src/components/forms/TemplateAccessForm.vue`                                                   |
| 2e   | Create `tsconfig.functions.json`                                                                       |
| 2f   | Install `@cloudflare/workers-types`                                                                    |
| 3a   | Update `src/pages/HomePage.vue` (swap TallyEmbed → LeadForm)                                           |
| 3b   | Update `src/pages/TemplateDetailPage.vue` (swap TallyEmbed → TemplateAccessForm)                       |
| 4    | Delete `TallyEmbed.vue`, `forms.json`, `forms.ts`, `validate-forms.mjs`                                |
| 5a   | Update `package.json` (remove validate:forms, update validate:content)                                 |
| 5b   | Update `src/env.d.ts` (remove Tally Window type)                                                       |
| 5c   | Update `index.html` (remove Tally preconnects)                                                         |
| 5d   | Update `docs/deployment-configuration.md`                                                              |
| 5e   | Update `docs/staging-to-production-cutover-checklist.md`                                               |
| 5f   | Add `.dev.vars` to `.gitignore`                                                                        |
| 6    | Run `npm run lint && npm run type-check && npm test` — must be green                                   |
| 7    | Deploy to Cloudflare staging (push to branch), smoke test both forms end-to-end                        |
| 8    | Update `planning/BACKLOG.md` OP-2 status                                                               |

---

## Notes

- Cloudflare Pages Functions live in `functions/` at the repo root. Cloudflare auto-routes them to their URL paths — no configuration file needed.
- The `functions/` directory is handled separately by Cloudflare from the static `dist/` output — Vite-SSG only builds `dist/`.
- TypeScript in `functions/` needs types for the Cloudflare Workers runtime — that's why `@cloudflare/workers-types` is added and `tsconfig.functions.json` is scoped to `functions/**`.
- The existing `tsconfig.app.json` covers `src/` only and must not be modified for functions — hence the separate tsconfig.
- WAF rate limiting on the function endpoints can be added as a Cloudflare dashboard rule post-launch with zero code changes.
