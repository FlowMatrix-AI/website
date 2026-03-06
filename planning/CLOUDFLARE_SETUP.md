Yes — the proper Cloudflare-native pattern is to move the site off GitHub Pages hosting and onto a single **Cloudflare Pages** project with:

- **production branch** → `main` → serves `company.com`
- **staging branch** → `staging` → serves `staging.company.com`
- **feature branches / PRs** → automatic preview URLs on `*.pages.dev` for review before merge ([Cloudflare Docs][1])

The key detail is that Cloudflare Pages supports mapping a **custom domain to a specific branch**, so `staging.company.com` can always track the latest deployment from your `staging` branch. That setup requires a **proxied Cloudflare DNS record**; otherwise the custom alias falls back to production. ([Cloudflare Docs][2])

What I would recommend:

1. **Create one Cloudflare Pages project** connected to your GitHub repo via Git integration. Pages will auto-build on pushes and create preview deployments for PRs and non-production branches. Also note that once a Pages project uses Git integration, Cloudflare says you cannot later switch that project to Direct Upload. ([Cloudflare Docs][1])

2. **Set `main` as the production branch** in Pages branch controls. Cloudflare lets you explicitly choose which branch is production. ([Cloudflare Docs][3])

3. **Create a long-lived `staging` branch** and map `staging.company.com` to that branch by adding the custom domain in Pages first, then changing the proxied CNAME target from `your-project.pages.dev` to `staging.your-project.pages.dev`. ([Cloudflare Docs][2])

4. **Use PR previews for normal development.** Every PR gets a unique preview URL that updates as commits are pushed, without affecting production or your custom domains. By default those previews are public, but you can protect them with Cloudflare Access if needed. ([Cloudflare Docs][4])

5. **Promote to production by Git, not by ad hoc file upload.** The clean pattern is:
   - feature branch → PR into `staging`
   - Cloudflare auto-deploys `staging.company.com`
   - review visually
   - PR `staging` → `main`
   - then trigger the production deployment manually

For that last step, there are two solid options:

**Best default:** keep `main` as production, but **disable automatic production branch deployments**. Then after `staging` is merged into `main`, trigger production manually with a **Cloudflare Deploy Hook** tied to `main`, or from the dashboard/API. Cloudflare supports disabling automatic production deployments for Git-integrated projects, and Deploy Hooks can trigger a build for a specific branch by sending a POST to a unique URL. ([Cloudflare Docs][5])

That gives you exactly the control you want:

- CI passes
- staging auto-updates
- humans verify staging
- merge approved code to `main`
- manual trigger deploys `main` to `company.com` only when you say so ([Cloudflare Docs][6])

A few implementation notes that matter:

- For the apex `company.com`, the domain must be a **Cloudflare zone on the same Cloudflare account** as the Pages project. ([Cloudflare Docs][7])
- For subdomains like `staging.company.com`, Cloudflare can use a CNAME, but you still need to add the custom domain through the Pages dashboard first; manually creating DNS alone can fail. ([Cloudflare Docs][7])
- Deploy Hooks are effectively secrets; Cloudflare notes they require no extra auth, so treat the URL like a credential. ([Cloudflare Docs][6])

My candid recommendation on naming: use **`staging.company.com`**, not `x.company.com`. `x` works technically, but `staging` is far clearer for humans, logs, docs, and future teammates.

So the final pattern I would adopt is:

- `main` = production
- `staging` = pre-prod integration branch
- `staging.company.com` = branch alias to `staging`
- PR previews on `*.pages.dev`
- auto deploy enabled for preview/staging
- auto deploy disabled for production
- manual production release via **Deploy Hook** after merge to `main`

That is the cleanest Cloudflare Pages branch-promotion workflow for a static marketing/company site.

If you want, I can draft the exact GitHub Actions + branch protection + Cloudflare configuration sequence for this setup.

[1]: https://developers.cloudflare.com/pages/get-started/git-integration/ 'Git integration guide · Cloudflare Pages docs'
[2]: https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/ 'Add a custom domain to a branch · Cloudflare Pages docs'
[3]: https://developers.cloudflare.com/pages/configuration/branch-build-controls/ 'Branch deployment controls · Cloudflare Pages docs'
[4]: https://developers.cloudflare.com/pages/configuration/preview-deployments/ 'Preview deployments · Cloudflare Pages docs'
[5]: https://developers.cloudflare.com/pages/configuration/git-integration/ 'Git integration · Cloudflare Pages docs'
[6]: https://developers.cloudflare.com/pages/configuration/deploy-hooks/ 'Deploy Hooks · Cloudflare Pages docs'
[7]: https://developers.cloudflare.com/pages/configuration/custom-domains/ 'Custom domains · Cloudflare Pages docs'

The correct Cloudflare-native way to add this to a static site is **Cloudflare Pages + Pages Functions (Workers runtime)**. Your site stays static, and a small serverless function handles the form POST and sends the email.

This avoids adding a backend server and keeps everything inside Cloudflare’s edge platform.

---

# Architecture

```
Browser form
     │
POST /api/lead
     │
Cloudflare Pages Function (edge worker)
     │
Validate + sanitize input
     │
Call email provider API
     │
Send email → leads@company.com
```

Your static pages remain unchanged except for the form action.

---

# Recommended Email Providers (from Workers)

Workers cannot send SMTP directly. You must call an **email API**.

Best options:

| Provider        | Why                                           |
| --------------- | --------------------------------------------- |
| **Resend**      | extremely simple API, designed for serverless |
| **Postmark**    | very reliable transactional email             |
| **SendGrid**    | common but heavier                            |
| **AWS SES API** | good if already on AWS                        |

For simplicity: **Resend** or **Postmark**.

---

# Repository Structure

For Cloudflare Pages with functions:

```
repo/
│
├─ functions/
│   └─ api/
│       └─ lead.ts
│
├─ public/
│   └─ index.html
│
└─ package.json
```

Pages automatically deploys anything in `functions/` as edge endpoints.

---

# Example HTML Form

```
<form method="POST" action="/api/lead">
  <input name="name" required />
  <input name="email" type="email" required />
  <textarea name="problem" required></textarea>

  <button type="submit">Send</button>
</form>
```

You can keep the form static.

---

# Cloudflare Pages Function

Example `functions/api/lead.ts`:

```ts
export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const name = formData.get('name');
  const email = formData.get('email');
  const problem = formData.get('problem');

  if (!name || !email || !problem) {
    return new Response('Invalid form submission', { status: 400 });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'leads@company.com',
      to: ['leads@company.com'],
      subject: `New lead from ${name}`,
      html: `
        <h2>New Lead</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Problem:</b></p>
        <p>${problem}</p>
      `,
    }),
  });

  if (!res.ok) {
    return new Response('Email failed', { status: 500 });
  }

  return new Response('Success', { status: 200 });
}
```

---

# Secrets Management

Add API keys via **Cloudflare Pages → Settings → Environment Variables**

Example:

```
RESEND_API_KEY
```

Never commit this to Git.

---

# Anti-Spam (Important)

Without protection, bots will hammer the endpoint.

Add at least one of:

### Cloudflare Turnstile

```
<input type="hidden" name="cf-turnstile-response">
```

Then validate token in the worker.

or

### Honeypot field

```
<input type="text" name="company" style="display:none">
```

Reject if filled.

or

### Cloudflare WAF rules

Rate limit `/api/lead`.

---

# Optional Improvements

### Redirect after submit

Return:

```
302 → /thank-you
```

### JSON submission (modern SPA)

Instead of form POST:

```
fetch("/api/lead", { method: "POST" })
```

### Store leads

Later you may want to also save leads to:

- Cloudflare **D1**
- Cloudflare **KV**
- Airtable
- HubSpot API

---

# Cost

For a simple lead form:

| Service          | Cost                                |
| ---------------- | ----------------------------------- |
| Cloudflare Pages | free tier                           |
| Pages Functions  | free tier                           |
| Email API        | often free up to ~3000 emails/month |

This setup usually costs **$0/month** for early traffic.

---

# Recommended Production Pattern

For a company site:

```
Cloudflare Pages
│
├─ static site
├─ functions/api/*
│
└─ services
    └─ email provider
```

You get:

- edge compute
- no server
- low latency
- global scale
- zero maintenance

---

If you want, I can also show the **cleanest possible production setup for this repo** including:

- `wrangler.toml`
- proper TypeScript config
- spam protection
- CI deploy from GitHub

It takes about **5 minutes to wire up properly** and is the pattern most Cloudflare teams use internally.
