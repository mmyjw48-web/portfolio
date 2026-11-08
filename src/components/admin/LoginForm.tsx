'use client';
import { useActionState, useState } from 'react';
import { requestReset, signIn, type AuthState } from '@/lib/admin/actions';

export default function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [s1, login, p1] = useActionState<AuthState, FormData>(signIn, {});
  const [s2, reset, p2] = useActionState<AuthState, FormData>(requestReset, {});
  if (mode === 'reset') {
    return (
      <form action={reset} className="grid gap-4">
        <p className="text-sm text-muted">اكتب بريدك وسنرسل لك رابطًا لتعيين كلمة مرور جديدة.</p>
        <label className="grid gap-1.5"><span className="font-semibold">البريد الإلكتروني</span><input className="field" name="email" type="email" dir="ltr" autoComplete="email" required /></label>
        {s2.error && <p className="text-sm text-ruby">{s2.error}</p>}
        {s2.info && <p className="text-sm text-emerald">{s2.info}</p>}
        <button className="btn-a primary" disabled={p2}>{p2 ? 'جارٍ الإرسال…' : 'أرسل الرابط'}</button>
        <button type="button" className="text-sm text-muted" onClick={() => setMode('login')}>رجوع لتسجيل الدخول</button>
      </form>
    );
  }
  return (
    <form action={login} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="grid gap-1.5"><span className="font-semibold">البريد الإلكتروني</span><input className="field" name="email" type="email" dir="ltr" autoComplete="username" required /></label>
      <label className="grid gap-1.5"><span className="font-semibold">كلمة المرور</span><input className="field" name="password" type="password" dir="ltr" autoComplete="current-password" required /></label>
      {s1.error && <p role="alert" className="text-sm text-ruby">{s1.error}</p>}
      <button className="btn-a primary" disabled={p1}>{p1 ? 'جارٍ الدخول…' : 'تسجيل الدخول'}</button>
      <button type="button" className="text-sm text-muted" onClick={() => setMode('reset')}>نسيت كلمة المرور؟</button>
    </form>
  );
}
