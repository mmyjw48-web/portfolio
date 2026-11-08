'use client';
import { useRef, useState } from 'react';
import { browserClient } from '@/lib/supabase/browser';

const BUCKET = 'media';
const MAX_SIDE = 2000;

/** Shrinks large photos and converts them to WebP in the browser before upload (transparency is kept). */
async function compress(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return { blob: file, ext: file.name.split('.').pop() || 'bin', type: file.type };
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/webp', 0.86));
    if (!blob || blob.size > file.size) return { blob: file, ext: file.name.split('.').pop() || 'jpg', type: file.type };
    return { blob, ext: 'webp', type: 'image/webp' };
  } catch { return { blob: file, ext: file.name.split('.').pop() || 'jpg', type: file.type }; }
}

export async function uploadToMedia(file: File, folder: string): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error('الملف أكبر من 10 ميغابايت.');
  const { blob, ext, type } = await compress(file);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext.toLowerCase()}`;
  const db = browserClient();
  const { error } = await db.storage.from(BUCKET).upload(path, blob, { contentType: type, cacheControl: '31536000', upsert: false });
  if (error) throw new Error(error.message);
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export default function ImageField({ value, onChange, folder, file }: { value: string | null; onChange: (v: string | null) => void; folder: string; file?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [manual, setManual] = useState(false);
  const pick = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true); setErr('');
    try { onChange(await uploadToMedia(f, folder)); }
    catch (e) { setErr(e instanceof Error ? e.message : 'تعذّر الرفع'); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };
  const isPdf = !!value && /\.pdf($|\?)/i.test(value);
  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-sand-300 bg-sand-50">
          {value && !isPdf && !file ? <img src={value} alt="" className="h-full w-full object-contain" /> : value ? <span className="text-2xl" aria-hidden="true">📄</span> : <span className="text-xs text-muted">لا يوجد</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-a" disabled={busy} onClick={() => input.current?.click()}>{busy ? 'جارٍ الرفع…' : value ? 'استبدال' : file ? 'رفع ملف' : 'رفع صورة'}</button>
          {value && <a className="btn-a" href={value} target="_blank" rel="noreferrer">فتح ↗</a>}
          {value && <button type="button" className="btn-a danger" onClick={() => onChange(null)}>إزالة</button>}
          <button type="button" className="btn-a" onClick={() => setManual(m => !m)}>{manual ? 'إخفاء الرابط' : 'لصق رابط'}</button>
        </div>
        <input ref={input} type="file" hidden accept={file ? 'application/pdf' : 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml'} onChange={e => pick(e.target.files?.[0])} />
      </div>
      {manual && <input className="field" dir="ltr" value={value ?? ''} placeholder="https://..." onChange={e => onChange(e.target.value || null)} />}
      {err && <p className="text-sm text-ruby">{err}</p>}
    </div>
  );
}

export function GalleryField({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true); setErr('');
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadToMedia(f, folder));
      onChange([...value, ...urls]);
    } catch (e) { setErr(e instanceof Error ? e.message : 'تعذّر الرفع'); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };
  const move = (i: number, d: number) => { const a = [...value]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((u, i) => (
          <figure key={u} className="m-0 grid gap-1 rounded-xl border border-sand-300 bg-sand-50 p-2">
            <img src={u} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <div className="flex justify-between gap-1 text-sm">
              <button type="button" className="px-2" onClick={() => move(i, -1)} aria-label="تقديم">→</button>
              <button type="button" className="px-2 text-ruby" onClick={() => onChange(value.filter(x => x !== u))}>حذف</button>
              <button type="button" className="px-2" onClick={() => move(i, 1)} aria-label="تأخير">←</button>
            </div>
          </figure>
        ))}
      </div>
      <div><button type="button" className="btn-a" disabled={busy} onClick={() => input.current?.click()}>{busy ? 'جارٍ الرفع…' : 'إضافة صور'}</button></div>
      <input ref={input} type="file" hidden multiple accept="image/png,image/jpeg,image/webp" onChange={e => add(e.target.files)} />
      {err && <p className="text-sm text-ruby">{err}</p>}
    </div>
  );
}
