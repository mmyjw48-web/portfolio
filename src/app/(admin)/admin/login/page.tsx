import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import { getAdmin } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const admin = await getAdmin();
  if (admin.ok) redirect(next && next.startsWith('/') ? next : '/admin');
  return (
    <main className="grid min-h-screen place-items-center px-5" style={{ background: 'radial-gradient(80% 60% at 50% 0%, #f2b23a33, transparent 70%), #F2EEE7' }}>
      <div className="card-a grid w-full max-w-sm gap-6 p-8" style={{ borderRadius: '48px 48px 16px 16px' }}>
        <div className="grid gap-1 text-center">
          <img src="/images/doors/qamariya-ai.webp" alt="" width={120} height={60} className="mx-auto mb-2" />
          <h1 className="text-xl font-bold">لوحة تحكم الموقع</h1>
          <p className="text-sm text-muted">سجّل الدخول لإدارة المحتوى</p>
        </div>
        {admin.reason === 'not-configured'
          ? <p className="text-center text-sm text-ruby">لم تُضف مفاتيح Supabase في إعدادات الموقع بعد.</p>
          : <LoginForm next={next && next.startsWith('/') ? next : '/admin'} />}
      </div>
    </main>
  );
}
