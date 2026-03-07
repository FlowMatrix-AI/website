interface Env {
  RESEND_API_KEY: string;
  LEAD_RECIPIENT_EMAIL: string;
}

interface LeadRequestBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  let body: LeadRequestBody;
  try {
    body = (await request.json()) as LeadRequestBody;
  } catch {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { name, email, company, message, website } = body;

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
  if (typeof message !== 'string' || !message.trim()) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const companyLine =
    typeof company === 'string' && company.trim()
      ? `<p><strong>Company:</strong> ${escapeHtml(company.trim())}</p>`
      : `<p><strong>Company:</strong> —</p>`;

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
    <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
    ${companyLine}
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message.trim())}</p>
  `.trim();

  console.log('[lead] env check — RESEND_API_KEY present:', !!env.RESEND_API_KEY);
  console.log('[lead] env check — LEAD_RECIPIENT_EMAIL:', env.LEAD_RECIPIENT_EMAIL ?? '(missing)');

  const resendPayload = {
    from: 'FlowMatrix AI <no-reply@updates.flowmatrixai.com>',
    to: [env.LEAD_RECIPIENT_EMAIL],
    replyTo: email.trim(),
    subject: `New lead: ${name.trim()}`,
    html,
  };

  console.log(
    '[lead] sending to Resend — payload (no html):',
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
    console.error('[lead] fetch threw:', err);
    return Response.json(
      { error: 'Failed to send. Please email us at leads@flowmatrixai.com.' },
      { status: 500 }
    );
  }

  if (!resendResponse.ok) {
    const errorBody = await resendResponse.text().catch(() => '(could not read body)');
    console.error('[lead] Resend error — status:', resendResponse.status, '— body:', errorBody);
    return Response.json(
      { error: 'Failed to send. Please email us at leads@flowmatrixai.com.' },
      { status: 500 }
    );
  }

  console.log('[lead] Resend success — status:', resendResponse.status);

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
