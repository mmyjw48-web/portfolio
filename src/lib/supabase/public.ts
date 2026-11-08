import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabase } from './env';

let client: SupabaseClient | null = null;

/** Read-only client for the public site. No cookies, so pages stay cacheable. */
export function publicClient(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
