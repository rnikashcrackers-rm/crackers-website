import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceClient, isServiceConfigured, ServiceConfigError } from '@/lib/supabase/service';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

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
    const body = await req.json();

    if (!isServiceConfigured()) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
        const { getLocalSettings, saveLocalSettings } = await import('@/lib/local-db');
        const current = getLocalSettings(DEFAULT_SETTINGS);
        const updated = { ...current, ...body };
        saveLocalSettings(updated);
        cachedSettingsRaw = null;
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { error: 'Supabase service role key is not configured correctly. Admin operations require the actual service_role key.' },
        { status: 500 }
      );
    }

    const supabase = createServiceClient();

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

    // Check if global_discount has changed — recalculate all product prices
    const newDiscount = body.global_discount;
    if (newDiscount !== undefined && String(newDiscount) !== String(previousDiscount)) {
      const discountVal = parseInt(String(newDiscount));
      if (!isNaN(discountVal) && discountVal >= 0 && discountVal <= 100) {
        console.log(`Global discount changed from ${previousDiscount}% to ${discountVal}%. Recalculating prices...`);
        
        // Fetch all products
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select('id, price');
        
        if (fetchError) throw fetchError;
        
        if (products && products.length > 0) {
          // Update each product individually to avoid upsert issues
          for (const chunk of chunkArray(products, 50)) {
            const updatePromises = chunk.map(p => {
              const price = p.price || 0;
              const mrp = discountVal < 100 ? Math.round(price / (1 - discountVal / 100)) : price;
              return supabase
                .from('products')
                .update({
                  mrp: mrp,
                  discount_percent: discountVal,
                  badge_text: discountVal > 0 ? `🔥 ${discountVal}% OFF` : null,
                })
                .eq('id', p.id);
            });
            
            const results = await Promise.all(updatePromises);
            for (const result of results) {
              if (result.error) {
                console.error('Product price update error:', result.error);
              }
            }
          }
        }
      }
    }

    // Invalidate caches
    cachedSettingsRaw = null;
    try {
      const { invalidateProductsCache } = await import('@/app/api/products/route');
      invalidateProductsCache();
    } catch { /* best effort */ }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
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
