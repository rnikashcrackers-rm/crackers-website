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
    const { data, error } = await supabase
      .from('categories')
      .select('id,label,emoji,sort_order')
      .order('sort_order', { ascending: true });
    if (error) throw error;

    if (data && data.length > 0) {
      const hasAll = data.some((c: any) => c.id === 'all');
      if (hasAll) {
        return data;
      } else {
        return [
          { id: 'all', label: 'All Products', emoji: '🎆' },
          ...data.map((c: any) => ({
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
      const mrp = p.mrp || (globalDiscount < 100 ? Math.round((p.price || 0) / (1 - globalDiscount / 100)) : (p.price || 0));
      const price = Math.round(mrp * (1 - globalDiscount / 100));
      return {
        ...p,
        mrp,
        price,
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

    // Filter out combo packs right on the server for consistency
    const filtered = (data || []).filter((p: any) => {
      if (p.category === 'giftbox' && (p.name_en || '').toLowerCase().includes('pack')) {
        return false;
      }
      return true;
    });

    return filtered;
  } catch (err) {
    console.error('Failed to fetch products directly on server:', err);
    return [];
  }
}
