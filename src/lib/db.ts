import { createClient } from '@supabase/supabase-js';
import type { Product } from './supabase/types';
import { ALL_CATEGORIES } from './data/products';

export async function getCategories() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const DEFAULT_CATEGORIES = ALL_CATEGORIES;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
    return DEFAULT_CATEGORIES;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch products count per category dynamically to enforce Phase 4 rule
    const [{ data: catData, error: catError }, { data: prodData, error: prodError }] = await Promise.all([
      supabase.from('categories').select('id,label,emoji,sort_order').order('sort_order', { ascending: true }),
      supabase.from('products').select('category'),
    ]);

    if (catError) throw catError;

    const activeCatIds = new Set((prodData || []).map((p: any) => p.category));

    if (catData && catData.length > 0) {
      const validCategories = catData.filter((c: any) => c.id === 'all' || activeCatIds.has(c.id));
      const hasAll = validCategories.some((c: any) => c.id === 'all');
      if (hasAll) {
        return validCategories;
      } else {
        return [
          { id: 'all', label: 'All Products', emoji: '🎆' },
          ...validCategories.map((c: any) => ({
            id: c.id,
            label: c.label,
            emoji: c.emoji || '✨'
          }))
        ];
      }
    }
    return DEFAULT_CATEGORIES;
  } catch (err) {
    console.error('Failed to fetch categories directly on server:', err);
    return DEFAULT_CATEGORIES;
  }
}

export async function getProducts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
    const { getLocalProducts } = await import('./local-db');
    const { getSiteSettings } = await import('./settings');
    const productsList = getLocalProducts();
    const settings = await getSiteSettings();
    const globalDiscount = parseInt(settings.global_discount) || 80;

    return productsList.map((p: any) => {
      const price = Number(p.price) || 0;
      const mrp = globalDiscount < 100 && globalDiscount >= 0 ? Math.round(price / (1 - globalDiscount / 100)) : price;
      return {
        ...p,
        price,
        mrp,
        discount_percent: globalDiscount,
        badge_text: globalDiscount > 0 ? `🔥 ${globalDiscount}% OFF` : null,
      };
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('products')
      .select('id,name_en,name_ta,slug,category,price,mrp,discount_percent,badge_text,image_url,in_stock,is_featured,is_eco_friendly,sort_order,images,description_en,description_ta,created_at')
      .order('sort_order', { ascending: true });
    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error('Failed to fetch products directly on server:', err);
    return [];
  }
}
