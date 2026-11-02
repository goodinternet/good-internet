// POST /api/subscribe  { email, consent: true, website: "" }
// Adds an address to the Resend contact list for project updates. The API key stays on the server:
// RESEND_API_KEY (required) and RESEND_SEGMENT_ID (optional) are Vercel environment variables, never VITE_ ones.
// Roadmap item EST-6, choice C-9.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_HOSTS = new Set(['goodinternet.com', 'www.goodinternet.com', 'localhost', '127.0.0.1']);

// Best-effort limit per server instance: 5 attempts per 10 minutes per IP. Not a substitute for the provider's own protections.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

function sameSite(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return ALLOWED_HOSTS.has(hostname) || hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!sameSite(request)) return json(403, { error: 'forbidden' });

  const key = process.env.RESEND_API_KEY;
  if (!key) return json(503, { error: 'not_configured' });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(ip)) return json(429, { error: 'rate_limited' });

  let body: { email?: unknown; consent?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'invalid' });
  }

  // Honeypot: real visitors never fill this. Pretend it worked so bots learn nothing.
  if (typeof body.website === 'string' && body.website !== '') return json(200, { ok: true });

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL.test(email) || email.length > 254) return json(400, { error: 'invalid_email' });
  if (body.consent !== true) return json(400, { error: 'consent_required' });

  const segment = process.env.RESEND_SEGMENT_ID;
  let res: Response;
  try {
    res = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false, ...(segment ? { segments: [{ id: segment }] } : {}) }),
    });
  } catch {
    return json(502, { error: 'provider_unreachable' });
  }

  if (res.ok) return json(200, { ok: true });
  // An address that is already on the list (or was unsubscribed) looks the same as a new one, so the form can't be used to probe the list.
  if (res.status === 409 || res.status === 422) return json(200, { ok: true });
  return json(502, { error: 'provider_error' });
}
