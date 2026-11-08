import MessageActions from '@/components/admin/MessageActions';
import { getAdmin } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';
const LANG: Record<string, string> = { en: 'الإنجليزية', ar: 'العربية', id: 'الإندونيسية' };

export default async function Messages() {
  const admin = await getAdmin(); if (!admin.ok) return null;
  const { data } = await admin.db.from('messages').select('*').order('created_at', { ascending: false }).limit(200);
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold">الرسائل</h1>
        <p className="text-muted">رسائل نموذج التواصل في الموقع. لا تصلك على البريد تلقائيًا، فراجع هذه الصفحة من وقت لآخر.</p>
      </div>
      {!data?.length ? <p className="card-a p-8 text-center text-muted">لا توجد رسائل بعد.</p> : (
        <ul className="grid gap-3">
          {data.map(m => (
            <li key={m.id} className={`card-a grid gap-3 p-5 ${m.read ? 'opacity-75' : 'border-saffron'}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="flex items-center gap-2 font-bold">{!m.read && <span className="size-2 rounded-full bg-ruby" aria-label="جديدة" />}{m.name}</span>
                <span className="text-xs text-muted" dir="ltr">{new Date(m.created_at).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })}</span>
              </div>
              <span className="text-sm text-muted"><span dir="ltr">{m.email}</span> · كتب من الموقع {LANG[m.lang] ?? ''}</span>
              <p className="whitespace-pre-wrap leading-7" dir="auto">{m.message}</p>
              <MessageActions id={m.id} read={m.read} email={m.email} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
