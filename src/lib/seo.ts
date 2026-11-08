import type { Metadata } from 'next';
import { LOCALES, t } from './i18n';
import type { Lang, SiteData } from './types';
import { SITE_URL } from './supabase/env';

const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ar: 'ar_YE', id: 'id_ID' };

export function pageMetadata(data: SiteData, lang: Lang, path = '', override?: { title?: string; description?: string }): Metadata {
  const title = override?.title || t(data.profile.seo_title, lang) || t(data.profile.name, lang);
  const description = override?.description || t(data.profile.seo_description, lang);
  const languages = Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}${path}`]));
  return {
    metadataBase: new URL(SITE_URL),
    title, description,
    alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages: { ...languages, 'x-default': `${SITE_URL}/en${path}` } },
    openGraph: {
      type: 'website', title, description, url: `${SITE_URL}/${lang}${path}`, siteName: t(data.profile.name, 'en'),
      locale: OG_LOCALE[lang], alternateLocale: LOCALES.filter(l => l !== lang).map(l => OG_LOCALE[l]),
      images: [{ url: '/og.png', width: 1200, height: 630, alt: t(data.profile.name, lang) }]
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
    robots: { index: true, follow: true }
  };
}
