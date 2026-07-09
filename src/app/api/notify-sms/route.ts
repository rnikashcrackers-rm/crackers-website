import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, orderNumber, amount, customerName } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const provider = process.env.SMS_PROVIDER || 'none';
    const message = `Hello ${customerName || 'Customer'}, your NIKASH CRACKERS order ${orderNumber} for Rs. ${amount} is confirmed! We will contact you soon for dispatch details. Thank you!`;

    // Normalizing phone number for SMS delivery (removing spaces, dashes, +, and ensuring country code 91 if local)
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`; // Default to Indian country code
    }

    console.log(`[SMS Notification] Dispatching via provider: ${provider} to: ${cleanPhone}`);

    if (provider === 'none') {
      return NextResponse.json({ success: true, status: 'skipped', message: 'SMS provider disabled (none)' });
    }

    // ── Option A: Fast2SMS (Cheapest in India) ──
    if (provider === 'fast2sms') {
      const apiKey = process.env.FAST2SMS_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: 'Fast2SMS API key not configured' }, { status: 500 });
      }

      // Fast2SMS Developer API Call
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          language: 'english',
          numbers: cleanPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.return) {
        console.error('Fast2SMS Delivery Error:', data);
        return NextResponse.json({ error: data.message || 'Fast2SMS delivery failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true, provider: 'fast2sms', data });
    }

    // ── Option B: Twilio (Global Standard) ──
    if (provider === 'twilio') {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_PHONE_NUMBER;

      if (!sid || !token || !from) {
        return NextResponse.json({ error: 'Twilio credentials not configured' }, { status: 500 });
      }

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
      const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');

      // Normalizing phone for Twilio (needs leading +)
      const twilioTo = `+${cleanPhone}`;

      const params = new URLSearchParams();
      params.append('To', twilioTo);
      params.append('From', from);
      params.append('Body', message);

      const res = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Twilio Delivery Error:', data);
        return NextResponse.json({ error: data.message || 'Twilio delivery failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true, provider: 'twilio', sid: data.sid });
    }

    return NextResponse.json({ error: `Unsupported SMS provider: ${provider}` }, { status: 400 });
  } catch (error: any) {
    console.error('Error dispatching SMS:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch SMS' }, { status: 500 });
  }
}
