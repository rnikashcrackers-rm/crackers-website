import { NextResponse } from 'next/server';
import * as crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'nikash@admin2026';

    if (password === adminPassword) {
      // Generate HMAC-based token — the password is NOT embedded in the token
      const timestamp = Date.now().toString();
      const hmacSecret = process.env.ADMIN_HMAC_SECRET || adminPassword;
      const hmac = crypto.createHmac('sha256', hmacSecret)
        .update(`admin:${timestamp}`)
        .digest('hex');
      const token = Buffer.from(`admin:${timestamp}:${hmac}`).toString('base64');
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
