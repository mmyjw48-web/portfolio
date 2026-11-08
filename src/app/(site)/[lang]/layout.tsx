import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { notFound } from 'next/navigation';
import '@fontsource/alexandria/400.css';
import '@fontsource/alexandria/500.css';
import '@fontsource/alexandria/600.css';
import '@fontsource/alexandria/700.css';
import '@fontsource/alexandria/800.css';
import '@fontsource/reem-kufi/500.css';
import '@fontsource/reem-kufi/700.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@/styles/site.css';
import { LOCALES, dirOf, isLang } from '@/lib/i18n';

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0C0D17' }, { media: '(prefers-color-scheme: light)', color: '#F2EEE7' }]
};

// Applies the remembered day/night choice before the first paint, so the page never flashes the wrong theme.
const THEME = `(function(){var d=document.documentElement;d.classList.add('js');try{var s=localStorage.getItem('sky');if(s==='night')d.classList.add('sky-night');else if(s==='day')d.classList.add('sky-day')}catch(e){}})();`;

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} dir={dirOf(lang)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
