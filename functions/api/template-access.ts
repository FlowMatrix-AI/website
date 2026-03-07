interface Env {
  RESEND_API_KEY: string;
  LEAD_RECIPIENT_EMAIL: string;
}

interface TemplateAccessRequestBody {
  name?: unknown;
  email?: unknown;
  template_slug?: unknown;
  template_title?: unknown;
  website?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  let body: TemplateAccessRequestBody;
  try {
    body = (await request.json()) as TemplateAccessRequestBody;
  } catch {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { name, email, template_slug, template_title, website } = body;

  // Honeypot — silent reject
  if (website) {
    return Response.json({ success: true }, { status: 200 });
  }

  if (typeof name !== 'string' || !name.trim()) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  if (typeof email !== 'string' || !email.trim()) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email.trim())) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 });
  }
  if (typeof template_slug !== 'string' || !template_slug.trim()) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  if (typeof template_title !== 'string' || !template_title.trim()) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
    <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
    <p><strong>Template:</strong> ${escapeHtml(template_title.trim())} (slug: ${escapeHtml(template_slug.trim())})</p>
  `.trim();

  console.log('[template-access] env check — RESEND_API_KEY present:', !!env.RESEND_API_KEY);
  console.log(
    '[template-access] env check — LEAD_RECIPIENT_EMAIL:',
    env.LEAD_RECIPIENT_EMAIL ?? '(missing)'
  );

  const resendPayload = {
    from: 'FlowMatrix AI <no-reply@updates.flowmatrixai.com>',
    to: [env.LEAD_RECIPIENT_EMAIL],
    replyTo: email.trim(),
    subject: `Template access request: ${template_title.trim()}`,
    html,
  };

  console.log(
    '[template-access] sending to Resend — payload (no html):',
    JSON.stringify({ ...resendPayload, html: '(omitted)' })
  );

  let resendResponse: Response;
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendPayload),
    });
  } catch (err) {
    console.error('[template-access] fetch threw:', err);
    return Response.json(
      { error: 'Failed to send. Please email us at leads@flowmatrixai.com.' },
      { status: 500 }
    );
  }

  if (!resendResponse.ok) {
    const errorBody = await resendResponse.text().catch(() => '(could not read body)');
    console.error(
      '[template-access] Resend error — status:',
      resendResponse.status,
      '— body:',
      errorBody
    );
    return Response.json(
      { error: 'Failed to send. Please email us at leads@flowmatrixai.com.' },
      { status: 500 }
    );
  }

  console.log('[template-access] Resend success — status:', resendResponse.status);

  return Response.json({ success: true }, { status: 200 });
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
