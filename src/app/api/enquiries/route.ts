import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceClient, isServiceConfigured, ServiceConfigError } from '@/lib/supabase/service';

// GET — Admin: List all enquiries (uses service role to bypass RLS)
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    if (!isServiceConfigured()) {
      return NextResponse.json({ error: 'Supabase service role key is not configured correctly.' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enquiries:', error);
      return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error in enquiries API:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — Customer: Create new enquiry (uses anon key — allowed by RLS INSERT policy)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('enquiries')
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
