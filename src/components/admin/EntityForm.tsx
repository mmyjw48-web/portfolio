'use client';
import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { FieldDef, Option } from '@/lib/admin/entities';
import { saveEntity, saveProfile } from '@/lib/admin/actions';
import ImageField, { GalleryField } from './ImageField';

type Lang = 'en' | 'ar' | 'id';
type Values = Record<string, unknown>;
const LANGS: { k: Lang; label: string; dir: 'ltr' | 'rtl' }[] = [
  { k: 'en', label: 'English', dir: 'ltr' }, { k: 'ar', label: 'العربية', dir: 'rtl' }, { k: 'id', label: 'Indonesia', dir: 'ltr' }
];
const I18N_TYPES = new Set(['i18n', 'i18nText', 'i18nList']);
const FLAG_LABELS: Record<string, { on: string; help: string }> = {
  visible: { on: 'ظاهر في الموقع', help: 'إن أطفأته يختفي من الموقع دون أن يُحذف.' },
  published: { on: 'منشور', help: 'إن أطفأته يبقى مسودة: تراه في المعاينة فقط.' },
  featured: { on: 'مميّز', help: 'المشروع المميّز يظهر رقمه في الصورة الرئيسية، والجائزة المميزة تظهر أولًا.' }
};

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 60);

interface Props {
  mode: 'entity' | 'profile';
  entityKey?: string;
  id?: string | null;
  title: string;
  backHref: string;
  fields: FieldDef[];
  flags?: string[];
  initial: Values;
  options?: { doors?: Option[]; groups?: Option[] };
  previewHref?: string;
}

export default function EntityForm({ mode, entityKey, id = null, title, backHref, fields, flags = [], initial, options = {}, previewHref }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [lang, setLang] = useState<Lang>('en');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const set = (name: string, v: unknown) => { setValues(x => ({ ...x, [name]: v })); setDirty(true); setMsg(null); };

  // how many translatable fields are empty, per language (English text is shown where a translation is missing)
  const missing = useMemo(() => {
    const out: Record<Lang, number> = { en: 0, ar: 0, id: 0 };
    for (const f of fields) {
      if (!I18N_TYPES.has(f.type)) continue;
      const v = (values[f.name] ?? {}) as Record<string, unknown>;
      const hasEn = f.type === 'i18nList' ? (v.en as string[] | undefined)?.length : (v.en as string | undefined)?.trim();
      if (!hasEn) continue;
      for (const l of ['ar', 'id'] as Lang[]) {
        const x = v[l]; const has = f.type === 'i18nList' ? (x as string[] | undefined)?.length : (x as string | undefined)?.trim();
        if (!has) out[l]++;
      }
    }
    return out;
  }, [fields, values]);

  const groups = useMemo(() => {
    const g = new Map<string, FieldDef[]>();
    for (const f of fields) { const k = f.group || ''; if (!g.has(k)) g.set(k, []); g.get(k)!.push(f); }
    return [...g.entries()];
  }, [fields]);

  const submit = () => start(async () => {
    const res = mode === 'profile' ? await saveProfile(values) : await saveEntity(entityKey!, id, values);
    if (!res.ok) { setMsg({ ok: false, text: res.error }); return; }
    setDirty(false);
    if (mode === 'entity' && !id && res.id) { router.replace(`/admin/${entityKey}/${encodeURIComponent(res.id)}?saved=1`); return; }
    setMsg({ ok: true, text: 'تم الحفظ. التغييرات تظهر في الموقع خلال ثوانٍ.' });
    router.refresh();
  });

  return (
    <form className="grid gap-6" onSubmit={e => { e.preventDefault(); submit(); }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <Link href={backHref} className="text-sm text-muted no-underline">→ رجوع</Link>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {previewHref && <a className="btn-a" href={previewHref} target="_blank" rel="noreferrer">معاينة ↗</a>}
          <button type="submit" className="btn-a primary" disabled={pending}>{pending ? 'جارٍ الحفظ…' : 'حفظ'}</button>
        </div>
      </div>

      {msg && <div role="status" className={`rounded-xl border px-4 py-3 ${msg.ok ? 'border-emerald/30 bg-emerald/10 text-emerald' : 'border-ruby/30 bg-ruby/10 text-ruby'}`}>{msg.text}</div>}

      <div className="sticky top-0 z-10 -mx-1 flex flex-wrap items-center gap-2 rounded-xl border border-sand-300 bg-sand-50/95 p-2 backdrop-blur">
        <span className="px-2 text-sm text-muted">لغة الكتابة:</span>
        {LANGS.map(l => (
          <button key={l.k} type="button" onClick={() => setLang(l.k)} aria-pressed={lang === l.k}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${lang === l.k ? 'bg-ink text-sand-100' : 'bg-white text-ink'}`}>
            {l.label}{l.k !== 'en' && missing[l.k] > 0 && <span className="ms-2 rounded-full bg-saffron px-1.5 text-xs text-ink">{missing[l.k]}</span>}
          </button>
        ))}
        <span className="text-xs text-muted">الحقول غير المترجمة تظهر بالإنجليزية في الموقع.</span>
        {dirty && <span className="ms-auto text-xs font-semibold text-saffron-dark">تغييرات غير محفوظة</span>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="grid gap-6">
          {groups.map(([g, list]) => (
            <fieldset key={g || 'main'} className="card-a grid gap-5 p-5">
              {g && <legend className="px-2 text-sm font-bold text-muted">{g}</legend>}
              {list.map(f => <Field key={f.name} f={f} v={values[f.name]} set={v => set(f.name, v)} lang={lang} values={values} options={options} isNew={!id} />)}
            </fieldset>
          ))}
        </div>
        {flags.length > 0 && (
          <aside className="card-a grid h-fit gap-4 p-5 lg:sticky lg:top-20">
            <h2 className="text-sm font-bold text-muted">النشر</h2>
            {flags.map(fl => (
              <label key={fl} className="grid cursor-pointer gap-1">
                <span className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" className="size-4 accent-ink" checked={Boolean(values[fl])} onChange={e => set(fl, e.target.checked)} />
                  {FLAG_LABELS[fl]?.on ?? fl}
                </span>
                <span className="text-xs text-muted">{FLAG_LABELS[fl]?.help}</span>
              </label>
            ))}
            <button type="submit" className="btn-a primary" disabled={pending}>{pending ? 'جارٍ الحفظ…' : 'حفظ'}</button>
          </aside>
        )}
      </div>
    </form>
  );
}

function Label({ f, children }: { f: FieldDef; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <span className="font-semibold">{f.label}{f.required && <span className="text-ruby"> *</span>}</span>
      {children}
      {f.help && <span className="text-xs text-muted">{f.help}</span>}
    </div>
  );
}

function Field({ f, v, set, lang, values, options, isNew }: { f: FieldDef; v: unknown; set: (v: unknown) => void; lang: Lang; values: Values; options: Props['options']; isNew: boolean }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const obj = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const enHint = (x: unknown) => (lang !== 'en' && x ? `بالإنجليزية: ${Array.isArray(x) ? x.join(' / ') : String(x)}` : undefined);

  switch (f.type) {
    case 'i18n':
      return <Label f={f}><input className="field" dir={dir} lang={lang} value={(obj[lang] as string) ?? ''} placeholder={enHint(obj.en)} onChange={e => set({ ...obj, [lang]: e.target.value })} /></Label>;
    case 'i18nText':
      return <Label f={f}><textarea className="field" dir={dir} lang={lang} rows={6} value={(obj[lang] as string) ?? ''} placeholder={enHint(obj.en)} onChange={e => set({ ...obj, [lang]: e.target.value })} /></Label>;
    case 'i18nList': {
      const cur = obj[lang];
      const text = Array.isArray(cur) ? cur.join('\n') : typeof cur === 'string' ? cur : '';
      return <Label f={f}><textarea className="field" dir={dir} lang={lang} rows={5} value={text} placeholder={enHint(obj.en)} onChange={e => set({ ...obj, [lang]: e.target.value.split('\n') })} /></Label>;
    }
    case 'text': case 'email': case 'number':
      return <Label f={f}><input className="field" dir={f.type === 'text' ? 'auto' : 'ltr'} type={f.type === 'email' ? 'email' : f.type === 'number' ? 'number' : 'text'} value={(v as string) ?? ''} onChange={e => set(e.target.value)} /></Label>;
    case 'url':
      return <Label f={f}><input className="field" dir="ltr" type="url" placeholder="https://" value={(v as string) ?? ''} onChange={e => set(e.target.value)} /></Label>;
    case 'textarea':
      return <Label f={f}><textarea className="field" value={(v as string) ?? ''} onChange={e => set(e.target.value)} /></Label>;
    case 'date':
      return <Label f={f}><input className="field max-w-xs" dir="ltr" type="date" value={(v as string) ?? ''} onChange={e => set(e.target.value)} /></Label>;
    case 'slug': {
      const locked = f.name === 'id' && !isNew;
      const title = values.title as Record<string, string> | undefined ?? values.name as Record<string, string> | undefined;
      return (
        <Label f={f}>
          <div className="flex gap-2">
            <input className="field" dir="ltr" value={(v as string) ?? ''} disabled={locked} onChange={e => set(e.target.value.toLowerCase())} />
            {!locked && title?.en && <button type="button" className="btn-a shrink-0" onClick={() => set(slugify(title.en))}>من الاسم</button>}
          </div>
        </Label>
      );
    }
    case 'bool':
      return (
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" className="mt-1 size-4 accent-ink" checked={Boolean(v)} onChange={e => set(e.target.checked)} />
          <span className="grid gap-0.5"><span className="font-semibold">{f.label}</span>{f.help && <span className="text-xs text-muted">{f.help}</span>}</span>
        </label>
      );
    case 'select':
      return <Label f={f}><select className="field max-w-sm" value={(v as string) ?? ''} onChange={e => set(e.target.value)}>{f.options!.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Label>;
    case 'skillGroup':
      return <Label f={f}><select className="field max-w-sm" value={(v as string) ?? ''} onChange={e => set(e.target.value)}><option value="">اختر…</option>{(options?.groups ?? []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Label>;
    case 'doors': {
      const cur = Array.isArray(v) ? (v as string[]) : [];
      return (
        <Label f={f}>
          <div className="flex flex-wrap gap-2">
            {(options?.doors ?? []).map(o => (
              <label key={o.value} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${cur.includes(o.value) ? 'border-ink bg-ink text-sand-100' : 'border-sand-300 bg-white'}`}>
                <input type="checkbox" className="sr-only" checked={cur.includes(o.value)} onChange={e => set(e.target.checked ? [...cur, o.value] : cur.filter(x => x !== o.value))} />
                {o.label}
              </label>
            ))}
          </div>
        </Label>
      );
    }
    case 'tags': {
      const arr = Array.isArray(v) ? (v as string[]) : [];
      return (
        <Label f={f}>
          <input className="field" dir="ltr" defaultValue={arr.join(', ')} onChange={e => set(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          {arr.length > 0 && <div className="flex flex-wrap gap-1.5">{arr.map(t => <span key={t} className="rounded-full border border-sand-300 bg-sand-50 px-2.5 py-0.5 text-sm" dir="ltr">{t}</span>)}</div>}
        </Label>
      );
    }
    case 'image': case 'file':
      return <Label f={f}><ImageField value={(v as string) ?? null} onChange={set} folder={f.folder || 'misc'} file={f.type === 'file'} /></Label>;
    case 'gallery':
      return <Label f={f}><GalleryField value={Array.isArray(v) ? (v as string[]) : []} onChange={set} folder={f.folder || 'misc'} /></Label>;
    case 'metrics': {
      const rows = Array.isArray(v) ? (v as { value: Record<string, string>; label: Record<string, string> }[]) : [];
      const upd = (i: number, part: 'value' | 'label', text: string) => set(rows.map((r, k) => (k === i ? { ...r, [part]: { ...(r[part] || {}), [lang]: text } } : r)));
      return (
        <Label f={f}>
          <div className="grid gap-2">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-[110px_minmax(0,1fr)_auto] gap-2">
                <input className="field" dir="ltr" placeholder="99.5%" value={r.value?.[lang] ?? ''} onChange={e => upd(i, 'value', e.target.value)} />
                <input className="field" dir={dir} placeholder={lang === 'en' ? 'test accuracy' : r.label?.en} value={r.label?.[lang] ?? ''} onChange={e => upd(i, 'label', e.target.value)} />
                <button type="button" className="btn-a danger" onClick={() => set(rows.filter((_, k) => k !== i))}>حذف</button>
              </div>
            ))}
            <div><button type="button" className="btn-a" onClick={() => set([...rows, { value: {}, label: {} }])}>إضافة رقم</button></div>
          </div>
        </Label>
      );
    }
  }
}
