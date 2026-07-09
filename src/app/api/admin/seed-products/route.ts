import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { products as staticProducts } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

// Bulk insert all static products into Supabase
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase') || !supabaseKey) {
      return NextResponse.json({
        error: 'Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local'
      }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Map static products to Supabase schema
    const productsToInsert = staticProducts.map((p, index) => ({
      name_en: p.name_en,
      name_ta: p.name_ta || p.name_en,
      slug: p.slug || p.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + index,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      discount_percent: p.discount_percent || 0,
      badge_text: p.badge_text || null,
      image_url: p.image_url || null,
      in_stock: p.in_stock !== undefined ? p.in_stock : true,
      is_featured: p.is_featured || false,
      is_eco_friendly: false,
      sort_order: index,
    }));

    // Insert in batches of 50 to avoid payload limits
    let totalInserted = 0;
    const batchSize = 50;
    const errors: string[] = [];

    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'slug' })
        .select();

      if (error) {
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      } else {
        totalInserted += data?.length || 0;
      }
    }

    return NextResponse.json({
      success: true,
      totalInserted,
      totalAttempted: productsToInsert.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Bulk seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
