import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enquiries:', error);
      return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in enquiries API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('enquiries')
      // @ts-expect-error - Type definition for enquiries is incomplete
      .insert({
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_city: body.customer_city,
        items: body.items,
        total_amount: body.total_amount,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating enquiry:', error);
      return NextResponse.json({ error: 'Failed to create enquiry' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in enquiries API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
