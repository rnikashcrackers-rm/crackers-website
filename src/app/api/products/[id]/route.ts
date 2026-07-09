import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// GET single product
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Local DB fallback
    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      const { getLocalProducts } = await import('@/lib/local-db');
      const product = getLocalProducts().find(p => String(p.id) === String(id));
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      return NextResponse.json(product);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}

// PATCH — Update product
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const body = await req.json();

    // Local DB fallback
    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      const { getLocalProducts, saveLocalProducts } = await import('@/lib/local-db');
      const currentList = getLocalProducts();
      const productIndex = currentList.findIndex(p => String(p.id) === String(id));
      if (productIndex === -1) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      const currentProduct = currentList[productIndex];
      const updatedProduct = {
        ...currentProduct,
        ...body,
      };

      // Recalculate discount
      if (body.mrp !== undefined || body.price !== undefined) {
        const mrp = body.mrp || updatedProduct.mrp || 0;
        const price = body.price || updatedProduct.price || 0;
        if (mrp > 0 && price < mrp) {
          updatedProduct.discount_percent = Math.round(((mrp - price) / mrp) * 100);
          updatedProduct.badge_text = `🔥 ${updatedProduct.discount_percent}% OFF`;
        } else {
          updatedProduct.discount_percent = 0;
          updatedProduct.badge_text = null;
        }
      }

      currentList[productIndex] = updatedProduct;
      saveLocalProducts(currentList);
      return NextResponse.json(updatedProduct);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const updateData: Record<string, any> = {};
    if (body.name_en !== undefined) updateData.name_en = body.name_en;
    if (body.name_ta !== undefined) updateData.name_ta = body.name_ta;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.mrp !== undefined) updateData.mrp = body.mrp;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.in_stock !== undefined) updateData.in_stock = body.in_stock;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;

    // Recalculate discount
    if (body.mrp !== undefined || body.price !== undefined) {
      const mrp = body.mrp || updateData.mrp || 0;
      const price = body.price || updateData.price || 0;
      if (mrp > 0 && price < mrp) {
        updateData.discount_percent = Math.round(((mrp - price) / mrp) * 100);
        updateData.badge_text = `🔥 ${updateData.discount_percent}% OFF`;
      }
    }

    const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — Delete product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    // Local DB fallback
    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      const { getLocalProducts, saveLocalProducts } = await import('@/lib/local-db');
      const currentList = getLocalProducts();
      const newList = currentList.filter(p => String(p.id) !== String(id));
      saveLocalProducts(newList);
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
