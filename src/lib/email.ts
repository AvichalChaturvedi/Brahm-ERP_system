import 'server-only';

export async function sendWelcomeEmail(to: string) {
  const provider = (process.env.EMAIL_PROVIDER || '').toLowerCase();
  const from = process.env.FROM_EMAIL;

  if (!provider || !from) {
    return { ok: false, reason: 'email not configured' };
  }

  if (provider === 'resend') {
    const key = process.env.RESEND_API_KEY;
    if (!key) return { ok: false, reason: 'email not configured' };
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: 'Welcome to BrahmForge',
        html: '<p>Welcome to BrahmForge — your workspace for hardware programs, BOM intelligence, and manufacturing execution.</p>',
      }),
    });
    return res.ok ? { ok: true } : { ok: false, reason: `provider error ${res.status}` };
  }

  return { ok: false, reason: 'unsupported provider' };
}
