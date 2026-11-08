import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteView from '@/components/site/SiteView';
import { getSiteData } from '@/lib/data';
import { isLang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

// Pages are built once and refreshed whenever the dashboard saves a change (plus a daily safety refresh).
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return pageMetadata(await getSiteData(), lang);
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <SiteView data={await getSiteData()} lang={lang} />;
}
