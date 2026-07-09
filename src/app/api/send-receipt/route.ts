import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { formatOrderDateTime } from '@/lib/utils';

export async function POST(req: Request) {
  let body: any = null;
  try {
    body = await req.json();
    const {
      to,
      orderNumber,
      customerName,
      items,
      totalAmount,
      subtotal,
      discountTotal,
      pdfBase64,
      customerPhone,
      customerAddress,
      customerCity,
      customerPincode,
      customerState,
      customerDistrict,
      notifyAdmin
    } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

    if (!apiKey || apiKey === 'your_resend_api_key') {
      console.log('Resend API key not configured, skipping email');
      return NextResponse.json({ success: true, skipped: true });
    }

    const resend = new Resend(apiKey);

    // Build HTML email
    const itemsHtml = (items as any[]).map((item: any) =>
      `<tr>
        <td style="padding:10px 16px;border-bottom:1px solid #eee;font-size:14px">${item.name}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #eee;text-align:center;font-size:14px">${item.quantity}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #eee;text-align:right;font-size:14px">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #eee;text-align:right;font-size:14px;font-weight:bold">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>`
    ).join('');

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmed — ${orderNumber}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#FAF7F0;font-family:'Inter', 'Segoe UI', Arial, sans-serif;-webkit-font-smoothing:antialiased;color:#2D241E;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F0;padding:20px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(45,36,30,0.06);border:1px solid #E8E2D1;">
              
              <!-- Top Banner & Logo -->
              <tr>
                <td style="background-color:#FFFDF6;padding:40px 32px;text-align:center;border-bottom:1px solid #F0EADA;">
                  <img src="https://rmnikashcrackers.com/logo/logo.png" alt="NIKASH CRACKERS Logo" style="width:75px;height:75px;border-radius:50%;margin-bottom:15px;border:1px solid #FF8A6B;background-color:#ffffff;display:inline-block;box-shadow:0 4px 12px rgba(255,138,107,0.15);" />
                  <h1 style="color:#8C1D1D;margin:0;font-size:24px;font-weight:900;letter-spacing:2px;font-family:'Cinzel', Georgia, serif;text-transform:uppercase;">NIKASH CRACKERS</h1>
                  <p style="color:#FF8A6B;margin:8px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:800;font-family:'Inter', Arial, sans-serif;">Affordable Sivakasi Family Fireworks</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding:40px 32px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-bottom:30px;">
                        <span style="background-color:#FFF5F2;color:#A67C00;padding:8px 20px;border-radius:100px;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;border:1px solid #FFD1C7;display:inline-block;">Order Confirmed 🎆</span>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding-bottom:16px;">
                        <h2 style="margin:0;font-size:22px;font-weight:800;color:#1A1400;">Welcome to the NIKASH CRACKERS Family, ${customerName}! 🎆</h2>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding-bottom:30px;">
                        <p style="margin:0;font-size:14px;color:#8B735B;line-height:1.6;font-weight:500;">We are absolutely thrilled to celebrate this festive season with you! Your order has been successfully recorded and is now being processed. A copy of your PDF receipt/invoice has been generated and is attached to this email for your reference.</p>
                      </td>
                    </tr>
                    
                    <!-- Metadata Box -->
                    <tr>
                      <td style="padding-bottom:30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F0;border:1px solid #E8E2D1;border-radius:16px;padding:20px;">
                          <tr>
                            <td style="font-size:13px;color:#8B735B;padding-bottom:8px;">
                              <strong style="color:#2D241E;font-weight:700;">Order Number:</strong> <span style="color:#A67C00;font-weight:700;font-family:monospace;font-size:14px;">${orderNumber}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:13px;color:#8B735B;">
                              <strong style="color:#2D241E;font-weight:700;">Order Date:</strong> ${formatOrderDateTime()}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Items Section -->
                    <tr>
                      <td style="padding-bottom:20px;">
                        <h3 style="margin:0;font-size:14px;font-weight:800;color:#1A1400;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-bottom:2px solid #FF8A6B;">Ordered Items</h3>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding-bottom:30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <thead>
                            <tr style="color:#8B735B;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;text-align:left;">
                              <th style="padding:10px 0;border-bottom:1px solid #E8E2D1;">Product</th>
                              <th style="padding:10px 10px;border-bottom:1px solid #E8E2D1;text-align:center;width:60px;">Qty</th>
                              <th style="padding:10px 10px;border-bottom:1px solid #E8E2D1;text-align:right;width:90px;">Price</th>
                              <th style="padding:10px 0;border-bottom:1px solid #E8E2D1;text-align:right;width:90px;">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${itemsHtml}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Totals Section -->
                    <tr>
                      <td style="padding-bottom:40px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F0;border-radius:16px;padding:20px;border:1px solid #E8E2D1;">
                          <tr>
                            <td style="font-size:14px;color:#8B735B;padding-bottom:10px;">Subtotal</td>
                            <td align="right" style="font-size:14px;color:#2D241E;font-weight:600;padding-bottom:10px;">₹${(subtotal || totalAmount).toLocaleString('en-IN')}</td>
                          </tr>
                          ${discountTotal ? `
                          <tr>
                            <td style="font-size:14px;color:#10B981;padding-bottom:10px;">Discount Savings</td>
                            <td align="right" style="font-size:14px;color:#10B981;font-weight:700;padding-bottom:10px;">-₹${discountTotal.toLocaleString('en-IN')}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td colspan="2" style="border-top:1px solid #E8E2D1;padding-top:10px;padding-bottom:5px;"></td>
                          </tr>
                          <tr>
                            <td style="font-size:18px;font-weight:800;color:#1A1400;">Grand Total</td>
                            <td align="right" style="font-size:22px;font-weight:800;color:#A67C00;">₹${totalAmount.toLocaleString('en-IN')}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Payment & Delivery Details -->
                    <tr>
                      <td style="padding-bottom:30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                          <tr>
                            <td valign="top" width="48%" style="background-color:#FAF7F0;border:1px solid #E8E2D1;border-radius:16px;padding:20px;vertical-align:top;">
                              <h4 style="margin:0 0 12px;font-size:12px;font-weight:800;color:#A67C00;text-transform:uppercase;letter-spacing:1px;font-family:'Inter', Arial, sans-serif;">🏦 Bank Details (Payment)</h4>
                              <p style="margin:0 0 6px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;"><strong>Name:</strong> Muthuganesa pandian C</p>
                              <p style="margin:0 0 6px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;"><strong>Bank:</strong> City union bank</p>
                              <p style="margin:0 0 6px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;"><strong>Acc No:</strong> 500101012011879</p>
                              <p style="margin:0 0 6px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;"><strong>Branch:</strong> SATTUR</p>
                              <p style="margin:0 0 10px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;"><strong>IFSC Code:</strong> CIUB0000162</p>
                              <p style="margin:0 0 4px;font-size:10px;color:#8B735B;text-transform:uppercase;font-weight:bold;letter-spacing:0.5px;font-family:'Inter', Arial, sans-serif;">UPI Options</p>
                              <p style="margin:0 0 4px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;"><strong>GPay:</strong> 7867955841</p>
                              <p style="margin:0;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;"><strong>PhonePe:</strong> 7867955841</p>
                            </td>
                            <td width="4%" style="font-size:1px;line-height:1px;">&nbsp;</td>
                            <td valign="top" width="48%" style="background-color:#FAF7F0;border:1px solid #E8E2D1;border-radius:16px;padding:20px;vertical-align:top;">
                              <h4 style="margin:0 0 12px;font-size:12px;font-weight:800;color:#A67C00;text-transform:uppercase;letter-spacing:1px;font-family:'Inter', Arial, sans-serif;">🚚 Delivery Instructions</h4>
                              <p style="margin:0 0 8px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;">• Pick your order from your nearest transport office.</p>
                              <p style="margin:0 0 8px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;">• Covers: Tamil Nadu, Pondicherry, Andhra Pradesh, Karnataka, Kerala.</p>
                              <p style="margin:0 0 8px;font-size:12px;color:#2D241E;line-height:1.4;font-family:'Inter', Arial, sans-serif;">• Note: Delivery Charges Extra at office.</p>
                              <p style="margin:0 0 8px;font-size:12px;color:#C53030;line-height:1.4;font-weight:bold;font-family:'Inter', Arial, sans-serif;">• CASH ON DELIVERY NOT AVAILABLE.</p>
                              <p style="margin:0;font-size:11px;color:#8B735B;line-height:1.4;font-family:'Inter', Arial, sans-serif;">Payment Option: We accept GPay, PhonePe, and Account Transfer. We will call you to confirm.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Safety Guidelines Note -->
                    <tr>
                      <td style="background-color:#FFF5F5;border:1px solid #FEB2B2;border-radius:16px;padding:20px;margin-bottom:30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="font-size:14px;font-weight:800;color:#C53030;padding-bottom:6px;">⚠️ Safety Instructions</td>
                          </tr>
                          <tr>
                            <td style="font-size:12px;color:#9B2C2C;line-height:1.5;margin:0;">
                              Please handle all fireworks with care. Ensure an adult is present, maintain a distance of at least 5 meters when lighting, and keep a bucket of water nearby for safe disposal.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color:#FAF7F0;border-top:1px solid #E8E2D1;padding:32px;text-align:center;font-size:12px;color:#8B735B;">
                  <p style="margin:0 0 10px;font-weight:700;color:#2D241E;">📍 NIKASH CRACKERS (NIKASH CRACKERS)</p>
                  <p style="margin:0 0 10px;line-height:1.5;">9QCM+7FJ, Madathupatti<br>Kananjampatti, Tamil Nadu 626128</p>
                  <p style="margin:0 0 20px;">📞 +91 78679 55841 &nbsp;|&nbsp; ✉️ rnikashcrackers@gmail.com</p>
                  <p style="margin:0;font-size:10px;color:#A0A090;">This is an automated order confirmation. Thank you for celebrating with us!</p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const emailPayload: any = {
      from: `NIKASH CRACKERS <${senderEmail}>`,
      to: [to],
      subject: `Order Confirmed — ${orderNumber} | NIKASH CRACKERS`,
      html: emailHtml,
    };

    if (pdfBase64) {
      const base64Data = pdfBase64.includes('base64,')
        ? pdfBase64.split('base64,')[1]
        : pdfBase64;

      emailPayload.attachments = [
        {
          filename: `NC-Crackers-Receipt-${orderNumber}.pdf`,
          content: Buffer.from(base64Data, 'base64'),
          contentType: 'application/pdf',
        },
      ];
    }

    const { data, error } = await resend.emails.send(emailPayload);
    if (error) throw error;

    // Send dedicated notification email to owner if requested (e.g. on new checkout)
    const adminEmail = process.env.ADMIN_EMAIL || 'rnikashcrackers@gmail.com';
    if (notifyAdmin) {
      const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Alert — ${orderNumber}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#FAF7F0;font-family:'Inter', 'Segoe UI', Arial, sans-serif;color:#2D241E;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F0;padding:20px 10px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(45,36,30,0.06);border:1px solid #E8E2D1;">
                
                <!-- Top Banner -->
                <tr>
                  <td style="background-color:#FFFDF6;padding:40px 32px;text-align:center;border-bottom:1px solid #F0EADA;">
                    <img src="https://rmnikashcrackers.com/logo/logo.png" alt="NIKASH CRACKERS Logo" style="width:75px;height:75px;border-radius:50%;margin-bottom:15px;border:1px solid #FF8A6B;background-color:#ffffff;display:inline-block;box-shadow:0 4px 12px rgba(255,138,107,0.15);" />
                    <h1 style="color:#8C1D1D;margin:0;font-size:22px;font-weight:900;letter-spacing:2px;font-family:'Cinzel', Georgia, serif;text-transform:uppercase;">NEW ORDER RECEIVED! 🔔</h1>
                    <p style="color:#FF8A6B;margin:8px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:800;font-family:'Inter', Arial, sans-serif;">NIKASH CRACKERS Administration</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding:40px 32px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom:24px;">
                          <h2 style="margin:0;font-size:18px;font-weight:800;color:#1A1400;">Hello Admin,</h2>
                          <p style="margin:8px 0 0;font-size:14px;color:#5D5046;line-height:1.6;font-weight:500;">A new order has been successfully placed on the website. Below is a summary of the order and customer information. The full invoice receipt PDF is also attached to this email.</p>
                        </td>
                      </tr>
                      
                      <!-- Customer Information Box -->
                      <tr>
                        <td style="padding-bottom:30px;">
                          <h3 style="margin:0 0 10px;font-size:12px;font-weight:800;color:#A67C00;text-transform:uppercase;letter-spacing:1px;">👤 Customer Info</h3>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F0;border:1px solid #E8E2D1;border-radius:16px;padding:20px;font-size:13px;line-height:1.6;color:#2D241E;">
                            <tr>
                              <td><strong>Name:</strong> ${customerName}</td>
                            </tr>
                            <tr>
                              <td><strong>Phone:</strong> ${customerPhone || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Email:</strong> ${to}</td>
                            </tr>
                            <tr>
                              <td><strong>Delivery Address:</strong> ${[customerAddress, customerCity, customerDistrict, customerState, customerPincode].filter(Boolean).join(', ') || 'N/A'}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Order Summary Box -->
                      <tr>
                        <td style="padding-bottom:30px;">
                          <h3 style="margin:0 0 10px;font-size:12px;font-weight:800;color:#A67C00;text-transform:uppercase;letter-spacing:1px;">📦 Order Summary</h3>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F0;border:1px solid #E8E2D1;border-radius:16px;padding:20px;font-size:13px;line-height:1.6;color:#2D241E;">
                            <tr>
                              <td><strong>Order Number:</strong> <span style="color:#B22222;font-weight:bold;font-family:monospace;font-size:14px;">${orderNumber}</span></td>
                            </tr>
                            <tr>
                              <td><strong>Subtotal:</strong> ₹${(subtotal || totalAmount).toLocaleString('en-IN')}</td>
                            </tr>
                            ${discountTotal ? `
                            <tr>
                              <td style="color:#10B981;"><strong>Discount:</strong> -₹${discountTotal.toLocaleString('en-IN')}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="border-top:1px solid #E8E2D1;padding-top:8px;margin-top:8px;"><strong>Grand Total:</strong> <strong style="color:#A67C00;font-size:16px;">₹${totalAmount.toLocaleString('en-IN')}</strong></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Ordered Items Table -->
                      <tr>
                        <td style="padding-bottom:20px;">
                          <h3 style="margin:0;font-size:12px;font-weight:800;color:#1A1400;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-bottom:2px solid #B22222;">Items Ordered</h3>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="padding-bottom:30px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <thead>
                              <tr style="color:#8B735B;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;text-align:left;">
                                <th style="padding:10px 0;border-bottom:1px solid #E8E2D1;">Product</th>
                                <th style="padding:10px 10px;border-bottom:1px solid #E8E2D1;text-align:center;width:60px;">Qty</th>
                                <th style="padding:10px 10px;border-bottom:1px solid #E8E2D1;text-align:right;width:90px;">Price</th>
                                <th style="padding:10px 0;border-bottom:1px solid #E8E2D1;text-align:right;width:90px;">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${itemsHtml}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td align="center" style="padding-top:10px;">
                          <a href="https://rnikashcrackers.com/admin" style="background-color:#B22222;color:#ffffff;padding:12px 30px;border-radius:12px;font-size:13px;font-weight:bold;text-decoration:none;display:inline-block;box-shadow:0 4px 12px rgba(178,34,34,0.3);font-family:'Inter', Arial, sans-serif;">Manage Order in Admin Panel</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color:#FAF7F0;border-top:1px solid #E8E2D1;padding:24px;text-align:center;font-size:11px;color:#8B735B;">
                    <p style="margin:0;font-weight:700;color:#2D241E;">NIKASH CRACKERS Administration Notification System</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `;

      const adminEmailPayload: any = {
        from: `NIKASH CRACKERS Alerts <${senderEmail}>`,
        to: [adminEmail],
        subject: `🚨 New Order Alert — ${orderNumber} | NIKASH CRACKERS`,
        html: adminEmailHtml,
      };

      if (pdfBase64) {
        adminEmailPayload.attachments = [
          {
            filename: `NC-Crackers-Receipt-${orderNumber}.pdf`,
            content: pdfBase64,
            contentType: 'application/pdf',
          },
        ];
      }

      await resend.emails.send(adminEmailPayload);
    }

    // Track analytics event
    try {
      const { trackEvent } = await import('@/lib/tracking');
      await trackEvent('email_sent', 'checkout', { orderNumber, emailId: data?.id, recipient: to });
    } catch (trackErr) {
      console.error('Failed to log email analytics:', trackErr);
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error: any) {
    console.error('Email send error:', error);
    // Log error to database
    try {
      const { logError } = await import('@/lib/tracking');
      await logError('EmailSendError', error.message || String(error), error.stack, { orderNumber: body?.orderNumber, to: body?.to });
    } catch (dbErr) {
      console.error('Failed to log email error to database:', dbErr);
    }
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
