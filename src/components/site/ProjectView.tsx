import type { CSSProperties } from 'react';
import { LOCALES, UI, t, tl } from '@/lib/i18n';
import type { Lang, Project, SiteData } from '@/lib/types';
import { COLOR_VARS, doorArt, projectChips, projectDate, projectVisual } from '@/lib/view';
import { Footer, Topbar, navLinks } from './SiteView';
import Hand from './Hand';

export default function ProjectView({ data, lang, project: p }: { data: SiteData; lang: Lang; project: Project }) {
  const ui = UI[lang];
  const door = data.doors.find(d => p.doors.includes(d.id)) || data.doors[0];
  const c = COLOR_VARS[door?.color ?? 'ruby'];
  const art = doorArt(door?.style ?? 'ai');
  const paths = Object.fromEntries(LOCALES.map(l => [l, `/${l}/projects/${p.slug}`])) as Record<Lang, string>;
  const body = (t(p.body, lang) || t(p.summary, lang)).split(/\n\s*\n/).filter(Boolean);
  const built = tl(p.contribution, lang);
  const kind = projectVisual(p);
  const title = t(p.title, lang);
  const links = navLinks(data, lang).map(l => ({ ...l, href: `/${lang}${l.href}` }));
  return (
    <>
      <Topbar data={data} lang={lang} paths={paths} links={links} />
      <main className="proj" style={{ '--c': `var(${c.glass})`, '--c-text': `var(${c.text})` } as CSSProperties}>
        <section className={`proj-hero${kind === 'none' ? ' solo' : ''}`}>
          <div className="wrap">
            <div className="head">
              <a className="back" href={`/${lang}#door-${door?.id ?? ''}`}>{ui.allProjects}</a>
              <div className="chips">
                {projectChips(p, lang).map(x => <span key={x} className="chip">{x}</span>)}
                {projectDate(p, lang) && <span className="chip plain">{projectDate(p, lang)}</span>}
              </div>
              <h1>{title}</h1>
              {t(p.tagline, lang) && <p className="tagline">{t(p.tagline, lang)}</p>}
              <div className="links" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                {p.repo_url && <a href={p.repo_url} target="_blank" rel="noopener noreferrer">{ui.code}</a>}
                {p.demo_url && <a href={p.demo_url} target="_blank" rel="noopener noreferrer">{ui.demo}</a>}
              </div>
            </div>
            {kind === 'hand' && <div className="visual diagram" aria-hidden="true" style={{ minHeight: 320 }}><Hand /><small className="ltr">21 × (x, y, z) → 28</small></div>}
            {kind === 'arch' && (
              <div className="visual" aria-hidden="true" style={{ minHeight: 320 }}>
                <div className="device archway"><div className="screen"><img className="art" src={art.qamariya} width={320} height={160} alt="" /><b>{title}</b></div></div>
              </div>
            )}
            {kind === 'image' && <figure className="visual pic"><a href={p.cover_url!} target="_blank" rel="noopener"><img src={p.cover_url!} alt={title} /></a></figure>}
            {(kind === 'phone' || kind === 'monitor') && (
              <figure className="visual" style={{ minHeight: 320 }}>
                <a className={`device ${kind}`} href={p.cover_url!} target="_blank" rel="noopener"><span className="screen"><img className="shot" src={p.cover_url!} alt={title} /></span></a>
              </figure>
            )}
          </div>
        </section>
        <div className="wrap proj-body">
          <div className="prose">
            <h2>{ui.problem}</h2>
            {body.map((x, i) => <p key={i}>{x}</p>)}
            {built.length > 0 && <><h2>{ui.whatIBuilt}</h2><ul className="bullets">{built.map(b => <li key={b}>{b}</li>)}</ul></>}
            {p.gallery.length > 0 && <div className="gallery">{p.gallery.map((g, i) => <a key={g} href={g} target="_blank" rel="noopener"><img src={g} alt={`${title} (${i + 1})`} loading="lazy" decoding="async" /></a>)}</div>}
          </div>
          <aside className="proj-side">
            {p.metrics.length > 0 && (
              <div><h2>{ui.results}</h2><div className="metrics" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>{p.metrics.map(m => <div key={t(m.label, 'en')} className="metric"><b className="ltr">{t(m.value, lang)}</b><span>{t(m.label, lang)}</span></div>)}</div></div>
            )}
            {p.stack.length > 0 && <div><h2>{ui.stack}</h2><ul className="stack">{p.stack.map(s => <li key={s}>{s}</li>)}</ul></div>}
            {p.team && <div><h2>{ui.team}</h2><p style={{ color: 'var(--muted)' }}>{t(p.team, lang)}</p></div>}
          </aside>
        </div>
      </main>
      <Footer data={data} lang={lang} />
    </>
  );
}
