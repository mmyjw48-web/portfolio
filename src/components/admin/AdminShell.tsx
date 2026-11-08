import Link from 'next/link';
import type { ReactNode } from 'react';
import { signOut } from '@/lib/admin/actions';

const NAV: { href: string; label: string; icon: string }[] = [
  { href: '/admin', label: 'الرئيسية', icon: '⌂' },
  { href: '/admin/profile', label: 'الملف الشخصي والتواصل', icon: '☺' },
  { href: '/admin/sections', label: 'الأقسام وترتيبها', icon: '☰' },
  { href: '/admin/doors', label: 'الأبواب', icon: '⌂' },
  { href: '/admin/projects', label: 'المشاريع', icon: '◆' },
  { href: '/admin/experiences', label: 'الخبرات', icon: '▲' },
  { href: '/admin/activities', label: 'القيادة والأنشطة', icon: '★' },
  { href: '/admin/achievements', label: 'الإنجازات والشهادات', icon: '✦' },
  { href: '/admin/education', label: 'التعليم', icon: '✎' },
  { href: '/admin/skill_groups', label: 'مجموعات المهارات', icon: '▦' },
  { href: '/admin/skills', label: 'المهارات', icon: '•' },
  { href: '/admin/media', label: 'مكتبة الصور والملفات', icon: '▣' },
  { href: '/admin/messages', label: 'الرسائل', icon: '✉' }
];

export default function AdminShell({ email, unread, children }: { email: string; unread: number; children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b border-sand-300 bg-sand-50 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-e">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block">
          <Link href="/admin" className="block no-underline">
            <span className="block text-lg font-bold text-ink">لوحة التحكم</span>
            <span className="block text-xs text-muted" dir="ltr">{email}</span>
          </Link>
          <details className="lg:hidden">
            <summary className="btn-a cursor-pointer list-none">القائمة</summary>
            <Nav unread={unread} />
          </details>
        </div>
        <div className="hidden lg:block"><Nav unread={unread} /></div>
      </aside>
      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-end gap-2 border-b border-sand-300 bg-sand-100/90 px-5 py-3 backdrop-blur">
          <a className="btn-a" href="/ar" target="_blank" rel="noreferrer">عرض الموقع ↗</a>
          <a className="btn-a" href="/ar/preview" target="_blank" rel="noreferrer">معاينة مع المسودات ↗</a>
          <form action={signOut}><button className="btn-a" type="submit">تسجيل الخروج</button></form>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
      </div>
    </div>
  );
}

function Nav({ unread }: { unread: number }) {
  return (
    <nav className="grid gap-0.5 px-3 pb-6" aria-label="أقسام لوحة التحكم">
      {NAV.map(n => (
        <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-ink no-underline hover:bg-sand-200">
          <span aria-hidden="true" className="w-4 text-center text-muted">{n.icon}</span>
          <span className="flex-1">{n.label}</span>
          {n.href === '/admin/messages' && unread > 0 && <span className="rounded-full bg-ruby px-2 text-xs font-semibold text-white">{unread}</span>}
        </Link>
      ))}
    </nav>
  );
}
