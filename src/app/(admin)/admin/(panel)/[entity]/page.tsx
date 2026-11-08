import Link from 'next/link';
import { notFound } from 'next/navigation';
import ListView, { type Row } from '@/components/admin/ListView';
import { getAdmin } from '@/lib/admin/auth';
import { ENTITIES } from '@/lib/admin/entities';
import { label } from '@/lib/admin/util';

export const dynamic = 'force-dynamic';

export default async function EntityList({ params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  const def = ENTITIES[entity]; if (!def) notFound();
  const admin = await getAdmin(); if (!admin.ok) return null;
  const { data, error } = await admin.db.from(def.table).select('*').order('sort', { ascending: true });
  let groupNames = new Map<string, string>(), groupOrder = new Map<string, number>();
  if (entity === 'skills') {
    const { data: g } = await admin.db.from('skill_groups').select('id, name, sort').order('sort');
    groupNames = new Map((g ?? []).map(x => [x.id as string, label(x.name)]));
    groupOrder = new Map((g ?? []).map((x, i) => [x.id as string, i]));
  }
  const imageKey = ({ projects: 'cover_url', achievements: 'image_url', activities: 'image_url' } as Record<string, string>)[entity];
  const rows: Row[] = (data ?? [])
    .map(r => ({
      order: entity === 'skills' ? groupOrder.get(r.group_id) ?? 99 : 0,
      row: {
        id: String(r[def.pk]), title: label(r[def.titleField]), subtitle: def.subtitleField ? label(r[def.subtitleField]) : undefined,
        visible: r.visible, published: r.published, featured: r.featured,
        group: entity === 'skills' ? groupNames.get(r.group_id) ?? '—' : undefined,
        thumb: imageKey ? (r[imageKey] as string | null) : undefined
      } as Row
    }))
    .sort((a, b) => a.order - b.order)
    .map(x => x.row);
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold">{def.label}</h1>
          <p className="max-w-2xl text-muted">{def.intro}</p>
        </div>
        {def.canCreate && <Link href={`/admin/${entity}/new`} className="btn-a primary">+ إضافة {def.singular}</Link>}
      </div>
      {error ? <p className="text-ruby">{error.message}</p> : (
        <ListView entityKey={entity} rows={rows} flags={def.flags} canDelete={def.canDelete} emptyText={`لا يوجد ${def.singular} بعد.`} />
      )}
      <p className="text-xs text-muted">استخدم ▲ ▼ لتغيير الترتيب في الموقع. "إخفاء" يُبعد العنصر عن الموقع دون حذفه.</p>
    </div>
  );
}
