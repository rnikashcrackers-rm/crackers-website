import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  global_discount: '80',
  min_order_value: '2000',
  company_name: 'Nikash Crackers',
  company_address: 'Nikash Crackers, Sivakasi, Tamil Nadu - 626123.',
  mobile_number_1: '7867955841',
  mobile_number_2: '7867955841',
  whatsapp_number: '7867955841',
  email_address: 'rnikashcrackers@gmail.com',
  marquee: 'Welcome to Nikash Crackers Sivakasi - Direct Factory Price Quality Fireworks! We Give Special Festive Discounts! Buy More Save More!',
  whatsapp_provider: 'whatsapp_business',
  whatsapp_business_phone_number_id: '',
  whatsapp_business_access_token: '',
  whatsapp_ultramsg_instance_id: '',
  whatsapp_ultramsg_token: '',
  whatsapp_template_name: 'order_status_update',
  whatsapp_msg_pending: 'Hello {{customer_name}}, your order {{order_number}} is received and is pending verification. We will contact you shortly to confirm!',
  whatsapp_msg_confirmed: 'Hello {{customer_name}}, your order {{order_number}} is confirmed! We are packaging your crackers now.',
  whatsapp_msg_processing: 'Hello {{customer_name}}, your order {{order_number}} is being processed at our Sivakasi factory.',
  whatsapp_msg_shipped: 'Hello {{customer_name}}, your order {{order_number}} has been shipped! Transport tracking details: {{tracking_info}}',
  whatsapp_msg_delivered: 'Hello {{customer_name}}, your order {{order_number}} has been successfully delivered. Happy and safe celebrating! 🎆',
  whatsapp_msg_cancelled: 'Hello {{customer_name}}, your order {{order_number}} has been cancelled. Please contact support if you have questions.',
};

let cachedSettingsRaw: { data: Record<string, string>; timestamp: number } | null = null;
const SETTINGS_TTL_MS = 60000; // 60 seconds

// GET — Retrieve all settings
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const now = Date.now();
    if (!isAdmin && cachedSettingsRaw && (now - cachedSettingsRaw.timestamp) < SETTINGS_TTL_MS) {
      return NextResponse.json(cachedSettingsRaw.data, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' }
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      const { getLocalSettings } = await import('@/lib/local-db');
      const local = getLocalSettings(DEFAULT_SETTINGS);
      cachedSettingsRaw = { data: local, timestamp: now };
      return NextResponse.json(local);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('site_settings').select('key, value');

    if (error) throw error;

    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    if (data) {
      data.forEach((row: { key: string; value: string }) => {
        settings[row.key] = row.value;
      });
    }

    cachedSettingsRaw = { data: settings, timestamp: now };

    const responseHeaders: Record<string, string> = {};
    if (isAdmin) {
      responseHeaders['Cache-Control'] = 'no-store, max-age=0, must-revalidate';
    } else {
      responseHeaders['Cache-Control'] = 'public, s-maxage=60, stale-while-revalidate=600';
    }

    return NextResponse.json(settings, {
      headers: responseHeaders
    });
  } catch (error: any) {
    console.error('Error getting settings:', error);
    if (cachedSettingsRaw) return NextResponse.json(cachedSettingsRaw.data);
    const { getLocalSettings } = await import('@/lib/local-db');
    return NextResponse.json(getLocalSettings(DEFAULT_SETTINGS));
  }
}

// POST — Update settings (and update all product prices if global_discount changes)
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const body = await req.json();

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      const { getLocalSettings, saveLocalSettings } = await import('@/lib/local-db');
      const current = getLocalSettings(DEFAULT_SETTINGS);
      const updated = { ...current, ...body };
      saveLocalSettings(updated);
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if global_discount is changing
    let previousDiscount = '80';
    const { data: currentDiscountRow } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'global_discount')
      .single();
    if (currentDiscountRow) {
      previousDiscount = currentDiscountRow.value;
    }

    // Save settings
    const upserts = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    if (upserts.length > 0) {
      const { error: upsertError } = await supabase.from('site_settings').upsert(upserts);
      if (upsertError) throw upsertError;
    }

    // Check if global_discount has changed
    const newDiscount = body.global_discount;
    if (newDiscount !== undefined && String(newDiscount) !== String(previousDiscount)) {
      const discountVal = parseInt(String(newDiscount));
      if (!isNaN(discountVal) && discountVal >= 0 && discountVal <= 100) {
        console.log(`Global discount changed from ${previousDiscount}% to ${discountVal}%. Recalculating prices...`);
        
        // Fetch all products
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select('*');
        
        if (fetchError) throw fetchError;
        
        if (products && products.length > 0) {
          // Build updates according to Section 4 specifications
          const updates = products.map(p => {
            const price = p.price || 0;
            const mrp = discountVal < 100 ? Math.round(price / (1 - discountVal / 100)) : price;
            return {
              id: p.id,
              name_en: p.name_en,
              name_ta: p.name_ta,
              slug: p.slug,
              category: p.category,
              price: price,
              mrp: mrp,
              discount_percent: discountVal,
              badge_text: discountVal > 0 ? `🔥 ${discountVal}% OFF` : null,
              image_url: p.image_url,
              in_stock: p.in_stock,
              is_featured: p.is_featured,
              is_eco_friendly: p.is_eco_friendly,
              sort_order: p.sort_order,
            };
          });

          // Supabase upsert on products table (replaces matching rows by id)
          for (const chunk of chunkArray(updates, 50)) {
            const { error: updateError } = await supabase.from('products').upsert(chunk);
            if (updateError) {
              console.error('Chunk update error:', updateError);
              throw updateError;
            }
          }
        }
      }
    }

    cachedSettingsRaw = null;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to chunk arrays for bulk operations
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
