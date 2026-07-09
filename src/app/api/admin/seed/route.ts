import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as xlsx from 'xlsx';

export const dynamic = 'force-dynamic';

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function cleanKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

function getRowValue(row: any, searchKeys: string[]): any {
  for (const k of Object.keys(row)) {
    const cleaned = cleanKey(k);
    if (searchKeys.includes(cleaned)) {
      return row[k];
    }
  }
  return undefined;
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error: 'Supabase credentials are not configured in .env.local' }, { status: 400 });
    }

    // Initialize Supabase admin client (bypass RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel/CSV
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<any>(sheet);

    // Fetch existing categories to map or auto-create
    const { data: dbCategories, error: catError } = await supabase
      .from('categories')
      .select('*');
    
    if (catError) throw catError;

    const localCategories = dbCategories ? [...dbCategories] : [];

    const products = [];

    for (const row of rows) {
      const nameEn = getRowValue(row, ['productname', 'productnameenglish', 'name', 'nameen', 'englishname'])?.toString().trim();
      if (!nameEn) continue;

      const nameTa = getRowValue(row, ['productnametamil', 'tamilname', 'nameta', 'tamilnameen', 'productnameta'])?.toString().trim() || nameEn;
      const categoryRaw = getRowValue(row, ['productcategory', 'category', 'categoryname'])?.toString().trim() || 'General';

      const mrpVal = getRowValue(row, ['originalprice', 'originalpricefirst', 'originalpriceinrupees', 'originalpricemrp', 'mrp', 'originalprice']);
      const priceVal = getRowValue(row, ['discountedprice', 'discountedpriceinrupees', 'discountedpricesellingprice', 'price', 'sellingprice', 'discountedprice']);

      const mrp = parseInt(mrpVal) || 0;
      const price = parseInt(priceVal) || mrp;

      let discount_percent = 0;
      if (mrp > 0 && price < mrp) {
        discount_percent = Math.round(((mrp - price) / mrp) * 100);
      }

      // Resolve category
      let categoryId = 'general';
      const cleanCatRaw = categoryRaw.toLowerCase();
      const matchedCat = localCategories.find(
        (c) => c.id.toLowerCase() === cleanCatRaw || c.label.toLowerCase() === cleanCatRaw
      );

      if (matchedCat) {
        categoryId = matchedCat.id;
      } else {
        // Auto-create category
        const generatedId = categoryRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const finalId = generatedId || 'general';

        const existingById = localCategories.find((c) => c.id === finalId);
        if (existingById) {
          categoryId = existingById.id;
        } else {
          const newCat = {
            id: finalId,
            label: categoryRaw,
            emoji: '🎆',
            sort_order: localCategories.length,
          };
          
          const { error: insertCatErr } = await supabase.from('categories').insert(newCat);
          if (!insertCatErr) {
            localCategories.push(newCat);
            categoryId = finalId;
          } else {
            console.error('Error auto-creating category:', insertCatErr);
          }
        }
      }

      products.push({
        name_en: nameEn,
        name_ta: nameTa,
        slug: generateSlug(nameEn) + '-' + Math.random().toString(36).substring(2, 6),
        category: categoryId,
        price,
        mrp,
        discount_percent,
        badge_text: discount_percent > 50 ? `${discount_percent}% OFF` : null,
        image_url: null,
        in_stock: true,
        is_featured: discount_percent > 60,
      });
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'No valid products found in the uploaded file' }, { status: 400 });
    }

    const { data, error } = await supabase.from('products').insert(products).select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, count: data?.length || 0 });

  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

