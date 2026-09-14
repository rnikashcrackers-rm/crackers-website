import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceClient, isServiceConfigured, ServiceConfigError } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { id: 'single-sound', label: 'Single Sound', emoji: '💥', sort_order: 0 },
  { id: 'sparklers', label: 'Sparklers', emoji: '✨', sort_order: 1 },
  { id: 'chakkars', label: 'Chakkars', emoji: '🌀', sort_order: 2 },
  { id: 'flowerpots', label: 'Flower Pots', emoji: '🌸', sort_order: 3 },
  { id: 'rockets', label: 'Rockets', emoji: '🚀', sort_order: 4 },
  { id: 'bombs', label: 'Bombs', emoji: '💣', sort_order: 5 },
  { id: 'bijili', label: 'Bijili', emoji: '⚡', sort_order: 6 },
  { id: 'chain', label: 'Chain Crackers', emoji: '🔗', sort_order: 7 },
  { id: 'fountains', label: 'Fountains', emoji: '⛲', sort_order: 8 },
  { id: 'novelties', label: 'Novelties', emoji: '🎭', sort_order: 9 },
  { id: 'multishots', label: 'Multi Shots', emoji: '🎇', sort_order: 10 },
  { id: 'giftbox', label: 'Gift Boxes', emoji: '🎁', sort_order: 11 },
];

// GET — List categories (public — uses anon key)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json(DEFAULT_CATEGORIES);
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const fetchWithTimeout = async () => {
        const { data, error } = await supabase
          .from('categories')
          .select('id,label,emoji,sort_order')
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data || [];
      };

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Categories fetch timeout')), 1500)
      );

      const data = await Promise.race([fetchWithTimeout(), timeout]);

      const responseHeaders: Record<string, string> = {};
      if (isAdmin) {
        responseHeaders['Cache-Control'] = 'no-store, max-age=0, must-revalidate';
      } else {
        responseHeaders['Cache-Control'] = 'public, s-maxage=30, stale-while-revalidate=300';
      }

      return NextResponse.json(data && data.length > 0 ? data : DEFAULT_CATEGORIES, {
        headers: responseHeaders
      });
    } catch (dbErr) {
      console.warn('Supabase categories fetch failed/timed out. Returning fallback:', dbErr instanceof Error ? dbErr.message : String(dbErr));
      return NextResponse.json(DEFAULT_CATEGORIES);
    }
  } catch (error: any) {
    console.error('Error getting categories:', error);
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}

// POST — Add new category (admin — uses service role key)
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    if (!isServiceConfigured()) {
      return NextResponse.json(
        { error: 'Supabase service role key is not configured correctly. Please set the correct SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    const supabase = createServiceClient();
    const body = await req.json();

    const id = body.id || body.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase
      .from('categories')
      .insert({
        id,
        label: body.label,
        emoji: body.emoji || '🎆',
        sort_order: body.sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}

// PUT — Update category (admin — uses service role key)
export async function PUT(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    if (!isServiceConfigured()) {
      return NextResponse.json(
        { error: 'Supabase service role key is not configured correctly. Please set the correct SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    const supabase = createServiceClient();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        label: updateData.label,
        emoji: updateData.emoji,
        sort_order: updateData.sort_order,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

// DELETE — Delete category (admin — uses service role key)
export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    if (!isServiceConfigured()) {
      return NextResponse.json(
        { error: 'Supabase service role key is not configured correctly. Please set the correct SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
