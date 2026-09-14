import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceClient, isServiceConfigured, ServiceConfigError } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

// GET — List sliders (public — uses anon key)
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json([]);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('sliders')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error getting sliders:', error);
    return NextResponse.json([]);
  }
}

// POST — Add new slider (admin — uses service role key)
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    if (!isServiceConfigured()) {
      return NextResponse.json({ error: 'Supabase service role key is not configured correctly.' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from('sliders')
      .insert({
        image_url: body.image_url,
        link_url: body.link_url || null,
        title: body.title || null,
        sort_order: body.sort_order || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating slider:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create slider' }, { status: 500 });
  }
}

// PUT — Update slider (admin — uses service role key)
export async function PUT(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    if (!isServiceConfigured()) {
      return NextResponse.json({ error: 'Supabase service role key is not configured correctly.' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing slider ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sliders')
      .update({
        image_url: updateData.image_url,
        link_url: updateData.link_url || null,
        title: updateData.title || null,
        sort_order: updateData.sort_order || 0,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating slider:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update slider' }, { status: 500 });
  }
}

// DELETE — Delete slider (admin — uses service role key)
export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    if (!isServiceConfigured()) {
      return NextResponse.json({ error: 'Supabase service role key is not configured correctly.' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing slider ID' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from('sliders').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting slider:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to delete slider' }, { status: 500 });
  }
}
