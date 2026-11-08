import type { CSSProperties, ReactNode } from 'react';
import { CATEGORY, KUFI, LANG_SHORT, LOCALES, UI, formatDate, formatRange, monthName, t, tl } from '@/lib/i18n';
import type { Lang, SectionKey, SiteData } from '@/lib/types';
import { buildRooms, buildStory } from '@/lib/view';
import Clock from './Clock';
import Lantern from './Lantern';
import Notepad from './Notepad';
import HeroStage from './HeroStage';
import Doors from './Doors';
import Story from './Story';
import ContactForm from './ContactForm';
import CopyButton from './CopyButton';
import Reveal from './Reveal';
import { skylineSVG } from './skyline';

type UIL = (typeof UI)['en'];

export function Topbar({ data, lang, paths, links }: { data: SiteData; lang: Lang; paths: Record<Lang, string>; links: { href: string; label: string }[] }) {
  const ui = UI[lang] as UIL;
  return (
    <header className="topbar">
      <div className="wrap">
        <a className="brand" href={`/${lang}`}><b>{data.profile.name.en || t(data.profile.name, lang)}</b><span lang="ar">{data.profile.name.ar}</span></a>
        <nav className="nav" aria-label="Sections">{links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}</nav>
        <div className="tools">
          <Clock city={ui.clockCity} />
          <div className="langs" role="group" aria-label={ui.language}>
            {LOCALES.map(l => <a key={l} href={paths[l]} lang={l} hrefLang={l} aria-current={l === lang ? 'true' : undefined}>{LANG_SHORT[l]}</a>)}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer({ data, lang, preview }: { data: SiteData; lang: Lang; preview?: boolean }) {
  const ui = UI[lang] as UIL;
  return (
    <>
      <footer className="footer">
        <div className="wrap">
          <span className="label">© {new Date().getFullYear()} {t(data.profile.name, lang)} · {ui.rights}</span>
          <nav aria-label="Links">
            {data.profile.linkedin_url && <a className="label" href={data.profile.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {data.profile.github_url && <a className="label" href={data.profile.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>}
          </nav>
        </div>
      </footer>
      {preview && <div className="preview-flag">{ui.preview}</div>}
      <Reveal />
    </>
  );
}

function SecHead({ k, title, subtitle }: { k: SectionKey; title: string; subtitle: string }) {
  return (
    <div className="sec-head" data-reveal="0">
      <span className="kufi" lang="ar">{KUFI[k]}</span>
      <span className="label">{title}</span>
      <h2 id={`${k}-h`}>{subtitle || title}</h2>
    </div>
  );
}

function Section({ k, alt, title, subtitle, children }: { k: SectionKey; alt?: boolean; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className={`sec${alt ? ' alt' : ''}`} id={k} aria-labelledby={`${k}-h`}>
      <div className="wrap"><SecHead k={k} title={title} subtitle={subtitle} />{children}</div>
    </section>
  );
}

function Hero({ data, lang }: { data: SiteData; lang: Lang }) {
  const ui = UI[lang] as UIL;
  const p = data.profile;
  const featured = data.projects.find(x => x.featured && x.metrics.length) || data.projects.find(x => x.metrics.length);
  return (
    <section className="hero" id="home" aria-labelledby="hi">
      <Lantern toDay={ui.toDay} toNight={ui.toNight} />
      <div className="wrap hero-grid">
        <div className="hero-text">
          {p.available && <p className="status label"><i aria-hidden="true" /><span>{t(p.status, lang)}</span></p>}
          <h1 id="hi">{t(p.greeting, lang)}</h1>
          <div className="ibuild">
            <span>{t(p.build_label, lang)}</span>
            <Notepad roles={tl(p.roles, lang)} />
          </div>
          <p className="lead">{t(p.lead, lang)}</p>
          <div className="actions">
            <a className="btn primary" href="#projects">{ui.openDoors} <span className="ar" aria-hidden="true">↓</span></a>
            {p.whatsapp && <a className="btn" href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp <span className="ar flip-x" aria-hidden="true">↗</span></a>}
            {p.email && <a className="btn" href="#contact">{ui.email}</a>}
            {p.cv_url && <a className="btn" href={p.cv_url} target="_blank" rel="noopener noreferrer">{ui.cv}</a>}
          </div>
        </div>
        <HeroStage label={t(p.name, lang)}>
          <span className="halo" aria-hidden="true" />
          <div className="archset" aria-hidden="true">
            <img className="qam" src="/images/hero/qamariya-hero.webp" width={800} height={400} alt="" decoding="async" fetchPriority="high" />
            <img className="arch" src="/images/hero/hero-arch.webp" width={800} height={1000} alt="" decoding="async" fetchPriority="high" />
            <svg className="trace-svg" viewBox="0 0 400 500" focusable="false"><path className="trace" pathLength={1} d="M34 500 V210 A166 166 0 0 1 366 210 V500" /></svg>
          </div>
          {p.photo_url && <img className="portrait" src={p.photo_url} width={760} height={1038} alt={t(p.name, lang)} decoding="async" fetchPriority="high" />}
          {featured && (
            <div className="sticker"><b>{t(featured.title, lang)}</b><span>{t(featured.metrics[0].value, lang)} {t(featured.metrics[0].label, lang)}</span></div>
          )}
        </HeroStage>
      </div>
      <div className="strip">
        <div className="wrap">
          <span className="label"><i className="dot" aria-hidden="true" />{ui.available}</span>
          <span className="label">{t(p.location, lang)} · UTC+7</span>
          <a className="label" href="#projects" style={{ textDecoration: 'none' }}>{ui.scrollDoors} ↓</a>
        </div>
      </div>
    </section>
  );
}

function About({ data, lang, head }: { data: SiteData; lang: Lang; head: Head }) {
  const ui = UI[lang] as UIL;
  const p = data.profile;
  const paras = t(p.about, lang).split(/\n\s*\n/).filter(Boolean);
  const facts = tl(p.facts, lang), langs = tl(p.languages, lang);
  return (
    <Section k="about" {...head}>
      <div className="about-grid">
        <div className="about-text" data-reveal="1">{paras.map((x, i) => <p key={i}>{x}</p>)}</div>
        <aside className="arch-card facts" data-reveal="2">
          {facts.length > 0 && <><span className="label">{ui.facts}</span><ul>{facts.map(f => <li key={f}><span className="qdot" aria-hidden="true" />{f}</li>)}</ul></>}
          {langs.length > 0 && <><hr /><span className="label">{ui.languages}</span><ul>{langs.map(f => <li key={f}><span className="qdot" aria-hidden="true" />{f}</li>)}</ul></>}
          {p.cv_url && <a className="btn primary" href={p.cv_url} target="_blank" rel="noopener noreferrer">{ui.cv}</a>}
        </aside>
      </div>
    </Section>
  );
}

function Experience({ data, lang, head }: { data: SiteData; lang: Lang; head: Head }) {
  const ui = UI[lang] as UIL;
  return (
    <Section k="experience" {...head}>
      <ol className="xp-list">
        {data.experiences.map((e, i) => (
          <li key={e.id} className={`xp${e.is_current ? ' current' : ''}`} data-reveal={i + 1}>
            <span className="when">{formatRange(e.start_date, e.end_date, e.date_precision, lang, { current: e.is_current })}</span>
            <div className="xp-body">
              <h3>{t(e.title, lang)}</h3>
              <p className="org">{[t(e.org, lang), t(e.location, lang)].filter(Boolean).join(' · ')}</p>
              <div className="chips">
                {e.is_current && <span className="chip">{ui.current}</span>}
                {t(e.employment_type, lang) && <span className="chip plain">{t(e.employment_type, lang)}</span>}
              </div>
              {t(e.summary, lang) && <p className="desc" style={{ color: 'var(--muted)' }}>{t(e.summary, lang)}</p>}
              {tl(e.bullets, lang).length > 0 && <ul className="bullets">{tl(e.bullets, lang).map(b => <li key={b}>{b}</li>)}</ul>}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Leadership({ data, lang, head }: { data: SiteData; lang: Lang; head: Head }) {
  const ui = UI[lang] as UIL;
  return (
    <Section k="leadership" {...head}>
      <ul className="act-list">
        {data.activities.map(a => (
          <li key={a.id} className="act" data-reveal="1">
            <span className="when">{formatRange(a.start_date, a.end_date, a.date_precision, lang)}</span>
            <div className="act-main">
              <h3>{t(a.title, lang)}</h3>
              <p className="meta">{[t(a.role, lang), t(a.org, lang), t(a.location, lang)].filter(Boolean).join(' · ')}</p>
              {t(a.summary, lang) && <p>{t(a.summary, lang)}</p>}
            </div>
            <div className="act-side">
              <span className="chip">{t(CATEGORY[a.category], lang)}</span>
              {a.image_url && <a className="thumb-link" href={a.image_url} target="_blank" rel="noopener noreferrer">{ui.viewCertificate}</a>}
              {a.link && <a className="thumb-link" href={a.link} target="_blank" rel="noopener noreferrer">{ui.open} ↗</a>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Achievements({ data, lang, head }: { data: SiteData; lang: Lang; head: Head }) {
  const ui = UI[lang] as UIL;
  const awards = data.achievements.filter(a => a.kind === 'award');
  const certs = data.achievements.filter(a => a.kind !== 'award');
  return (
    <Section k="achievements" {...head}>
      {awards.length > 0 && (
        <>
          <h3 className="sub-title">{ui.awards}</h3>
          <div className="awards">
            {awards.map((a, i) => (
              <article key={a.id} className="arch-card award" data-reveal={i + 1}>
                <span className="medal" aria-hidden="true"><img src="/images/doors/qamariya-leadership.webp" width={320} height={160} alt="" loading="lazy" /></span>
                <h3>{t(a.title, lang)}</h3>
                <p className="meta">{[t(a.issuer, lang), formatDate(a.date, a.date_precision, lang)].filter(Boolean).join(' · ')}</p>
                {a.credential_id && <p className="cred label">{a.credential_id}</p>}
                {(a.image_url || a.credential_url) && <a className="thumb-link" href={a.credential_url || a.image_url!} target="_blank" rel="noopener noreferrer">{ui.viewCertificate}</a>}
              </article>
            ))}
          </div>
        </>
      )}
      {certs.length > 0 && (
        <>
          <h3 className="sub-title">{ui.certificates}</h3>
          <ul className="cert-list">
            {certs.map(c => (
              <li key={c.id} className="cert" data-reveal="1">
                <span className="ph">{c.image_url ? <img src={c.image_url} alt="" loading="lazy" /> : <span aria-hidden="true">ش</span>}</span>
                <div>
                  <h4>{t(c.title, lang)}</h4>
                  <p className="meta">{[t(c.issuer, lang), formatDate(c.date, c.date_precision, lang)].filter(Boolean).join(' · ')}</p>
                  {c.credential_id && <p className="cred">{ui.credential}: {c.credential_id}</p>}
                </div>
                {(c.image_url || c.credential_url) ? <a className="thumb-link" href={c.credential_url || c.image_url!} target="_blank" rel="noopener noreferrer">{ui.viewCertificate}</a> : <span />}
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

function Skills({ data, lang, head }: { data: SiteData; lang: Lang; head: Head }) {
  const ui = UI[lang] as UIL;
  const groups = data.skillGroups.map(g => ({ g, items: data.skills.filter(s => s.group_id === g.id) })).filter(x => x.items.length);
  return (
    <Section k="skills" {...head}>
      <div className="skill-legend" aria-hidden="true"><span><i />{ui.demonstrated}</span><span><i className="dash" />{ui.learning}</span></div>
      <div className="skill-rows">
        {groups.map(({ g, items }) => (
          <div key={g.id} className="skill-row" data-reveal="1">
            <h3>{t(g.name, lang)}</h3>
            <ul className="tags">{items.map(s => <li key={s.id} className={s.level === 'learning' ? 'learning' : undefined}>{t(s.name, lang)}{s.level === 'learning' && <span className="sr-only"> ({ui.learning})</span>}</li>)}</ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Education({ data, lang, head }: { data: SiteData; lang: Lang; head: Head }) {
  const ui = UI[lang] as UIL;
  return (
    <Section k="education" {...head}>
      <div style={{ display: 'grid', gap: 16 }}>
        {data.education.map(e => (
          <article key={e.id} className="arch-card edu-card" data-reveal="1">
            <div style={{ display: 'grid', gap: 6 }}>
              <h3>{t(e.institution, lang)}</h3>
              <p className="degree">{[t(e.degree, lang), t(e.field, lang)].filter(Boolean).join(', ')}</p>
              <p className="meta">{t(e.location, lang)}</p>
            </div>
            <span className="when">{formatRange(e.start_date, e.end_date, e.date_precision, lang, { expected: e.is_expected })}</span>
            <div className="full">
              {t(e.summary, lang) && <p style={{ color: 'var(--muted)' }}>{t(e.summary, lang)}</p>}
              {tl(e.coursework, lang).length > 0 && <><span className="label">{ui.coursework}</span><ul className="tags">{tl(e.coursework, lang).map(c => <li key={c}>{c}</li>)}</ul></>}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Contact({ data, lang, head }: { data: SiteData; lang: Lang; head: Head }) {
  const ui = UI[lang] as UIL;
  const p = data.profile;
  return (
    <section className="contact" id="contact" aria-labelledby="contact-h">
      <div className="wrap contact-grid">
        <div className="cta-arch" data-reveal="0">
          <span className="label">{head.subtitle || head.title}</span>
          <h2 id="contact-h">{t(p.contact_title, lang)}</h2>
          <p>{t(p.contact_sub, lang)}</p>
        </div>
        <div>
          <ul className="contact-list" data-reveal="1">
            {p.email && <li><span className="label">{ui.email}</span><span className="val ltr">{p.email}</span><CopyButton value={p.email} label={ui.copy} done={ui.copied} /></li>}
            {p.whatsapp && <li><span className="label">WhatsApp</span><span className="val ltr">{p.phone_display || p.whatsapp}</span><a className="mini" href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{ui.message}</a></li>}
            {p.linkedin_url && <li><span className="label">LinkedIn</span><span className="val ltr">{p.linkedin_url.replace(/^https?:\/\/(www\.)?linkedin\.com\//, '').replace(/\/$/, '')}</span><a className="mini" href={p.linkedin_url} target="_blank" rel="noopener noreferrer">{ui.open}</a></li>}
            {p.github_url && <li><span className="label">GitHub</span><span className="val ltr">{p.github_url.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span><a className="mini" href={p.github_url} target="_blank" rel="noopener noreferrer">{ui.open}</a></li>}
          </ul>
          <ContactForm lang={lang} l={{ name: ui.formName, email: ui.formEmail, msg: ui.formMsg, send: ui.formSend, sending: ui.formSending, ok: ui.formOk, missing: ui.formMissing, error: ui.formError }} />
        </div>
      </div>
    </section>
  );
}

interface Head { title: string; subtitle: string; alt?: boolean }

export function navLinks(data: SiteData, lang: Lang) {
  const ui = UI[lang] as UIL;
  const show = new Set(data.sections.filter(s => s.visible).map(s => s.key));
  return (['about', 'projects', 'experience', 'achievements', 'contact'] as const).filter(k => show.has(k)).map(k => ({ href: `#${k}`, label: ui.nav[k] }));
}

export default function SiteView({ data, lang, preview }: { data: SiteData; lang: Lang; preview?: boolean }) {
  const ui = UI[lang] as UIL;
  const rooms = buildRooms(data, lang).filter(r => r.cards.length);
  const story = buildStory(data, lang).map(y => ({
    year: y.year, countLabel: ui.count(y.items.filter(i => i.cat !== 'next').length),
    items: y.items.map(i => ({ cat: i.cat, when: i.month !== null ? monthName(i.month, lang) : '', text: i.text, sub: i.sub }))
  }));
  const has: Record<SectionKey, boolean> = {
    about: !!t(data.profile.about, lang), projects: rooms.length > 0, experience: data.experiences.length > 0, leadership: data.activities.length > 0,
    achievements: data.achievements.length > 0, skills: data.skills.length > 0, education: data.education.length > 0, story: story.length > 0, contact: true
  };
  const paths = Object.fromEntries(LOCALES.map(l => [l, `/${l}${preview ? '/preview' : ''}`])) as Record<Lang, string>;
  let plain = 0;
  const body = data.sections.filter(s => s.visible && has[s.key]).map(s => {
    const head: Head = { title: t(s.title, lang), subtitle: t(s.subtitle, lang) };
    switch (s.key) {
      case 'projects':
        return <Doors key={s.key} rooms={rooms} kufi={KUFI.projects} eyebrow={head.title} title={head.subtitle}
          labels={{ hint: ui.hint, hintTouch: ui.hintTouch, clickEnter: ui.clickEnter, back: ui.back, details: ui.details }} />;
      case 'story':
        return <Story key={s.key} years={story} eyebrow={head.title} title={head.subtitle} skyline={skylineSVG()}
          legend={(['ai', 'mobile', 'web', 'lead', 'learn'] as const).map(c => ({ cat: c, label: ui.legend[c] }))} />;
      case 'contact': return <Contact key={s.key} data={data} lang={lang} head={head} />;
      default: {
        head.alt = plain++ % 2 === 1;
        const C = { about: About, experience: Experience, leadership: Leadership, achievements: Achievements, skills: Skills, education: Education }[s.key];
        return <C key={s.key} data={data} lang={lang} head={head} />;
      }
    }
  });

  const p = data.profile;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Person', name: p.name.en, alternateName: p.name.ar,
    jobTitle: 'Information Technology student', email: p.email ? `mailto:${p.email}` : undefined,
    affiliation: data.education[0] ? { '@type': 'CollegeOrUniversity', name: data.education[0].institution.en } : undefined,
    sameAs: [p.linkedin_url, p.github_url].filter(Boolean), knowsLanguage: ['ar', 'id', 'en']
  };

  return (
    <>
      <Topbar data={data} lang={lang} paths={paths} links={navLinks(data, lang)} />
      <main>
        <Hero data={data} lang={lang} />
        {body}
      </main>
      <Footer data={data} lang={lang} preview={preview} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}

export type { CSSProperties };
