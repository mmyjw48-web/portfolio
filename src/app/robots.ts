import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/supabase/env';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/en/preview', '/ar/preview', '/id/preview', '/api'] }], sitemap: `${SITE_URL}/sitemap.xml` };
}
