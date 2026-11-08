'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { RoomVM, CardVM } from '@/lib/view';
import Hand from './Hand';

interface Labels { hint: string; hintTouch: string; clickEnter: string; back: string; details: string }
interface Props { rooms: RoomVM[]; labels: Labels; kufi: string; eyebrow: string; title: string }

function Visual({ card, room }: { card: CardVM; room: RoomVM }) {
  const v = card.visual;
  if (v.kind === 'arch') {
    return (
      <div className="visual" aria-hidden="true">
        <div className="device archway"><div className="screen">
          <img className="art" src={room.art.qamariya} width={320} height={160} alt="" loading="lazy" />
          <b lang="ar">{room.nameAr}</b><small>{v.sub}</small>
        </div></div>
      </div>
    );
  }
  const device = v.kind === 'hand' ? 'phone' : v.kind;
  return (
    <div className="visual" aria-hidden="true">
      <div className={`device ${device}`}><div className="screen">
        {v.image ? <img className="shot" src={v.image} alt="" loading="lazy" /> : v.kind === 'hand' ? <Hand /> : <img className="art" src={room.art.qamariya} width={320} height={160} alt="" loading="lazy" />}
        {!v.image && <><b>{v.title}</b><small>{v.kind === 'hand' ? '21 × (x, y, z) → 28' : v.sub}</small></>}
      </div></div>
    </div>
  );
}

function Card({ card, room, i, labels }: { card: CardVM; room: RoomVM; i: number; labels: Labels }) {
  return (
    <article className="card" style={{ '--i': i } as CSSProperties}>
      <div className="card-main">
        <div className="chips">
          {card.chips.map(c => <span key={c} className="chip">{c}</span>)}
          {card.date && <span className="chip plain">{card.date}</span>}
        </div>
        <h3>{card.title}</h3>
        {card.org && <p className="org">{card.org}</p>}
        {card.tagline && <p className="tagline">{card.tagline}</p>}
        {card.desc && <p className="desc">{card.desc}</p>}
        {card.metrics.length > 0 && (
          <div className="metrics">{card.metrics.map(m => <div key={m.label} className="metric"><b className="ltr">{m.value}</b><span>{m.label}</span></div>)}</div>
        )}
        {card.stack.length > 0 && <ul className="stack">{card.stack.map(s => <li key={s}>{s}</li>)}</ul>}
        {(card.links.length > 0 || card.details) && (
          <p className="links" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {card.details && <a href={card.details}>{labels.details}</a>}
            {card.links.map(l => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
          </p>
        )}
      </div>
      <Visual card={card} room={room} />
    </article>
  );
}

const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const rectInset = (r: DOMRect) => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 4px)`;

export default function Doors({ rooms, labels, kufi, eyebrow, title }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const doorRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animateIn = useRef(false);
  const [canHover, setCanHover] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [peek, setPeek] = useState({ x: 0, y: 0, show: false });
  const [opening, setOpening] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => { setCanHover(matchMedia('(hover: hover) and (pointer: fine)').matches); }, []);

  /* ---- focus mode ---- */
  const place = useCallback((id: string) => {
    const stage = stageRef.current, btn = doorRefs.current[id], pk = peekRef.current;
    if (!stage || !btn || !pk) return;
    const sr = stage.getBoundingClientRect(), ir = btn.getBoundingClientRect(), pw = pk.offsetWidth, gap = 28;
    const x = sr.right - ir.right >= ir.left - sr.left ? ir.right - sr.left + gap : ir.left - sr.left - pw - gap;
    setPeek({ x: Math.round(x), y: Math.round(Math.max(0, ir.top - sr.top + ir.height * 0.3)), show: true });
  }, []);
  const enter = (id: string) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setFocus(id); place(id);
  };
  const leave = () => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => { setFocus(null); setPeek(p => ({ ...p, show: false })); }, 160);
  };

  /* ---- rooms ---- */
  const open = useCallback(async (id: string, animate = true) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setFocus(null); setPeek(p => ({ ...p, show: false }));
    setOpening(id);
    animateIn.current = animate && !reduced();
    if (animateIn.current) await new Promise(r => setTimeout(r, 260));
    setOpenId(id);
    if (location.hash !== `#door-${id}`) history.replaceState(null, '', `#door-${id}`);
  }, []);

  const close = useCallback(async () => {
    const room = roomRef.current, id = openId; if (!room || !id) return;
    const light = doorRefs.current[id]?.querySelector('.light');
    if (!reduced() && light) {
      await room.animate([{ clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: rectInset(light.getBoundingClientRect()) }], { duration: 560, easing: 'cubic-bezier(.6,0,.3,1)' }).finished.catch(() => {});
    }
    setOpenId(null); setOpening(null);
    history.replaceState(null, '', '#projects');
    doorRefs.current[id]?.focus({ preventScroll: true });
  }, [openId]);

  // play the zoom through the doorway once the room has rendered
  useLayoutEffect(() => {
    const room = roomRef.current; if (!openId || !room) return;
    document.body.classList.add('room-open');
    room.scrollTop = 0;
    const light = doorRefs.current[openId]?.querySelector('.light');
    if (animateIn.current && light) {
      room.animate([{ clipPath: rectInset(light.getBoundingClientRect()) }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: 720, easing: 'cubic-bezier(.7,0,.2,1)' });
      room.querySelector('.room-inner')?.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 480, easing: 'ease-out', fill: 'backwards' });
    }
    (room.querySelector('.room-top button') as HTMLButtonElement | null)?.focus({ preventScroll: true });
    return () => { document.body.classList.remove('room-open'); };
  }, [openId]);

  // stacked cards: measure, then shrink/dim each card as the next one slides over it
  useEffect(() => {
    const room = roomRef.current; if (!openId || !room) return;
    let raf = 0;
    const cards = () => Array.from(room.querySelectorAll<HTMLElement>('.card'));
    const setup = () => {
      const usable = room.clientHeight;
      cards().forEach(c => {
        c.classList.remove('no-stick');
        const top = parseFloat(getComputedStyle(c).top) || 0;
        c.dataset.top = String(top);
        if (reduced() || c.offsetHeight > usable - top - 16) c.classList.add('no-stick');
        c.style.transform = ''; c.style.setProperty('--dim', '0');
      });
      update();
    };
    const update = () => {
      raf = 0;
      const rt = room.getBoundingClientRect().top, list = cards();
      list.forEach((c, i) => {
        const next = list[i + 1];
        if (!next || c.classList.contains('no-stick')) { c.style.transform = ''; c.style.setProperty('--dim', '0'); return; }
        const p = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - rt - Number(c.dataset.top)) / c.offsetHeight));
        c.style.transform = `scale(${(1 - 0.06 * p).toFixed(4)})`;
        c.style.setProperty('--dim', (0.55 * p).toFixed(3));
      });
    };
    const onScroll = () => { if (!raf && !reduced()) raf = requestAnimationFrame(update); };
    setup();
    room.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', setup);
    return () => { room.removeEventListener('scroll', onScroll); removeEventListener('resize', setup); cancelAnimationFrame(raf); };
  }, [openId]);

  // deep links (#door-ai), browser back/forward, and Escape
  const closeRef = useRef(close); closeRef.current = close;
  const openRef = useRef(open); openRef.current = open;
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#door-([a-z0-9-]+)$/);
      if (m && rooms.some(r => r.id === m[1])) openRef.current(m[1], false);
    };
    fromHash();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    addEventListener('hashchange', fromHash); addEventListener('keydown', onKey);
    return () => { removeEventListener('hashchange', fromHash); removeEventListener('keydown', onKey); };
  }, [rooms]);

  const room = rooms.find(r => r.id === openId);
  const peekRoom = rooms.find(r => r.id === focus);

  return (
    <section className="doors" id="projects" aria-labelledby="doors-h">
      <div className="wrap">
        <div className="doors-head" data-reveal="0">
          <span className="kufi" lang="ar">{kufi}</span>
          <span className="label">{eyebrow}</span>
          <h2 id="doors-h">{title}</h2>
          <p>{canHover ? labels.hint : labels.hintTouch}</p>
        </div>
        <div className="doors-stage" ref={stageRef}>
          <div className={`doors-grid${focus ? ' has-focus' : ''}`}>
            {rooms.map((r, i) => (
              <div key={r.id} className={`door-item${focus === r.id ? ' is-focus' : ''}`} style={{ '--c': `var(${r.glass})` } as CSSProperties} data-reveal={i + 1}
                onPointerEnter={canHover ? () => enter(r.id) : undefined} onPointerLeave={canHover ? leave : undefined}
                onFocus={e => { if ((e.target as HTMLElement).matches(':focus-visible')) enter(r.id); }} onBlur={leave}>
                <button ref={el => { doorRefs.current[r.id] = el; }} className={`door${opening === r.id ? ' is-opening' : ''}`} type="button"
                  style={{ '--c': `var(${r.glass})` } as CSSProperties} aria-label={r.enterLabel} onClick={() => open(r.id)}>
                  <span className="light" aria-hidden="true" />
                  <img className="leaf" src={r.art.leaf} width={300} height={485} alt="" loading="lazy" decoding="async" />
                  <img className="qwin" src={r.art.qamariya} width={320} height={160} alt="" loading="lazy" decoding="async" />
                  <img className="frame" src={r.art.frame} width={460} height={828} alt="" loading="lazy" decoding="async" />
                </button>
                <span className="tick" aria-hidden="true" />
                <span className="door-name">{r.name}</span>
                <span className="door-count label">{r.countLabel}</span>
              </div>
            ))}
          </div>
          <div ref={peekRef} className={`peek${peek.show ? ' show' : ''}`} aria-hidden="true"
            style={{ '--x': `${peek.x}px`, '--y': `${peek.y}px`, '--c': peekRoom ? `var(${peekRoom.glass})` : undefined } as CSSProperties}>
            {peekRoom && (
              <div className="peek-body" key={peekRoom.id}>
                <span className="kufi" lang="ar">{peekRoom.nameAr}</span>
                <h3>{peekRoom.name}</h3>
                <p>{peekRoom.intro}</p>
                <ul>{peekRoom.cards.map(c => <li key={c.key}>{c.title}{c.chips[0] ? <span> {c.chips[0]}</span> : null}</li>)}</ul>
                <span className="label">{labels.clickEnter}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {room && mounted && createPortal(
        <div ref={roomRef} className="room" role="dialog" aria-modal="true" aria-labelledby="room-h"
          style={{ '--c': `var(${room.glass})`, '--c-text': `var(${room.text})` } as CSSProperties}>
          <div className="room-light" aria-hidden="true" />
          <div className="room-bar">
            <div className="wrap room-top">
              <button className="btn" type="button" onClick={close}><span className="ar flip-x" aria-hidden="true">←</span> <span>{labels.back}</span></button>
              <span className="label">{room.countLabel}</span>
            </div>
          </div>
          <div className="wrap room-inner">
            <div className="room-head">
              <span className="kufi" lang="ar">{room.nameAr}</span>
              <h2 id="room-h">{room.name}</h2>
              <p>{room.intro}</p>
            </div>
            <div className="cards">{room.cards.map((c, i) => <Card key={c.key} card={c} room={room} i={i} labels={labels} />)}</div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
