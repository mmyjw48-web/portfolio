import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const LOCALES = ['en', 'ar', 'id'];
const OPEN_ADMIN = ['/admin/login', '/admin/auth', '/admin/reset-password'];

function pickLang(header: string | null) {
  const prefs = (header || '').toLowerCase().split(',').map(s => s.trim().slice(0, 2));
  return prefs.find(p => LOCALES.includes(p)) || 'en';
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split('/');
  const first = seg[1] || '';

  if (pathname === '/') return NextResponse.redirect(new URL(`/${pickLang(req.headers.get('accept-language'))}`, req.url));
  const isAdmin = first === 'admin';
  const isPreview = LOCALES.includes(first) && seg[2] === 'preview';
  if (!isAdmin && !LOCALES.includes(first)) return NextResponse.redirect(new URL(`/en${pathname}`, req.url));
  if (!isAdmin && !isPreview) return NextResponse.next();

  // Dashboard and preview: keep the Supabase session cookie fresh and send signed-out visitors to the login page.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: list => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      }
    }
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && (isPreview || (isAdmin && !OPEN_ADMIN.some(p => pathname.startsWith(p))))) {
    const to = new URL('/admin/login', req.url);
    to.searchParams.set('next', pathname);
    return NextResponse.redirect(to);
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/|api/|images/|certificates/|favicon|og\\.png|sitemap\\.xml|robots\\.txt|.*\\.[a-zA-Z0-9]+$).*)']
};
