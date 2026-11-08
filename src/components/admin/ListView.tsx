'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteItem, moveItem, toggleFlag } from '@/lib/admin/actions';

export interface Row { id: string; title: string; subtitle?: string; visible?: boolean; published?: boolean; featured?: boolean; group?: string; thumb?: string | null }

export default function ListView({ entityKey, rows, flags, canDelete, emptyText }: { entityKey: string; rows: Row[]; flags: string[]; canDelete: boolean; emptyText: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => start(async () => {
    setErr('');
    const r = await fn();
    if (!r.ok) setErr(r.error || 'حدث خطأ');
    router.refresh();
  });

  if (!rows.length) return <p className="card-a p-8 text-center text-muted">{emptyText}</p>;

  const grouped = new Map<string, Row[]>();
  rows.forEach(r => { const g = r.group ?? ''; if (!grouped.has(g)) grouped.set(g, []); grouped.get(g)!.push(r); });

  return (
    <div className={`grid gap-6 ${pending ? 'opacity-70' : ''}`} aria-busy={pending}>
      {err && <p role="alert" className="rounded-xl border border-ruby/30 bg-ruby/10 px-4 py-3 text-ruby">{err}</p>}
      {[...grouped.entries()].map(([g, list]) => (
        <section key={g} className="grid gap-2">
          {g && <h2 className="text-sm font-bold text-muted">{g}</h2>}
          <ul className="card-a divide-y divide-sand-200 overflow-hidden">
            {list.map((r, i) => (
              <li key={r.id} className={`flex flex-wrap items-center gap-3 px-4 py-3 ${r.visible === false ? 'bg-sand-50' : ''}`}>
                <div className="flex flex-col">
                  <button type="button" className="px-2 leading-none text-muted hover:text-ink disabled:opacity-30" disabled={i === 0 || pending} onClick={() => run(() => moveItem(entityKey, r.id, -1))} aria-label="تحريك للأعلى">▲</button>
                  <button type="button" className="px-2 leading-none text-muted hover:text-ink disabled:opacity-30" disabled={i === list.length - 1 || pending} onClick={() => run(() => moveItem(entityKey, r.id, 1))} aria-label="تحريك للأسفل">▼</button>
                </div>
                {r.thumb !== undefined && (
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-sand-300 bg-sand-50">
                    {r.thumb ? <img src={r.thumb} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-muted">—</span>}
                  </div>
                )}
                <Link href={`/admin/${entityKey}/${encodeURIComponent(r.id)}`} className="min-w-0 flex-1 no-underline">
                  <span className={`block font-semibold ${r.visible === false ? 'text-muted line-through' : 'text-ink'}`}>{r.title || '(بدون عنوان)'}</span>
                  {r.subtitle && <span className="block truncate text-sm text-muted">{r.subtitle}</span>}
                </Link>
                <div className="flex flex-wrap items-center gap-1.5">
                  {flags.includes('published') && r.published === false && <span className="rounded-full bg-saffron/30 px-2 py-0.5 text-xs font-semibold text-saffron-dark">مسودة</span>}
                  {flags.includes('featured') && (
                    <button type="button" className={`rounded-full px-2 py-1 text-sm ${r.featured ? 'text-saffron-dark' : 'text-sand-300 hover:text-muted'}`} onClick={() => run(() => toggleFlag(entityKey, r.id, 'featured'))} aria-pressed={!!r.featured} title="مميّز">★</button>
                  )}
                  {flags.includes('visible') && (
                    <button type="button" className="btn-a !px-3 !py-1 text-xs" onClick={() => run(() => toggleFlag(entityKey, r.id, 'visible'))}>{r.visible === false ? 'إظهار' : 'إخفاء'}</button>
                  )}
                  {flags.includes('published') && (
                    <button type="button" className="btn-a !px-3 !py-1 text-xs" onClick={() => run(() => toggleFlag(entityKey, r.id, 'published'))}>{r.published === false ? 'نشر' : 'إرجاع لمسودة'}</button>
                  )}
                  <Link href={`/admin/${entityKey}/${encodeURIComponent(r.id)}`} className="btn-a !px-3 !py-1 text-xs">تعديل</Link>
                  {canDelete && (confirm === r.id
                    ? <button type="button" className="btn-a danger !px-3 !py-1 text-xs" onClick={() => { setConfirm(null); run(() => deleteItem(entityKey, r.id)); }}>تأكيد الحذف</button>
                    : <button type="button" className="btn-a !px-3 !py-1 text-xs" onClick={() => setConfirm(r.id)}>حذف</button>)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
