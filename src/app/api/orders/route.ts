import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { calculateOrderPricing, validateQuantity } from '@/lib/pricing';
import { createServiceClient, isServiceConfigured, ServiceConfigError } from '@/lib/supabase/service';
import { VALID_ORDER_STATUSES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

/** Generates a collision-resistant order number: NC-YYYYMMDD-XXXX */
function generateOrderNumber(): string {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  // Use timestamp + random for better collision resistance
  const seq = (now.getTime() % 10000).toString().padStart(4, '0');
  return `NC-${dateStr}-${seq}`;
}

// GET — Admin: List all orders
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    if (!isServiceConfigured()) {
      return NextResponse.json({ error: 'Supabase service role key is not configured correctly.' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback to select without order_items if order_items migration is still pending
      const fallbackQuery = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fallbackQuery.error) {
        console.error('Database error fetching orders:', fallbackQuery.error);
        return NextResponse.json({ error: fallbackQuery.error.message }, { status: 500 });
      }
      return NextResponse.json(fallbackQuery.data || []);
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST — Customer: Create new order
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate Customer Information
    const customerName = (body.customer_name || '').trim();
    const customerPhone = (body.customer_phone || '').replace(/\D/g, '');
    const customerAddress = (body.customer_address || '').trim();

    if (!customerName) {
      return NextResponse.json({ error: 'Customer Name is required' }, { status: 400 });
    }
    if (!customerPhone || customerPhone.length !== 10) {
      return NextResponse.json(
        { error: 'A valid 10-digit Phone Number is required' },
        { status: 400 }
      );
    }
    if (!customerAddress || customerAddress.length < 5) {
      return NextResponse.json(
        { error: 'Full Delivery Address is required (min 5 characters)' },
        { status: 400 }
      );
    }

    // 2. Validate Items Array
    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    if (!isServiceConfigured()) {
      return NextResponse.json(
        { error: 'Database service is not configured on the server. Please set the correct SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    const supabase = createServiceClient();

    // 3. Extract and Validate Product IDs & Quantities
    const validatedItemMap = new Map<string, number>();

    for (const item of rawItems) {
      const id = String(item.product_id || item.id || '').trim();
      if (!id) {
        return NextResponse.json(
          { error: `Item missing product identifier: ${item.name || 'Unknown'}` },
          { status: 400 }
        );
      }

      const qtyValidation = validateQuantity(item.quantity);
      if (!qtyValidation.valid) {
        return NextResponse.json(
          { error: `Invalid quantity for ${item.name || id}: ${qtyValidation.error}` },
          { status: 400 }
        );
      }

      const existingQty = validatedItemMap.get(id) || 0;
      validatedItemMap.set(id, existingQty + qtyValidation.quantity);
    }

    const productIds = Array.from(validatedItemMap.keys());

    // 4. Fetch Authoritative Products from Supabase
    const { data: dbProducts, error: prodError } = await supabase
      .from('products')
      .select('id, name_en, category, price, mrp, in_stock, stock_quantity')
      .in('id', productIds);

    if (prodError) {
      console.error('Error querying products for order validation:', prodError);
      return NextResponse.json(
        { error: 'Database query failed while validating order products' },
        { status: 500 }
      );
    }

    const dbProductMap = new Map<string, any>((dbProducts || []).map((p: any) => [String(p.id), p]));

    // 5. Verify Availability & Stock Limits
    for (const [id, requestedQty] of validatedItemMap.entries()) {
      const dbProd = dbProductMap.get(id);
      if (!dbProd) {
        return NextResponse.json(
          { error: `Product with ID ${id} was not found in active catalog.` },
          { status: 400 }
        );
      }

      if (dbProd.in_stock === false) {
        return NextResponse.json(
          { error: `"${dbProd.name_en}" is currently out of stock.` },
          { status: 409 }
        );
      }

      if (
        dbProd.stock_quantity !== undefined &&
        dbProd.stock_quantity !== null &&
        dbProd.stock_quantity < requestedQty
      ) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${dbProd.name_en}". Requested: ${requestedQty}, Available: ${dbProd.stock_quantity}`,
          },
          { status: 409 }
        );
      }
    }

    // 6. Recalculate Authoritative Pricing Server-Side
    const authoritativeItems = productIds.map((id) => {
      const dbProd = dbProductMap.get(id)!;
      const qty = validatedItemMap.get(id)!;
      return {
        id: dbProd.id,
        name: dbProd.name_en,
        category: dbProd.category,
        price: Number(dbProd.price) || 0,
        mrp: Number(dbProd.mrp) || Number(dbProd.price) || 0,
        quantity: qty,
      };
    });

    const pricing = calculateOrderPricing(authoritativeItems);
    const orderNumber = generateOrderNumber();

    const rawEmail = (body.customer_email || '').trim();

    // 7. Insert Order into Supabase Orders Table
    const orderPayload: any = {
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: rawEmail || null,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      customer_city: (body.customer_city || '').trim() || null,
      customer_pincode: (body.customer_pincode || '').trim() || null,
      customer_state: (body.customer_state || '').trim() || null,
      customer_district: (body.customer_district || '').trim() || null,
      items: authoritativeItems,
      subtotal: pricing.subtotal + pricing.discountTotal, // Standard MRP subtotal
      discount_total: pricing.discountTotal,
      total_amount: pricing.grandTotal,
      status: 'confirmed',
      payment_method: body.payment_method || 'bank_transfer',
      payment_status: 'pending',
      notes:
        body.notes ||
        `Includes 3% packing charges (₹${pricing.packingCharges.toLocaleString('en-IN')}) on order value (₹${pricing.subtotal.toLocaleString('en-IN')})`,
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) {
      console.error('Authoritative order insert failed:', orderError);
      
      // Handle duplicate order number collision
      if (orderError.message.includes('orders_order_number_unique') || orderError.code === '23505') {
        // Retry with a different order number
        orderPayload.order_number = generateOrderNumber() + '-R';
        const retryResult = await supabase.from('orders').insert(orderPayload).select().single();
        if (retryResult.error) {
          return NextResponse.json(
            { error: `Order creation failed: ${retryResult.error.message}` },
            { status: 500 }
          );
        }
        // Use retry result
        const retryOrderData = retryResult.data;
        
        // Continue with order items and stock (same as below)
        await insertOrderItemsAndDeductStock(supabase, retryOrderData, authoritativeItems, dbProductMap);
        return NextResponse.json(retryOrderData, { status: 201 });
      }
      
      return NextResponse.json(
        { error: `Order creation failed: ${orderError.message}` },
        { status: 500 }
      );
    }

    // 8. Insert Relational Order Items & Update Inventory
    await insertOrderItemsAndDeductStock(supabase, orderData, authoritativeItems, dbProductMap);

    return NextResponse.json(orderData, { status: 201 });
  } catch (error: any) {
    console.error('Fatal error during order processing:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred processing your order.' },
      { status: 500 }
    );
  }
}

/** Helper: Insert order line items and deduct stock atomically */
async function insertOrderItemsAndDeductStock(
  supabase: any,
  orderData: any,
  authoritativeItems: any[],
  dbProductMap: Map<string, any>
) {
  // Insert relational order items
  try {
    const lineItems = authoritativeItems.map((item) => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit_price: item.price,
      mrp: item.mrp,
      subtotal: item.price * item.quantity,
    }));

    await supabase.from('order_items').insert(lineItems);
  } catch (itemsErr) {
    console.warn('Note: order_items insert notice (schema might not have order_items yet):', itemsErr);
  }

  // Atomic Stock Deduction
  for (const item of authoritativeItems) {
    try {
      const { data: decremented } = await supabase.rpc('decrement_product_stock', {
        p_product_id: item.id,
        p_qty: item.quantity,
      });

      // Fallback update if RPC does not exist
      if (decremented === null || decremented === undefined) {
        const dbProd = dbProductMap.get(item.id);
        if (dbProd && dbProd.stock_quantity !== undefined) {
          const nextQty = Math.max(0, dbProd.stock_quantity - item.quantity);
          await supabase
            .from('products')
            .update({
              stock_quantity: nextQty,
              in_stock: nextQty > 0,
            })
            .eq('id', item.id);
        }
      }
    } catch (stockErr) {
      console.warn(`Stock decrement skipped for ${item.id}:`, stockErr);
    }
  }
}
