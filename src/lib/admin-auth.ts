import { NextResponse } from 'next/server';

/**
 * Server-side admin authentication guard.
 * Validates the bearer token issued by /api/admin/auth against the
 * configured ADMIN_PASSWORD and an 8-hour session window.
 *
 * Returns `null` when authorized, or a 401 NextResponse to short-circuit.
 */
export function requireAdmin(req: Request): NextResponse | null {
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;
  // Some browsers/clients send it as a custom header instead
  const token = tokenFromHeader || req.headers.get('x-admin-token');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    // Token format: admin:<timestamp>:<password>
    const [, tsRaw, password] = decoded.split(':');
    const ts = Number(tsRaw);
    const adminPassword = process.env.ADMIN_PASSWORD || 'nikash@admin2026';

    if (!ts || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 8 hour session
    if (Date.now() - ts > 8 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    return null;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

/**
 * Helper for client-side fetches to attach the admin token.
 * Falls back gracefully when localStorage is unavailable (SSR / private mode).
 */
export function adminAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('nc-admin-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
