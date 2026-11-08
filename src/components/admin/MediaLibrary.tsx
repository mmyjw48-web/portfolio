'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { browserClient } from '@/lib/supabase/browser';
import { uploadToMedia } from './ImageField';

const FOLDERS: { key: string; label: string }[] = [
  { key: 'projects', label: 'المشاريع' }, { key: 'certificates', label: 'الشهادات' }, { key: 'activities', label: 'الأنشطة' },
  { key: 'profile', label: 'الصور الشخصية' }, { key: 'cv', label: 'السيرة الذاتية' }, { key: 'misc', label: 'متفرقات' }
];
interface Item { name: string; path: string; url: string; size: number; created: string }

export default function MediaLibrary() {
  const [folder, setFolder] = useState('projects');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true); setMsg('');
    const db = browserClient();
    const { data, error } = await db.storage.from('media').list(folder, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) setMsg(error.message);
    setItems((data ?? []).filter(f => f.id).map(f => {
      const path = `${folder}/${f.name}`;
      return { name: f.name, path, url: db.storage.from('media').getPublicUrl(path).data.publicUrl, size: (f.metadata?.size as number) ?? 0, created: f.created_at ?? '' };
    }));
    setLoading(false);
  }, [folder]);
  useEffect(() => { load(); }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true); setMsg('');
    try { for (const f of Array.from(files)) await uploadToMedia(f, folder); await load(); setMsg('تم الرفع.'); }
    catch (e) { setMsg(e instanceof Error ? e.message : 'تعذّر الرفع'); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };
  const remove = async (path: string) => {
    const { error } = await browserClient().storage.from('media').remove([path]);
    setMsg(error ? error.message : 'تم الحذف. تأكد أن الصورة لم تعد مستخدمة في أي صفحة.');
    setConfirm(null); load();
  };
  const copy = async (url: string) => { try { await navigator.clipboard.writeText(url); setMsg('تم نسخ الرابط.'); } catch { setMsg(url); } };

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {FOLDERS.map(f => <button key={f.key} type="button" onClick={() => setFolder(f.key)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${folder === f.key ? 'bg-ink text-sand-100' : 'bg-white'}`}>{f.label}</button>)}
        <button type="button" className="btn-a primary ms-auto" disabled={busy} onClick={() => input.current?.click()}>{busy ? 'جارٍ الرفع…' : 'رفع ملفات'}</button>
        <input ref={input} type="file" hidden multiple accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,application/pdf" onChange={e => upload(e.target.files)} />
      </div>
      {msg && <p role="status" className="rounded-xl bg-white px-4 py-2 text-sm" dir="auto">{msg}</p>}
      {loading ? <p className="text-muted">جارٍ التحميل…</p> : items.length === 0 ? <p className="card-a p-8 text-center text-muted">هذا المجلد فارغ.</p> : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(it => (
            <li key={it.path} className="card-a grid gap-2 p-2">
              <a href={it.url} target="_blank" rel="noreferrer" className="grid aspect-[4/3] place-items-center overflow-hidden rounded-lg bg-sand-50">
                {/\.pdf$/i.test(it.name) ? <span className="text-3xl">📄</span> : <img src={it.url} alt="" className="h-full w-full object-contain" loading="lazy" />}
              </a>
              <span className="truncate text-xs text-muted" dir="ltr">{it.name} · {Math.round(it.size / 1024)} KB</span>
              <div className="flex gap-1.5">
                <button type="button" className="btn-a flex-1 !px-2 !py-1 text-xs" onClick={() => copy(it.url)}>نسخ الرابط</button>
                {confirm === it.path
                  ? <button type="button" className="btn-a danger !px-2 !py-1 text-xs" onClick={() => remove(it.path)}>تأكيد</button>
                  : <button type="button" className="btn-a !px-2 !py-1 text-xs" onClick={() => setConfirm(it.path)}>حذف</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
