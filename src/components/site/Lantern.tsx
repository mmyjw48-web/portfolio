'use client';
import { useEffect, useRef, useState } from 'react';

const isNight = () => getComputedStyle(document.documentElement).getPropertyValue('--glow').trim() === '1';

/** The hanging lantern: pull it to switch between day and night. The choice is remembered on this device. */
export default function Lantern({ toDay, toNight }: { toDay: string; toNight: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [night, setNight] = useState<boolean | null>(null);
  useEffect(() => { setNight(isNight()); }, []);

  const pull = () => {
    const b = ref.current; if (!b) return;
    b.classList.remove('pull'); void b.offsetWidth; b.classList.add('pull');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      const next = !isNight();
      const r = document.documentElement;
      r.classList.toggle('sky-night', next); r.classList.toggle('sky-day', !next);
      try { localStorage.setItem('sky', next ? 'night' : 'day'); } catch { /* storage may be blocked */ }
      setNight(next);
    }, reduce ? 0 : 220);
    setTimeout(() => b.classList.remove('pull'), 800);
  };

  return (
    <button ref={ref} className="lantern" type="button" onClick={pull} aria-label={night ? toDay : toNight}>
      <svg viewBox="0 0 52 150" aria-hidden="true">
        <defs>
          <radialGradient id="lanternHalo"><stop offset="0" stopColor="#F2B23A" stopOpacity="0.75" /><stop offset="1" stopColor="#F2B23A" stopOpacity="0" /></radialGradient>
        </defs>
        <g stroke="var(--brass)" strokeWidth="2" fill="none">
          <line x1="26" y1="0" x2="26" y2="58" />
          <ellipse cx="26" cy="12" rx="2.5" ry="4" /><ellipse cx="26" cy="26" rx="2.5" ry="4" /><ellipse cx="26" cy="40" rx="2.5" ry="4" />
        </g>
        <circle className="halo" cx="26" cy="100" r="30" fill="url(#lanternHalo)" />
        <path d="M26 56 L36 70 H16 Z" fill="var(--brass)" />
        <rect x="13" y="70" width="26" height="4" rx="1" fill="var(--brass)" />
        <path className="glass" d="M15 74 H37 L40 112 Q26 122 12 112 Z" />
        <g stroke="var(--brass)" strokeWidth="1.6" fill="none"><path d="M15 74 L12 112 M37 74 L40 112 M26 74 V118 M13.5 93 H38.5" /></g>
        <path d="M12 112 Q26 124 40 112 L36 122 H16 Z" fill="var(--brass)" />
        <path d="M22 122 H30 L26 134 Z" fill="var(--brass)" />
        <circle cx="26" cy="138" r="3" fill="var(--brass)" />
      </svg>
    </button>
  );
}
