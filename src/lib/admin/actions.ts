'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ENTITIES, PROFILE_FIELDS, type FieldDef } from './entities';
import { getAdmin } from './auth';
import { serverClient } from '@/lib/supabase/server';
import { SITE_URL, hasSupabase } from '@/lib/supabase/env';

export type Result = { ok: true; id?: string } | { ok: false; error: string };

const LANGS = ['en', 'ar', 'id'] as const;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const URLISH = /^(https?:\/\/[^\s]+|\/[^\s]*)$/;

class Invalid extends Error {}

function str(v: unknown, max: number) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }

function i18n(v: unknown, max: number) {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const l of LANGS) { const s = str(o[l], max); if (s) out[l] = s; }
  return Object.keys(out).length ? out : null;
}
function i18nList(v: unknown) {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const out: Record<string, string[]> = {};
  for (const l of LANGS) {
    const raw = o[l];
    const arr = (Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split('\n') : []).map(x => str(x, 600)).filter(Boolean).slice(0, 50);
    if (arr.length) out[l] = arr;
  }
  return Object.keys(out).length ? out : null;
}

/** Turn what the form sent into exactly the columns this table accepts. Anything else is dropped. */
function clean(fields: FieldDef[], input: Record<string, unknown>, extra: string[] = []) {
  const data: Record<string, unknown> = {};
  for (const f of fields) {
    const v = input[f.name];
    switch (f.type) {
      case 'i18n': data[f.name] = i18n(v, 400); break;
      case 'i18nText': data[f.name] = i18n(v, 20000); break;
      case 'i18nList': data[f.name] = i18nList(v); break;
      case 'text': case 'textarea': data[f.name] = str(v, 5000) || null; break;
      case 'number': data[f.name] = Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0; break;
      case 'email': { const s = str(v, 200); if (s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) throw new Invalid(`${f.label}: البريد غير صحيح`); data[f.name] = s || null; break; }
      case 'url': case 'image': case 'file': { const s = str(v, 2000); if (s && !URLISH.test(s)) throw new Invalid(`${f.label}: الرابط يجب أن يبدأ بـ https://`); data[f.name] = s || null; break; }
      case 'date': { const s = str(v, 10); if (s && !/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Invalid(`${f.label}: التاريخ غير صحيح`); data[f.name] = s || null; break; }
      case 'slug': { const s = str(v, 80).toLowerCase(); if (!SLUG.test(s)) throw new Invalid(`${f.label}: استخدم حروفًا إنجليزية صغيرة وأرقامًا وشرطات فقط`); data[f.name] = s; break; }
      case 'bool': data[f.name] = v === true || v === 'true' || v === 'on'; break;
      case 'select': { const s = str(v, 40); if (!f.options?.some(o => o.value === s)) throw new Invalid(`${f.label}: اختر قيمة من القائمة`); data[f.name] = s; break; }
      case 'tags': data[f.name] = (Array.isArray(v) ? v : typeof v === 'string' ? v.split(',') : []).map(x => str(x, 80)).filter(Boolean).slice(0, 40); break;
      case 'gallery': data[f.name] = (Array.isArray(v) ? v : []).map(x => str(x, 2000)).filter(x => URLISH.test(x)).slice(0, 24); break;
      case 'doors': data[f.name] = (Array.isArray(v) ? v : []).map(x => str(x, 60)).filter(x => SLUG.test(x)).slice(0, 10); break;
      case 'skillGroup': { const s = str(v, 40); if (!UUID.test(s)) throw new Invalid(`${f.label}: اختر مجموعة`); data[f.name] = s; break; }
      case 'metrics': data[f.name] = (Array.isArray(v) ? v : []).map(m => ({ value: i18n((m as Record<string, unknown>)?.value, 40) ?? {}, label: i18n((m as Record<string, unknown>)?.label, 120) ?? {} }))
        .filter(m => Object.keys(m.value).length).slice(0, 8); break;
    }
    if (f.required && (data[f.name] === null || data[f.name] === '' || (typeof data[f.name] === 'object' && data[f.name] !== null && !Object.keys(data[f.name] as object).length)))
      throw new Invalid(`${f.label}: هذا الحقل مطلوب`);
  }
  for (const k of extra) if (k in input) data[k] = input[k] === true || input[k] === 'true';
  return data;
}

function revalidateSite() {
  revalidatePath('/[lang]', 'layout');
  revalidatePath('/sitemap.xml');
}

function fail(e: unknown): Result {
  if (e instanceof Invalid) return { ok: false, error: e.message };
  const msg = e instanceof Error ? e.message : String(e);
  if (/duplicate key/i.test(msg)) return { ok: false, error: 'هذا المعرّف أو الرابط المختصر مستخدم من قبل. اختر غيره.' };
  if (/row-level security|permission denied/i.test(msg)) return { ok: false, error: 'ليس لديك صلاحية لهذا التعديل. سجّل الدخول بحساب المدير.' };
  return { ok: false, error: `تعذّر الحفظ: ${msg}` };
}

export async function saveEntity(key: string, id: string | null, values: Record<string, unknown>): Promise<Result> {
  const def = ENTITIES[key]; if (!def) return { ok: false, error: 'قسم غير معروف' };
  const admin = await getAdmin(); if (!admin.ok) return { ok: false, error: 'انتهت الجلسة. سجّل الدخول مرة أخرى.' };
  try {
    const fields = id && def.pk === 'id' && key === 'doors' ? def.fields.filter(f => f.name !== 'id') : def.fields;
    const data = clean(fields, values, def.flags);
    const db = admin.db;
    if (!id) {
      if (!def.canCreate) return { ok: false, error: 'لا يمكن إضافة عناصر هنا' };
      const { data: last } = await db.from(def.table).select('sort').order('sort', { ascending: false }).limit(1);
      data.sort = ((last?.[0]?.sort as number) ?? 0) + 10;
      const { data: row, error } = await db.from(def.table).insert(data).select(def.pk).single();
      if (error) throw error;
      revalidateSite();
      return { ok: true, id: String((row as Record<string, unknown>)[def.pk]) };
    }
    const { error } = await db.from(def.table).update(data).eq(def.pk, id);
    if (error) throw error;
    revalidateSite();
    return { ok: true, id };
  } catch (e) { return fail(e); }
}

export async function saveProfile(values: Record<string, unknown>): Promise<Result> {
  const admin = await getAdmin(); if (!admin.ok) return { ok: false, error: 'انتهت الجلسة. سجّل الدخول مرة أخرى.' };
  try {
    const data = clean(PROFILE_FIELDS, values);
    const { error } = await admin.db.from('profile').upsert({ id: 1, ...data });
    if (error) throw error;
    revalidateSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function toggleFlag(key: string, id: string, flag: 'visible' | 'published' | 'featured'): Promise<Result> {
  const def = ENTITIES[key]; if (!def || !def.flags.includes(flag)) return { ok: false, error: 'غير مسموح' };
  const admin = await getAdmin(); if (!admin.ok) return { ok: false, error: 'انتهت الجلسة' };
  try {
    const { data: row, error: e1 } = await admin.db.from(def.table).select(flag).eq(def.pk, id).single();
    if (e1) throw e1;
    const { error } = await admin.db.from(def.table).update({ [flag]: !(row as Record<string, boolean>)[flag] }).eq(def.pk, id);
    if (error) throw error;
    revalidateSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function moveItem(key: string, id: string, dir: -1 | 1): Promise<Result> {
  const def = ENTITIES[key]; if (!def) return { ok: false, error: 'قسم غير معروف' };
  const admin = await getAdmin(); if (!admin.ok) return { ok: false, error: 'انتهت الجلسة' };
  try {
    const db = admin.db;
    let q = db.from(def.table).select(`${def.pk}, sort${key === 'skills' ? ', group_id' : ''}`).order('sort', { ascending: true });
    if (key === 'skills') {
      const { data: me } = await db.from('skills').select('group_id').eq('id', id).single();
      q = q.eq('group_id', (me as { group_id: string }).group_id);
    }
    const { data: rows, error } = await q;
    if (error) throw error;
    const list = (rows as unknown as Record<string, unknown>[]).map((r, i) => ({ pk: String(r[def.pk]), sort: (i + 1) * 10 }));
    const i = list.findIndex(r => r.pk === id), j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return { ok: true };
    [list[i].sort, list[j].sort] = [list[j].sort, list[i].sort];
    for (const r of list) {
      const { error: e } = await db.from(def.table).update({ sort: r.sort }).eq(def.pk, r.pk);
      if (e) throw e;
    }
    revalidateSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function deleteItem(key: string, id: string): Promise<Result> {
  const def = ENTITIES[key]; if (!def?.canDelete) return { ok: false, error: 'لا يمكن الحذف هنا' };
  const admin = await getAdmin(); if (!admin.ok) return { ok: false, error: 'انتهت الجلسة' };
  try {
    const { error } = await admin.db.from(def.table).delete().eq(def.pk, id);
    if (error) throw error;
    revalidateSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function setMessageRead(id: string, read: boolean): Promise<Result> {
  const admin = await getAdmin(); if (!admin.ok) return { ok: false, error: 'انتهت الجلسة' };
  const { error } = await admin.db.from('messages').update({ read }).eq('id', id);
  return error ? fail(error) : { ok: true };
}
export async function deleteMessage(id: string): Promise<Result> {
  const admin = await getAdmin(); if (!admin.ok) return { ok: false, error: 'انتهت الجلسة' };
  const { error } = await admin.db.from('messages').delete().eq('id', id);
  return error ? fail(error) : { ok: true };
}

/* ---------- sign in / out / password ---------- */
export interface AuthState { error?: string; info?: string }

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  if (!hasSupabase()) return { error: 'لم تُضبط مفاتيح Supabase بعد.' };
  const email = String(form.get('email') || '').trim(), password = String(form.get('password') || '');
  const next = String(form.get('next') || '/admin');
  const db = await serverClient();
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) return { error: 'البريد أو كلمة المرور غير صحيحة.' };
  redirect(next.startsWith('/admin') || /^\/(en|ar|id)\/preview$/.test(next) ? next : '/admin');
}

export async function signOut() {
  const db = await serverClient();
  await db.auth.signOut();
  redirect('/admin/login');
}

export async function requestReset(_prev: AuthState, form: FormData): Promise<AuthState> {
  if (!hasSupabase()) return { error: 'لم تُضبط مفاتيح Supabase بعد.' };
  const email = String(form.get('email') || '').trim();
  if (!email) return { error: 'اكتب بريدك أولًا.' };
  const db = await serverClient();
  await db.auth.resetPasswordForEmail(email, { redirectTo: `${SITE_URL}/admin/auth/callback?next=/admin/reset-password` });
  return { info: 'إن كان البريد مسجّلًا فستصلك رسالة فيها رابط لتعيين كلمة مرور جديدة.' };
}
