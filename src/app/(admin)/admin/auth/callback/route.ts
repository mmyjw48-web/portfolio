import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';

/** Supabase sends password-reset and invite links here. We exchange the one-time code for a session. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/admin';
  if (code) {
    const db = await serverClient();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next.startsWith('/admin') ? next : '/admin', url.origin));
  }
  return NextResponse.redirect(new URL('/admin/login', url.origin));
}
