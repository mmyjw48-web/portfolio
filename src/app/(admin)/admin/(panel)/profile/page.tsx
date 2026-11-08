import EntityForm from '@/components/admin/EntityForm';
import { getAdmin } from '@/lib/admin/auth';
import { PROFILE_FIELDS } from '@/lib/admin/entities';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const admin = await getAdmin(); if (!admin.ok) return null;
  const { data } = await admin.db.from('profile').select('*').eq('id', 1).maybeSingle();
  return <EntityForm mode="profile" title="الملف الشخصي والتواصل" backHref="/admin" fields={PROFILE_FIELDS} initial={data ?? {}} previewHref="/ar/preview" />;
}
