'use client';
import { useState } from 'react';
import { browserClient } from '@/lib/supabase/browser';

export default function ResetPassword() {
  const [pw, setPw] = useState(''), [pw2, setPw2] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 10) return setMsg({ ok: false, text: 'استخدم 10 أحرف على الأقل.' });
    if (pw !== pw2) return setMsg({ ok: false, text: 'كلمتا المرور غير متطابقتين.' });
    setBusy(true);
    const { error } = await browserClient().auth.updateUser({ password: pw });
    setBusy(false);
    setMsg(error ? { ok: false, text: 'انتهت صلاحية الرابط. اطلب رابطًا جديدًا من صفحة الدخول.' } : { ok: true, text: 'تم تغيير كلمة المرور.' });
  };
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={save} className="card-a grid w-full max-w-sm gap-4 p-8">
        <h1 className="text-xl font-bold">كلمة مرور جديدة</h1>
        <label className="grid gap-1.5"><span className="font-semibold">كلمة المرور</span><input className="field" type="password" dir="ltr" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} /></label>
        <label className="grid gap-1.5"><span className="font-semibold">أعد كتابتها</span><input className="field" type="password" dir="ltr" autoComplete="new-password" value={pw2} onChange={e => setPw2(e.target.value)} /></label>
        {msg && <p className={`text-sm ${msg.ok ? 'text-emerald' : 'text-ruby'}`}>{msg.text}</p>}
        <button className="btn-a primary" disabled={busy}>{busy ? 'جارٍ الحفظ…' : 'حفظ'}</button>
        {msg?.ok && <a className="btn-a" href="/admin">الذهاب إلى لوحة التحكم</a>}
      </form>
    </main>
  );
}
