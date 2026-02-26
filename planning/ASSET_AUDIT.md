# Asset Audit (Keep vs Delete Candidates)

**Date:** February 26, 2026  
**Scope:** `flowmatrix-ai.github.io` static/media assets

---

## 1. Audit Scope and Method

- Audited all image/video/media files under `public/`.
- Searched runtime source/config/data for direct references.
- Confirmed no additional media files exist outside `public/` (excluding `dist/` and `node_modules/`).

---

## 2. Summary

- Total media/static asset files in `public/`: **44**
- Recommended `keep`: **12**
- Recommended `delete candidates`: **32**
- Cross-check status: **complete** (no missing files, no duplicates across lists)

---

## 3. Keep List

### 3.1 Keep (currently used by runtime)

- `public/404.html`
- `public/flowmatrix-logo.webp`
- `public/headshots/sebastian-tamburro.webp`
- `public/headshots/dom-joseph.webp`
- `public/third-party-logos/clients/ubl-group.png`

### 3.2 Keep (infrastructure / near-term parity use)

- `public/favicon.ico`
- `public/flowmatrix-logo.png`
- `public/third-party-logos/clients/all-clean.webp`
- `public/third-party-logos/clients/lochinvar-safaris.webp`
- `public/third-party-logos/clients/montana-trophy.webp`
- `public/third-party-logos/clients/palisades-bowhunting.webp`
- `public/third-party-logos/clients/valor-tax-relief.webp`

Notes:

- `favicon.ico` should remain as the standard browser icon asset.
- `flowmatrix-logo.png` is not currently wired, but is useful as an OG/social fallback format.
- The five non-UBL client logos are recommended to keep for the planned lightweight proof/logo-strip parity pass.

---

## 4. Delete Candidates

These are currently unused in runtime and not required for the lean MVP path.

### 4.1 Videos (4)

- `public/videos/dome-scale.mp4`
- `public/videos/logo-grow-shine.mp4`
- `public/videos/logo-pillar-shine.mp4`
- `public/videos/logo-slab-shine.mp4`

### 4.2 Tech Stack Logos (28)

- `public/third-party-logos/tech-stack/airtable.png`
- `public/third-party-logos/tech-stack/anthropic.png`
- `public/third-party-logos/tech-stack/apify.png`
- `public/third-party-logos/tech-stack/canva.png`
- `public/third-party-logos/tech-stack/copilot.png`
- `public/third-party-logos/tech-stack/deepseek.png`
- `public/third-party-logos/tech-stack/elleven-labs.png`
- `public/third-party-logos/tech-stack/gemini.png`
- `public/third-party-logos/tech-stack/google-cloud.png`
- `public/third-party-logos/tech-stack/google-workplace.png`
- `public/third-party-logos/tech-stack/houzz.png`
- `public/third-party-logos/tech-stack/hubspot.png`
- `public/third-party-logos/tech-stack/mongodb.png`
- `public/third-party-logos/tech-stack/n8n.png`
- `public/third-party-logos/tech-stack/notion.png`
- `public/third-party-logos/tech-stack/openai.png`
- `public/third-party-logos/tech-stack/openrouter.png`
- `public/third-party-logos/tech-stack/perplexity.png`
- `public/third-party-logos/tech-stack/pinecone.png`
- `public/third-party-logos/tech-stack/slack.png`
- `public/third-party-logos/tech-stack/square.png`
- `public/third-party-logos/tech-stack/stripe.png`
- `public/third-party-logos/tech-stack/supabase.png`
- `public/third-party-logos/tech-stack/tavily.png`
- `public/third-party-logos/tech-stack/telegram.png`
- `public/third-party-logos/tech-stack/twilio.png`
- `public/third-party-logos/tech-stack/urban-land-institute.png`
- `public/third-party-logos/tech-stack/vercel.png`

---

## 5. Cross-Check Validation

Classification validation results:

- `all=44`
- `keep=12`
- `delete candidates=32`
- `keep + delete candidates = 44`
- Missing from classification: none
- Duplicate entries in classification: none

This document is a decision record only. No files were deleted as part of this audit.
