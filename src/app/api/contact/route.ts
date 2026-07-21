import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, website, numA, numB, securityAnswer } = body;

    // Honeypot validation - if website contains any value, we assume it's a bot submission.
    // We return a 201 success response with dummy data but do NOT store it or send an email.
    if (website && website.trim() !== '') {
      console.warn('Spam submission detected via honeypot field. Silently dropping.');
      return NextResponse.json({
        id: crypto.randomUUID(),
        name, email, phone, subject, message,
        is_read: false,
        created_at: new Date().toISOString(),
      }, { status: 201 });
    }

    // Validate Math Challenge
    if (numA === undefined || numB === undefined || securityAnswer === undefined) {
      return NextResponse.json({ error: 'Security verification is required' }, { status: 400 });
    }

    if (Number(numA) + Number(numB) !== Number(securityAnswer)) {
      return NextResponse.json({ error: 'Security verification failed. Please try again.' }, { status: 400 });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      // Demo mode — return success without DB
      return NextResponse.json({
        id: crypto.randomUUID(),
        name, email, phone, subject, message,
        is_read: false,
        created_at: new Date().toISOString(),
      }, { status: 201 });
    }

    let data: any = null;
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const dbInsert = async () => {
        const { data: inserted, error } = await supabase
          .from('contact_messages')
          .insert({ name, email, phone: phone || null, subject, message })
          .select()
          .single();
        if (error) throw error;
        return inserted;
      };

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Contact insert timeout')), 8000)
      );

      data = await Promise.race([dbInsert(), timeout]);
    } catch (dbErr) {
      console.warn('Database contact insert failed or timed out. Returning success in demo mode:', dbErr instanceof Error ? dbErr.message : String(dbErr));
      data = {
        id: crypto.randomUUID(),
        name, email, phone, subject, message,
        is_read: false,
        created_at: new Date().toISOString(),
      };
    }

    // Dispatch email notification using Resend
    const apiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

    if (apiKey && apiKey !== 'your_resend_api_key') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        // 1. Send confirmation to the client
        await resend.emails.send({
          from: `NIKASH CRACKERS <${senderEmail}>`,
          to: [email],
          subject: `We received your message — NIKASH CRACKERS`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px 20px; border-radius: 8px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #f0eada; padding-bottom: 15px;">
                <img src="https://rmnikashcrackers.com/logo/logo.png" alt="NIKASH CRACKERS" style="width: 60px; height: 60px; border-radius: 50%; border: 1px solid #FF8A6B; display: inline-block; background-color: #ffffff;" />
                <h3 style="color: #FF8A6B; margin: 8px 0 0; font-size: 16px; font-weight: bold; letter-spacing: 2px; font-family: Georgia, serif;">NIKASH CRACKERS</h3>
              </div>
              <h2 style="color: #E8394F; margin-top: 0;">Welcome to NIKASH CRACKERS!</h2>
              <p>Hello <strong>${name}</strong>,</p>
              <p>Thank you for reaching out to us. We have received your message regarding "<strong>${subject}</strong>".</p>
              <p>Our team will review your query and respond back to you within 24 hours.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #777;">This is an automated confirmation. Please do not reply directly to this email.</p>
            </div>
          `
        });

        // 2. Send notification to the admin
        const adminEmail = process.env.ADMIN_EMAIL || 'rnikashcrackers@gmail.com';
        await resend.emails.send({
          from: `NIKASH CRACKERS Alerts <${senderEmail}>`,
          to: [adminEmail],
          subject: `New Contact Message: ${subject} | NIKASH CRACKERS`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px 20px; border-radius: 8px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #f0eada; padding-bottom: 15px;">
                <img src="https://rmnikashcrackers.com/logo/logo.png" alt="NIKASH CRACKERS" style="width: 60px; height: 60px; border-radius: 50%; border: 1px solid #FF8A6B; display: inline-block; background-color: #ffffff;" />
                <h3 style="color: #FF8A6B; margin: 8px 0 0; font-size: 16px; font-weight: bold; letter-spacing: 2px; font-family: Georgia, serif;">NIKASH CRACKERS</h3>
              </div>
              <h2 style="color: #d9534f; margin-top: 0;">New Contact Inquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p style="margin-top: 20px;"><strong>Message:</strong></p>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #E8394F; font-style: italic;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Failed to send contact emails:', emailErr);
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json([]);
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const fetchWithTimeout = async () => {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      };

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Contact messages fetch timeout')), 8000)
      );

      const data = await Promise.race([fetchWithTimeout(), timeout]);
      return NextResponse.json(data);
    } catch (dbErr) {
      console.warn('Database error fetching contact messages, returning empty list:', dbErr);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ success: true });
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      if (id) {
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('contact_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
      }
    } catch (dbErr) {
      console.warn('Database delete contact message failed:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 200 });
  }
}
