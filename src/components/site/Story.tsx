'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

export interface StoryYearVM { year: number; countLabel: string; items: { cat: string; when: string; text: string; sub?: string }[] }
interface Props { years: StoryYearVM[]; legend: { cat: string; label: string }[]; eyebrow: string; title: string; skyline: string }

export const CAT_VAR: Record<string, string> = { ai: '--ruby', mobile: '--cobalt', web: '--emerald', lead: '--saffron', learn: '--muted', next: '--muted' };

export default function Story({ years, legend, eyebrow, title, skyline }: Props) {
  const [active, setActive] = useState(0);
  const groups = useRef<(HTMLElement | null)[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }), { rootMargin: '-45% 0px -50% 0px' });
    groups.current.forEach(g => g && io.observe(g));
    return () => io.disconnect();
  }, [years.length]);

  // drifting dust in the lamplight; paused when off screen or when motion is reduced
  useEffect(() => {
    const c = canvas.current, sec = section.current; if (!c || !sec) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    let w = 0, h = 0, raf = 0, running = false;
    let parts: { x: number; y: number; r: number; v: number; a: number }[] = [];
    const size = () => { const r = c.getBoundingClientRect(); w = c.width = Math.round(r.width * dpr); h = c.height = Math.round(r.height * dpr); parts = Array.from({ length: 60 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.6 + 0.4) * dpr, v: (Math.random() * 0.25 + 0.05) * dpr, a: Math.random() * 0.5 + 0.2 })); };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const night = getComputedStyle(document.documentElement).getPropertyValue('--glow').trim() === '1';
      ctx.fillStyle = night ? '#F2D9A8' : '#7A5A40';
      for (const p of parts) {
        p.y -= p.v; p.x += Math.sin(p.y / 60) * 0.15; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a * (night ? 0.55 : 0.18); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    size(); draw();
    addEventListener('resize', size);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => removeEventListener('resize', size);
    const io = new IntersectionObserver(es => { running = es[0].isIntersecting; cancelAnimationFrame(raf); if (running) raf = requestAnimationFrame(draw); });
    io.observe(sec);
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);

  const year = String(years[active]?.year ?? '');
  const n = years.length;
  return (
    <section className="story" id="story" aria-labelledby="story-h" ref={section}>
      <canvas ref={canvas} aria-hidden="true" />
      <div className="skyline" aria-hidden="true" dangerouslySetInnerHTML={{ __html: skyline }} />
      <div className="wrap story-grid">
        <div className="story-pin" data-reveal="0">
          <span className="label eyebrow">{eyebrow}</span>
          <h2 id="story-h">{title}</h2>
          <div className="odo" aria-label={year}>
            {year.split('').map((ch, k) => (
              <span key={k} className="d"><span className="strip-d" style={{ transform: `translateY(-${Number(ch)}em)` }}>{Array.from({ length: 10 }, (_, d) => <span key={d}>{d}</span>)}</span></span>
            ))}
          </div>
          <div className="progress">
            <span className="label ltr">{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
            <span className="bar"><i style={{ width: `${((active + 1) / Math.max(1, n)) * 100}%` }} /></span>
          </div>
          <ul className="legend">{legend.map(l => <li key={l.cat} style={{ '--dot': `var(${CAT_VAR[l.cat]})` } as CSSProperties}><i />{l.label}</li>)}</ul>
        </div>
        <div className="years">
          {years.map((g, gi) => (
            <section key={g.year} className="year-group" data-i={gi} ref={el => { groups.current[gi] = el; }} aria-label={String(g.year)} data-reveal="0">
              <div className="year-head"><b>{g.year}</b><span className="label">{g.countLabel}</span></div>
              <ol className="entries">
                {g.items.map((it, k) => (
                  <li key={k} className={`entry${it.cat === 'next' ? ' next' : ''}`} style={{ '--dot': `var(${CAT_VAR[it.cat] ?? '--muted'})` } as CSSProperties}>
                    <span className="when">{it.when}</span>
                    <p>{it.text}{it.sub ? <small>{it.sub}</small> : null}</p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
