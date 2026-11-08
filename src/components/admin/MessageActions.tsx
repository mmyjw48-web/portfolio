'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMessage, setMessageRead } from '@/lib/admin/actions';

export default function MessageActions({ id, read, email }: { id: string; read: boolean; email: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const run = (fn: () => Promise<unknown>) => start(async () => { await fn(); router.refresh(); });
  return (
    <div className="flex flex-wrap gap-2">
      <a className="btn-a !py-1 text-xs" href={`mailto:${email}`}>رد بالبريد</a>
      <button type="button" className="btn-a !py-1 text-xs" disabled={pending} onClick={() => run(() => setMessageRead(id, !read))}>{read ? 'تعليم كغير مقروءة' : 'تعليم كمقروءة'}</button>
      {confirm
        ? <button type="button" className="btn-a danger !py-1 text-xs" disabled={pending} onClick={() => run(() => deleteMessage(id))}>تأكيد الحذف</button>
        : <button type="button" className="btn-a !py-1 text-xs" onClick={() => setConfirm(true)}>حذف</button>}
    </div>
  );
}
