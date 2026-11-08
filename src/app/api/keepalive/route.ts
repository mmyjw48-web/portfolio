import { NextResponse } from 'next/server';
import { publicClient } from '@/lib/supabase/public';

export const dynamic = 'force-dynamic';

/** Called once a day by Vercel Cron so the free Supabase project never pauses for inactivity. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  const db = publicClient();
  if (!db) return NextResponse.json({ ok: false, reason: 'not configured' });
  const { error } = await db.from('sections').select('key').limit(1);
  return NextResponse.json({ ok: !error, at: new Date().toISOString() });
}
