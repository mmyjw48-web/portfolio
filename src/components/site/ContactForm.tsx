'use client';
import { useActionState, useEffect, useState } from 'react';
import { sendMessage, type SendState } from '@/app/(site)/[lang]/actions';

interface L { name: string; email: string; msg: string; send: string; sending: string; ok: string; missing: string; error: string }

export default function ContactForm({ lang, l }: { lang: string; l: L }) {
  const [state, action, pending] = useActionState<SendState, FormData>(sendMessage, { status: 'idle' });
  const [ts, setTs] = useState('');
  useEffect(() => { setTs(String(Date.now())); }, []);
  const note = state.status === 'ok' ? l.ok : state.status === 'missing' ? l.missing : state.status === 'error' ? l.error : '';
  return (
    <form className="form" action={action} data-reveal="1">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="ts" value={ts} />
      <label className="hp" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <label htmlFor="f-name">{l.name}<input id="f-name" name="name" autoComplete="name" required maxLength={120} /></label>
      <label htmlFor="f-email">{l.email}<input id="f-email" name="email" type="email" autoComplete="email" required maxLength={200} dir="ltr" /></label>
      <label htmlFor="f-msg">{l.msg}<textarea id="f-msg" name="message" required maxLength={4000} /></label>
      <div><button className="btn primary" type="submit" disabled={pending}>{pending ? l.sending : l.send}</button></div>
      <p className={`note${state.status === 'missing' || state.status === 'error' ? ' err' : ''}`} role="status">{note}</p>
    </form>
  );
}
