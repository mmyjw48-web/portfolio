import { notFound } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { getAdmin } from '@/lib/admin/auth';
import { ENTITIES } from '@/lib/admin/entities';
import { label } from '@/lib/admin/util';

export const dynamic = 'force-dynamic';

export default async function EntityEdit({ params, searchParams }: { params: Promise<{ entity: string; id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { entity, id: rawId } = await params;
  const { saved } = await searchParams;
  const def = ENTITIES[entity]; if (!def) notFound();
  const admin = await getAdmin(); if (!admin.ok) return null;
  const id = decodeURIComponent(rawId);
  const isNew = id === 'new';
  if (isNew && !def.canCreate) notFound();
  let initial: Record<string, unknown> = { ...def.defaults };
  if (!isNew) {
    const { data } = await admin.db.from(def.table).select('*').eq(def.pk, id).maybeSingle();
    if (!data) notFound();
    initial = data;
  }
  const options: { doors?: { value: string; label: string }[]; groups?: { value: string; label: string }[] } = {};
  if (def.fields.some(f => f.type === 'doors')) {
    const { data } = await admin.db.from('doors').select('id, name').order('sort');
    options.doors = (data ?? []).map(d => ({ value: d.id as string, label: label(d.name) }));
  }
  if (def.fields.some(f => f.type === 'skillGroup')) {
    const { data } = await admin.db.from('skill_groups').select('id, name').order('sort');
    options.groups = (data ?? []).map(d => ({ value: d.id as string, label: label(d.name) }));
  }
  const title = isNew ? `إضافة ${def.singular}` : `تعديل: ${label(initial[def.titleField]) || def.singular}`;
  const previewHref = entity === 'projects' && !isNew ? `/ar/preview#door-${(initial.doors as string[] | undefined)?.[0] ?? ''}` : '/ar/preview';
  return (
    <div className="grid gap-4">
      {saved && <div role="status" className="rounded-xl border border-emerald/30 bg-emerald/10 px-4 py-3 text-emerald">تمت الإضافة. يمكنك متابعة التعديل أو نشره.</div>}
      <EntityForm mode="entity" entityKey={entity} id={isNew ? null : id} title={title} backHref={`/admin/${entity}`}
        fields={def.fields} flags={def.flags} initial={initial} options={options} previewHref={previewHref} />
    </div>
  );
}
