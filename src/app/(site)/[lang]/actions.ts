'use server';
import { publicClient } from '@/lib/supabase/public';

export interface SendState { status: 'idle' | 'ok' | 'missing' | 'error' }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Stores a contact-form message in Supabase. The dashboard shows it under Messages. */
export async function sendMessage(_prev: SendState, form: FormData): Promise<SendState> {
  const name = String(form.get('name') || '').trim().slice(0, 120);
  const email = String(form.get('email') || '').trim().slice(0, 200);
  const message = String(form.get('message') || '').trim().slice(0, 4000);
  const lang = String(form.get('lang') || 'en').slice(0, 2);
  // Spam traps: a hidden field people never fill, and a minimum time on the page.
  if (String(form.get('company') || '')) return { status: 'ok' };
  const started = Number(form.get('ts') || 0);
  if (started && Date.now() - started < 2500) return { status: 'ok' };
  if (!name || !EMAIL.test(email) || message.length < 2) return { status: 'missing' };
  const db = publicClient();
  if (!db) return { status: 'error' };
  const { error } = await db.from('messages').insert({ name, email, message, lang });
  return { status: error ? 'error' : 'ok' };
}
