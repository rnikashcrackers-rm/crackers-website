import { createBrowserClient } from '@supabase/ssr';
import { createClient as createServerClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || supabaseUrl.includes('your_supabase')) return null;

  if (isBrowser) {
    if (!supabaseAnonKey) return null;
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Server-side: prefer service role key to bypass RLS for logging
    const key = supabaseServiceKey || supabaseAnonKey;
    if (!key) return null;
    return createServerClient(supabaseUrl, key);
  }
}

export async function logError(errorType: string, message: string, stack?: string, context?: any) {
  try {
    console.error(`[Tracking Error] ${errorType}: ${message}`, context);
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('error_logs').insert({
        error_type: errorType,
        message: message || 'Unknown error',
        stack: stack || null,
        context: context || null,
      });
      if (error) {
        console.error('Failed to insert error log:', error.message);
      }
    }
  } catch (err) {
    console.error('Failed to log error to database:', err);
  }
}

export async function trackEvent(eventName: string, category?: string, metadata?: any) {
  try {
    console.log(`[Analytics Event] ${eventName}`, { category, metadata });
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('analytics_events').insert({
        event_name: eventName,
        category: category || null,
        metadata: metadata || null,
      });
      if (error) {
        console.error('Failed to insert analytics event:', error.message);
      }
    }
  } catch (err) {
    console.error('Failed to track event to database:', err);
  }
}
