import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ error_logs: [], analytics_events: [] });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch error logs
    const { data: errorLogs, error: errError } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (errError) throw errError;

    // Fetch analytics events
    const { data: analyticsEvents, error: analError } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (analError) throw analError;

    return NextResponse.json({
      error_logs: errorLogs || [],
      analytics_events: analyticsEvents || []
    });
  } catch (error: any) {
    console.error('Error fetching admin tracking stats:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch tracking data' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || (type !== 'errors' && type !== 'analytics')) {
      return NextResponse.json({ error: 'Type must be errors or analytics' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const table = type === 'errors' ? 'error_logs' : 'analytics_events';

    if (id) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting tracking logs:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 });
  }
}
