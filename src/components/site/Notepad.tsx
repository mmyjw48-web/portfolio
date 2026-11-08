'use client';
import { useEffect, useState } from 'react';

/** Spiral notepad whose page flips through the roles. All pages share one grid cell so the card keeps the widest size. */
export default function Notepad({ roles }: { roles: string[] }) {
  const [s, setS] = useState<{ cur: number; prev: number | null }>({ cur: 0, prev: null });
  useEffect(() => {
    if (roles.length < 2) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setInterval(() => setS(x => ({ cur: (x.cur + 1) % roles.length, prev: reduce ? null : x.cur })), reduce ? 4200 : 2800);
    return () => clearInterval(id);
  }, [roles.length]);
  useEffect(() => {
    if (s.prev === null) return;
    const id = setTimeout(() => setS(x => ({ ...x, prev: null })), 700);
    return () => clearTimeout(id);
  }, [s.prev]);

  return (
    <div className="notepad" aria-live="polite">
      <div className="rings" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
      {roles.map((r, i) => {
        const cls = ['np-page', i === s.cur ? 'is-current' : '', i === s.cur && s.prev !== null ? 'flip-in' : '', i === s.prev ? 'flip-out' : ''].filter(Boolean).join(' ');
        return <div key={i} className={cls} aria-hidden={i !== s.cur}>{r}</div>;
      })}
      <div className="np-dots" aria-hidden="true">{roles.map((_, i) => <i key={i} className={i === s.cur ? 'on' : ''} />)}</div>
    </div>
  );
}
