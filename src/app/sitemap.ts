import type { MetadataRoute } from 'next';
import { getSiteData } from '@/lib/data';
import { LOCALES } from '@/lib/i18n';
import { SITE_URL } from '@/lib/supabase/env';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSiteData();
  const paths = ['', ...data.projects.map(p => `/projects/${p.slug}`)];
  return paths.flatMap(path => LOCALES.map(l => ({
    url: `${SITE_URL}/${l}${path}`,
    changeFrequency: 'monthly' as const,
    priority: path ? 0.7 : 1,
    alternates: { languages: Object.fromEntries(LOCALES.map(x => [x, `${SITE_URL}/${x}${path}`])) }
  })));
}
