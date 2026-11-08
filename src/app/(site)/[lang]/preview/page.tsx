import { notFound, redirect } from 'next/navigation';
import SiteView from '@/components/site/SiteView';
import { getPreviewData } from '@/lib/data';
import { isLang } from '@/lib/i18n';
import { getAdmin } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false }, title: 'Preview' };

/** The site exactly as it will look, including drafts. Only the signed-in admin can open it. */
export default async function Preview({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const admin = await getAdmin();
  if (!admin.ok) redirect('/admin/login');
  return <SiteView data={await getPreviewData(admin.db)} lang={lang} preview />;
}
