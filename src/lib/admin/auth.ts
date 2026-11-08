import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { serverClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/env';

export type AdminCheck =
  | { ok: true; db: SupabaseClient; user: User }
  | { ok: false; db: SupabaseClient | null; user: User | null; reason: 'not-configured' | 'signed-out' | 'not-admin' };

/** Who is using the dashboard. Row Level Security in the database enforces the same rule on every write. */
export async function getAdmin(): Promise<AdminCheck> {
  if (!hasSupabase()) return { ok: false, db: null, user: null, reason: 'not-configured' };
  const db = await serverClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { ok: false, db, user: null, reason: 'signed-out' };
  const { data: isAdmin } = await db.rpc('is_admin');
  if (!isAdmin) return { ok: false, db, user, reason: 'not-admin' };
  return { ok: true, db, user };
}
