import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { sendOrderStatusNotification } from '@/lib/order-notifications';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '';

    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();

    if (error) {
      const fallback = await supabase.from('orders').select('*').eq('id', id).single();
      if (fallback.error) throw fallback.error;
      return NextResponse.json(fallback.data);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '';

    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    const updateData: Record<string, any> = {};

    if (body.status) {
      const normalizedStatus = String(body.status).toLowerCase().trim();
      if (!VALID_STATUSES.includes(normalizedStatus)) {
        return NextResponse.json(
          { error: `Invalid order status: ${body.status}. Allowed: ${VALID_STATUSES.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.status = normalizedStatus;
      if (normalizedStatus === 'confirmed') updateData.confirmed_at = new Date().toISOString();
      if (normalizedStatus === 'shipped') updateData.shipped_at = new Date().toISOString();
      if (normalizedStatus === 'delivered') updateData.delivered_at = new Date().toISOString();
    }

    if (body.payment_status) {
      updateData.payment_status = String(body.payment_status).toLowerCase().trim();
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Automatically send status notification to both WhatsApp and Email
    if (body.status) {
      try {
        await sendOrderStatusNotification({
          order: data,
          status: updateData.status,
          trackingInfo: body.trackingInfo || undefined,
          sendWhatsApp: true,
          sendEmail: true,
        });
      } catch (notifyError) {
        console.error('Error sending automatic order status notification:', notifyError);
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '';

    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete order' }, { status: 500 });
  }
}
