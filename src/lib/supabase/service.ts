import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

/**
 * Creates a Supabase client using the SERVICE ROLE key.
 * This client bypasses Row Level Security (RLS) and should ONLY be used
 * in server-side API routes that require admin-level database access.
 *
 * NEVER import this on the client side or in any file that could be bundled
 * for the browser. The service role key must remain server-only.
 *
 * Validates at runtime that the service key is not the same as the anon key
 * (a common misconfiguration that causes all admin writes to fail with RLS errors).
 */
function resolveServiceRoleKey(): string {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const candidates = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SERVICEKEY,
    process.env.SUPABASE_SERVICE_KEY,
  ].filter(Boolean) as string[];

  // Prefer a key that is NOT identical to the anon key
  const distinctKey = candidates.find(k => k !== anonKey);
  return distinctKey || candidates[0] || '';
}

export function createServiceClient(): SupabaseClient<any> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = resolveServiceRoleKey();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl) {
    throw new ServiceConfigError(
      'NEXT_PUBLIC_SUPABASE_URL is not configured. Set it in your .env.local or Vercel environment variables.'
    );
  }

  if (!serviceRoleKey) {
    throw new ServiceConfigError(
      'SUPABASE_SERVICE_ROLE_KEY (or SERVICEKEY) is not configured. Get it from your Supabase Dashboard → Settings → API → service_role key.'
    );
  }

  // Critical validation: detect misconfigured service key
  if (serviceRoleKey === anonKey) {
    console.error(
      '⚠️  CRITICAL: Service role key is identical to NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'This means all admin write operations will fail with RLS policy violations. ' +
      'Please set the correct service_role secret from Supabase Dashboard → Settings → API.'
    );
    throw new ServiceConfigError(
      'SUPABASE_SERVICE_ROLE_KEY is misconfigured (it matches the anon key). ' +
      'Admin operations require the actual service_role key from your Supabase dashboard.'
    );
  }

  return createSupabaseClient<any>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Checks if Supabase is properly configured for admin operations.
 * Returns true if configuration looks valid, false otherwise.
 * Does NOT throw — use this for graceful fallback paths.
 */
export function isServiceConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = resolveServiceRoleKey();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || supabaseUrl.includes('your_supabase')) return false;
  if (!serviceRoleKey) return false;
  if (serviceRoleKey === anonKey) return false;

  return true;
}

/**
 * Creates an anon-level Supabase client for public/read operations.
 * Uses the anon key which is subject to RLS policies.
 */
export function createAnonClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !anonKey) {
    throw new ServiceConfigError('Supabase URL or anon key is not configured.');
  }

  return createSupabaseClient<Database>(supabaseUrl, anonKey);
}

/**
 * Custom error class for service configuration issues.
 * Distinguishes config problems from runtime database errors.
 */
export class ServiceConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceConfigError';
  }
}
