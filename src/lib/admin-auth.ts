import { NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { ADMIN_SESSION_DURATION_MS } from './constants';

/**
 * Server-side admin authentication guard.
 * Validates the HMAC-based bearer token issued by /api/admin/auth
 * against the configured ADMIN_PASSWORD and an 8-hour session window.
 *
 * Token format: base64("admin:<timestamp>:<hmac_signature>")
 * The HMAC is computed as: HMAC-SHA256(secret, "admin:<timestamp>")
 * This ensures the password is never embedded in the token.
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
    const parts = decoded.split(':');
    
    // Support both old format (admin:ts:password) and new format (admin:ts:hmac)
    if (parts.length < 3 || parts[0] !== 'admin') {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    const tsRaw = parts[1];
    const providedSignature = parts.slice(2).join(':'); // Rejoin in case HMAC contains ':'
    const ts = Number(tsRaw);
    const adminPassword = process.env.ADMIN_PASSWORD || 'nikash@admin2026';

    if (!ts || isNaN(ts)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Session expiry check (8 hours)
    if (Date.now() - ts > ADMIN_SESSION_DURATION_MS) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Try HMAC verification first (new tokens)
    const hmacSecret = process.env.ADMIN_HMAC_SECRET || adminPassword;
    const expectedHmac = crypto
      .createHmac('sha256', hmacSecret)
      .update(`admin:${tsRaw}`)
      .digest('hex');

    if (providedSignature === expectedHmac) {
      return null; // Valid HMAC token
    }

    // Backward-compatible: check if it's an old-format token with plaintext password
    if (providedSignature === adminPassword) {
      return null; // Valid legacy token — will be phased out
    }

    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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
