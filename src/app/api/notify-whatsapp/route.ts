import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { phone, orderNumber, customerName, pdfBase64 } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Fetch settings from database first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    let dbSettings: Record<string, string> = {};
    if (supabaseUrl && !supabaseUrl.includes('your_supabase')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase.from('site_settings').select('key, value');
        if (data) {
          data.forEach(row => {
            dbSettings[row.key] = row.value;
          });
        }
      } catch (err) {
        console.error('Error loading settings in notify-whatsapp:', err);
      }
    }

    let provider = dbSettings.whatsapp_provider || process.env.WHATSAPP_PROVIDER || 'none';

    // Explicit override if database is 'none' but env has a valid provider configured
    if (provider === 'none' && process.env.WHATSAPP_PROVIDER && process.env.WHATSAPP_PROVIDER !== 'none') {
      provider = process.env.WHATSAPP_PROVIDER;
    }

    const caption = `Hello ${customerName || 'Customer'}, thank you for shopping with NIKASH CRACKERS! 🎆 Here is your Order Receipt for ${orderNumber}.`;

    // Normalizing phone number (removing non-digits, ensuring it starts with country code, no + or spacing)
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`; // Default to Indian country code
    }

    console.log(`[WhatsApp Notification] Dispatching via provider: ${provider} to: ${cleanPhone}`);

    if (provider === 'none') {
      return NextResponse.json({ success: true, status: 'skipped', message: 'WhatsApp provider disabled (none)' });
    }

    // ── Option A: UltraMsg (Cost-Friendly, Unlimited Unofficial API) ──
    if (provider === 'ultramsg') {
      const instanceId = dbSettings.whatsapp_ultramsg_instance_id || process.env.ULTRAMSG_INSTANCE_ID;
      const token = dbSettings.whatsapp_ultramsg_token || process.env.ULTRAMSG_TOKEN;

      if (!instanceId || !token) {
        return NextResponse.json({ error: 'UltraMsg credentials not configured' }, { status: 500 });
      }

      // If we don't have a PDF, send a simple chat message instead
      if (!pdfBase64) {
        const chatUrl = `https://api.ultramsg.com/${instanceId}/messages/chat`;
        const chatRes = await fetch(chatUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token,
            to: cleanPhone,
            body: caption
          }).toString()
        });
        const chatData = await chatRes.json();
        return NextResponse.json({ success: true, provider: 'ultramsg', data: chatData });
      }

      // Send PDF document using UltraMsg
      const docUrl = `https://api.ultramsg.com/${instanceId}/messages/document`;
      const docRes = await fetch(docUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token,
          to: cleanPhone,
          filename: `NC-Receipt-${orderNumber}.pdf`,
          document: `data:application/pdf;base64,${pdfBase64}`,
          caption: caption
        }).toString()
      });

      const docData = await docRes.json();
      if (!docRes.ok || docData.error) {
        console.error('UltraMsg Delivery Error:', docData);
        return NextResponse.json({ error: docData.error || 'UltraMsg delivery failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true, provider: 'ultramsg', data: docData });
    }

    // ── Option B: Meta WhatsApp Business Cloud API (Official Template-Based) ──
    if (provider === 'whatsapp_business') {
      const phoneId = (provider === process.env.WHATSAPP_PROVIDER ? process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID : dbSettings.whatsapp_business_phone_number_id) || dbSettings.whatsapp_business_phone_number_id || process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID;
      const token = (provider === process.env.WHATSAPP_PROVIDER ? process.env.WHATSAPP_BUSINESS_ACCESS_TOKEN : dbSettings.whatsapp_business_access_token) || dbSettings.whatsapp_business_access_token || process.env.WHATSAPP_BUSINESS_ACCESS_TOKEN;

      if (!phoneId || !token) {
        return NextResponse.json({ error: 'WhatsApp Business credentials not configured' }, { status: 500 });
      }

      // Step 1: Upload the PDF file to Meta's servers to get a media ID
      let mediaId = '';
      if (pdfBase64) {
        try {
          const buffer = Buffer.from(pdfBase64, 'base64');
          const formData = new FormData();
          
          // Next.js Route handlers support sending Blob data inside FormData
          const blob = new Blob([buffer], { type: 'application/pdf' });
          formData.append('file', blob, `NC-Receipt-${orderNumber}.pdf`);
          formData.append('type', 'application/pdf');
          formData.append('messaging_product', 'whatsapp');

          const uploadUrl = `https://graph.facebook.com/v25.0/${phoneId}/media`;
          const uploadRes = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.id) {
            mediaId = uploadData.id;
            console.log(`[Meta Upload] Successfully uploaded PDF. Media ID: ${mediaId}`);
          } else {
            console.warn('[Meta Upload] PDF upload failed, sending text-only template:', uploadData);
          }
        } catch (uploadErr) {
          console.error('[Meta Upload] Error uploading media, fallback to text:', uploadErr);
        }
      }

      // Step 2: Dispatch template message
      // Note: Template names must be pre-approved on Meta developer console.
      // - Standard header parameter: 'document' using media id or hosted link.
      const sendUrl = `https://graph.facebook.com/v25.0/${phoneId}/messages`;
      
      const templateComponents: any[] = [];
      const templateName = dbSettings.whatsapp_template_name === 'hello_world'
        ? 'hello_world'
        : (mediaId ? 'order_receipt_document' : 'order_receipt_text_only');
      
      if (mediaId && templateName !== 'hello_world') {
        templateComponents.push({
          type: 'header',
          parameters: [
            {
              type: 'document',
              document: {
                id: mediaId,
                filename: `NC-Receipt-${orderNumber}.pdf`
              }
            }
          ]
        });
      }

      if (templateName !== 'hello_world') {
        templateComponents.push({
          type: 'body',
          parameters: [
            { type: 'text', text: customerName || 'Customer' },
            { type: 'text', text: orderNumber }
          ]
        });
      }

      const messagePayload: any = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en_US'
          }
        }
      };

      if (templateName !== 'hello_world') {
        messagePayload.template.components = templateComponents;
      }

      const sendRes = await fetch(sendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagePayload)
      });

      const sendData = await sendRes.json();
      if (!sendRes.ok) {
        console.error('Meta Cloud API Error:', sendData);
        return NextResponse.json({ error: sendData.error?.message || 'Meta Cloud API delivery failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true, provider: 'whatsapp_business', data: sendData });
    }

    return NextResponse.json({ error: `Unsupported WhatsApp provider: ${provider}` }, { status: 400 });
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch WhatsApp receipt' }, { status: 500 });
  }
}
