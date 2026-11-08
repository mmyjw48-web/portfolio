import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { getAdmin } from '@/lib/admin/auth';
import { signOut } from '@/lib/admin/actions';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const admin = await getAdmin();
  if (!admin.ok && admin.reason === 'signed-out') redirect('/admin/login');
  if (!admin.ok) {
    return (
      <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-5">
        <div className="card-a grid gap-4 p-8 text-center">
          <h1 className="text-xl font-bold">{admin.reason === 'not-configured' ? 'لم يُربط الموقع بقاعدة البيانات بعد' : 'هذا الحساب ليس حساب المدير'}</h1>
          <p className="text-muted">{admin.reason === 'not-configured'
            ? 'أضف مفاتيح Supabase في إعدادات Vercel ثم أعد النشر. التفاصيل في دليل الإعداد.'
            : 'سجّل الدخول بالبريد المسجّل في جدول المدراء (admins) في Supabase.'}</p>
          {admin.reason === 'not-admin' && <form action={signOut}><button className="btn-a" type="submit">تسجيل الخروج</button></form>}
        </div>
      </main>
    );
  }
  const { count } = await admin.db.from('messages').select('id', { count: 'exact', head: true }).eq('read', false);
  return <AdminShell email={admin.user.email ?? ''} unread={count ?? 0}>{children}</AdminShell>;
}
