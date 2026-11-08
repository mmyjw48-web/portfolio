'use client';
import { useEffect, useRef, type ReactNode } from 'react';

/** Wraps the portrait stage: soft pointer parallax on desktop and a gentle drift while scrolling. The photo itself is never altered. */
export default function HeroStage({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const stage = ref.current; if (!stage) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = stage.closest('.hero') as HTMLElement | null; if (!hero) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, sraf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      stage.style.setProperty('--px', cx.toFixed(3)); stage.style.setProperty('--py', cy.toFixed(3));
      raf = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); };
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) { hero.addEventListener('pointermove', move); hero.addEventListener('pointerleave', leave); }
    const onScroll = () => { if (sraf) return; sraf = requestAnimationFrame(() => { sraf = 0; stage.style.setProperty('--sy', Math.max(0, Math.min(1, scrollY / hero.offsetHeight)).toFixed(3)); }); };
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave);
      removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); cancelAnimationFrame(sraf);
    };
  }, []);
  return <figure ref={ref} className="stage" aria-label={label}>{children}</figure>;
}
