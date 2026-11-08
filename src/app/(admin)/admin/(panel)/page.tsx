import Link from 'next/link';
import { getAdmin } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

const TILES = [
  { key: 'projects', label: 'المشاريع', add: 'مشروع جديد' },
  { key: 'experiences', label: 'الخبرات', add: 'خبرة جديدة' },
  { key: 'activities', label: 'القيادة والأنشطة', add: 'نشاط جديد' },
  { key: 'achievements', label: 'الإنجازات والشهادات', add: 'إنجاز جديد' },
  { key: 'skills', label: 'المهارات', add: 'مهارة جديدة' },
  { key: 'education', label: 'التعليم', add: 'مؤهل جديد' }
];

export default async function Dashboard() {
  const admin = await getAdmin(); if (!admin.ok) return null;
  const db = admin.db;
  const counts = await Promise.all(TILES.map(t => db.from(t.key).select('*', { count: 'exact', head: true })));
  const drafts = await Promise.all(['projects', 'experiences', 'activities', 'achievements', 'education'].map(k => db.from(k).select('*', { count: 'exact', head: true }).eq('published', false)));
  const draftCount = drafts.reduce((n, r) => n + (r.count ?? 0), 0);
  const { data: messages } = await db.from('messages').select('id, name, message, created_at, read').order('created_at', { ascending: false }).limit(4);
  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold">أهلًا محمد 👋</h1>
        <p className="text-muted">كل ما تحفظه هنا يظهر في الموقع خلال ثوانٍ. لا حاجة لتعديل الكود أو إعادة النشر.</p>
      </div>
      {draftCount > 0 && (
        <div className="rounded-xl border border-saffron/50 bg-saffron/15 px-4 py-3">
          لديك <b>{draftCount}</b> عنصر في وضع المسودة. لن تظهر للزوار حتى تنشرها.{' '}
          <a href="/ar/preview" target="_blank" rel="noreferrer" className="font-semibold text-saffron-dark">عاين الموقع مع المسودات ↗</a>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t, i) => (
          <div key={t.key} className="card-a grid gap-3 p-5">
            <div className="flex items-baseline justify-between">
              <Link href={`/admin/${t.key}`} className="text-lg font-bold text-ink no-underline">{t.label}</Link>
              <span className="text-2xl font-bold text-muted">{counts[i].count ?? 0}</span>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/${t.key}`} className="btn-a !py-1.5 text-sm">عرض الكل</Link>
              <Link href={`/admin/${t.key}/new`} className="btn-a primary !py-1.5 text-sm">+ {t.add}</Link>
            </div>
          </div>
        ))}
      </div>
      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">آخر الرسائل</h2>
          <Link href="/admin/messages" className="text-sm font-semibold text-saffron-dark no-underline">كل الرسائل ←</Link>
        </div>
        {messages?.length ? (
          <ul className="card-a divide-y divide-sand-200">
            {messages.map(m => (
              <li key={m.id} className="grid gap-1 px-4 py-3">
                <span className="flex items-center gap-2 font-semibold">{!m.read && <span className="size-2 rounded-full bg-ruby" aria-label="غير مقروءة" />}{m.name}</span>
                <span className="line-clamp-2 text-sm text-muted">{m.message}</span>
              </li>
            ))}
          </ul>
        ) : <p className="card-a p-6 text-center text-muted">لا توجد رسائل بعد. رسائل نموذج التواصل في الموقع تصل إلى هنا.</p>}
      </section>
      <section className="card-a grid gap-2 p-5 text-sm leading-7">
        <h2 className="text-base font-bold">روابط سريعة</h2>
        <div className="flex flex-wrap gap-2">
          <a className="btn-a" href="/en" target="_blank" rel="noreferrer">الموقع بالإنجليزية ↗</a>
          <a className="btn-a" href="/ar" target="_blank" rel="noreferrer">بالعربية ↗</a>
          <a className="btn-a" href="/id" target="_blank" rel="noreferrer">بالإندونيسية ↗</a>
        </div>
      </section>
    </div>
  );
}
