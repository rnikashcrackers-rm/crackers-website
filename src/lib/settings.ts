import { createClient } from '@supabase/supabase-js';
import { DEFAULT_SETTINGS } from './constants';

export async function getSiteSettings() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
    try {
      const { getLocalSettings } = await import('./local-db');
      return getLocalSettings(DEFAULT_SETTINGS);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  try {
    const fetchWithTimeout = async () => {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error) throw error;
      return data;
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Settings fetch timeout')), 1500)
    );

    const data = await Promise.race([fetchWithTimeout(), timeout]);

    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    if (data && Array.isArray(data)) {
      data.forEach((row: { key: string; value: string }) => {
        settings[row.key] = row.value;
      });
    }
    return settings;
  } catch {
    // Silently return local settings or default settings on timeout/error
    try {
      const { getLocalSettings } = await import('./local-db');
      return getLocalSettings(DEFAULT_SETTINGS);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
}
