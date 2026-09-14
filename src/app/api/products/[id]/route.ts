import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceClient, isServiceConfigured, ServiceConfigError } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

// GET single product (public — uses anon key)
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

// PATCH — Update product (admin — uses service role key)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await req.json();

    // Local DB fallback
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!isServiceConfigured()) {
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
      return NextResponse.json(
        { error: 'Supabase service role key is not configured correctly. Admin operations require the actual service_role key.' },
        { status: 500 }
      );
    }

    const supabase = createServiceClient();
    const updateData: Record<string, any> = {};
    if (body.name_en !== undefined) updateData.name_en = body.name_en;
    if (body.name_ta !== undefined) updateData.name_ta = body.name_ta;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.mrp !== undefined) updateData.mrp = Number(body.mrp);
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.in_stock !== undefined) updateData.in_stock = body.in_stock;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
    if (body.stock_quantity !== undefined) {
      updateData.stock_quantity = Math.max(0, parseInt(body.stock_quantity, 10) || 0);
      updateData.in_stock = updateData.stock_quantity > 0;
    }

    // Recalculate discount
    if (body.mrp !== undefined || body.price !== undefined) {
      const mrp = Number(body.mrp) || updateData.mrp || 0;
      const price = Number(body.price) || updateData.price || 0;
      if (mrp > 0 && price < mrp) {
        updateData.discount_percent = Math.round(((mrp - price) / mrp) * 100);
        updateData.badge_text = `🔥 ${updateData.discount_percent}% OFF`;
      }
    }

    const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select().single();
    if (error) {
      console.error('Error updating product:', error);
      if (error.message.includes('row-level security')) {
        return NextResponse.json(
          { error: 'Product update blocked by database security policy. Verify SUPABASE_SERVICE_ROLE_KEY is correct.' },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      const { invalidateProductsCache } = await import('../route');
      invalidateProductsCache();
    } catch { /* cache invalidation is best-effort */ }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

// DELETE — Delete product (admin — uses service role key)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { id } = await params;

    // Local DB fallback
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!isServiceConfigured()) {
      if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
        const { getLocalProducts, saveLocalProducts } = await import('@/lib/local-db');
        const currentList = getLocalProducts();
        const newList = currentList.filter(p => String(p.id) !== String(id));
        saveLocalProducts(newList);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Supabase service role key is not configured correctly.' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      const { invalidateProductsCache } = await import('../route');
      invalidateProductsCache();
    } catch { /* cache invalidation is best-effort */ }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
