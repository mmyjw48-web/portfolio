import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';
import './admin.css';

export const metadata: Metadata = { title: 'لوحة التحكم', robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
