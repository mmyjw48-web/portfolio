'use client';
import { useEffect } from 'react';

/** Elements marked data-reveal glide into place when they first scroll into view. They are visible without JavaScript. */
export default function Reveal() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter(el => el.getBoundingClientRect().top > innerHeight * 0.9);
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement; el.classList.add('in'); io.unobserve(el);
      setTimeout(() => el.classList.remove('reveal', 'in'), 1400);
    }), { threshold: 0.12 });
    els.forEach((el, i) => { el.style.setProperty('--d', `${(Number(el.dataset.reveal) || 0) * 0.09}s`); el.classList.add('reveal'); io.observe(el); void i; });
    return () => io.disconnect();
  }, []);
  return null;
}
