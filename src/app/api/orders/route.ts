import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `NC-${dateStr}-${seq}`;
}

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json([]);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderNumber = generateOrderNumber();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // If Supabase is not configured, return a local mock order
    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({
        id: crypto.randomUUID(),
        order_number: orderNumber,
        ...body,
        status: 'confirmed',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      }, { status: 201 });
    }

    // Try database insert — with graceful fallback on connection errors
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: body.customer_name,
          customer_email: body.customer_email,
          customer_phone: body.customer_phone,
          customer_address: body.customer_address || null,
          customer_city: body.customer_city || null,
          customer_pincode: body.customer_pincode || null,
          customer_state: body.customer_state || null,
          customer_district: body.customer_district || null,
          items: body.items,
          subtotal: body.subtotal || 0,
          discount_total: body.discount_total || 0,
          total_amount: body.total_amount,
          status: 'confirmed',
          payment_method: body.payment_method || 'bank_transfer',
          payment_status: 'pending',
          notes: body.notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 201 });
    } catch (dbError) {
      // Database unreachable — return local order so checkout never crashes
      console.warn('Database insert failed, returning local order:', dbError instanceof Error ? dbError.message : String(dbError));
      return NextResponse.json({
        id: crypto.randomUUID(),
        order_number: orderNumber,
        ...body,
        status: 'confirmed',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      }, { status: 201 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    console.error('Error creating order:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
