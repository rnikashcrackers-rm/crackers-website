import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { sendOrderStatusNotification } from '@/lib/order-notifications';
import { createServiceClient, isServiceConfigured, ServiceConfigError } from '@/lib/supabase/service';
import { VALID_ORDER_STATUSES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    if (!isServiceConfigured()) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();

    let orderData = data;
    if (error) {
      const fallback = await supabase.from('orders').select('*').eq('id', id).single();
      if (fallback.error) throw fallback.error;
      orderData = fallback.data;
    }

    if (orderData) {
      orderData = {
        ...orderData,
        customer_email: (orderData.customer_email && orderData.customer_email.trim()) ? orderData.customer_email.trim() : null,
      };
    }

    return NextResponse.json(orderData);
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
    
    if (!isServiceConfigured()) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const body = await req.json();

    const updateData: Record<string, any> = {};

    if (body.status) {
      const normalizedStatus = String(body.status).toLowerCase().trim();
      if (!VALID_ORDER_STATUSES.includes(normalizedStatus as any)) {
        return NextResponse.json(
          { error: `Invalid order status: ${body.status}. Allowed: ${VALID_ORDER_STATUSES.join(', ')}` },
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

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
    }

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
        // Don't fail the order update because of notification failure
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating order:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    
    if (!isServiceConfigured()) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json({ error: error.message || 'Failed to delete order' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to delete order' }, { status: 500 });
  }
}
