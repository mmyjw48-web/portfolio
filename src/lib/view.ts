import { STATUS, UI, formatDate, formatRange, t, tl, yearOf } from './i18n';
import type { DoorColor, DoorStyle, Lang, SiteData, Project } from './types';

export const COLOR_VARS: Record<DoorColor, { glass: string; text: string }> = {
  ruby: { glass: '--g-ruby', text: '--ruby' },
  cobalt: { glass: '--g-cobalt', text: '--cobalt' },
  emerald: { glass: '--g-emerald', text: '--emerald' },
  saffron: { glass: '--g-saffron', text: '--saffron' },
  turquoise: { glass: '--g-turquoise', text: '--turquoise' },
  violet: { glass: '--g-violet', text: '--violet' }
};

export const doorArt = (style: DoorStyle) => ({
  leaf: `/images/doors/door-${style}-leaf.webp`,
  frame: `/images/doors/door-${style}-frame.webp`,
  qamariya: `/images/doors/qamariya-${style}.webp`
});

export interface CardVM {
  key: string;
  title: string;
  org?: string;
  chips: string[];
  date?: string;
  tagline?: string;
  desc: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  links: { href: string; label: string }[];
  details?: string;
  visual: { kind: 'hand' | 'phone' | 'monitor' | 'arch'; image?: string; title: string; sub: string };
}

export interface RoomVM {
  id: string;
  name: string;
  nameAr: string;
  intro: string;
  glass: string;
  text: string;
  art: ReturnType<typeof doorArt>;
  cards: CardVM[];
  countLabel: string;
  enterLabel: string;
}

export function projectDate(p: Project, lang: Lang) {
  return formatRange(p.start_date, p.end_date, p.date_precision, lang);
}

export function projectChips(p: Project, lang: Lang): string[] {
  return [p.award ? t(p.award, lang) : t(STATUS[p.status], lang), p.team ? t(p.team, lang) : ''].filter(Boolean);
}

export function buildRooms(data: SiteData, lang: Lang): RoomVM[] {
  const ui = UI[lang];
  return data.doors.map(door => {
    const c = COLOR_VARS[door.color] ?? COLOR_VARS.ruby;
    let cards: CardVM[] = [];
    if (door.kind === 'leadership') {
      const xp = data.experiences.filter(e => e.in_door).map<CardVM>(e => ({
        key: e.id, title: t(e.title, lang), org: t(e.org, lang),
        chips: [e.is_current ? ui.current : '', t(e.employment_type, lang)].filter(Boolean),
        date: formatRange(e.start_date, e.end_date, e.date_precision, lang, { current: e.is_current }),
        desc: t(e.summary, lang) || tl(e.bullets, lang).join(' · '),
        metrics: [], stack: [], links: [],
        visual: { kind: 'arch', title: t(e.title, lang), sub: t(e.org, lang) }
      }));
      const acts = data.activities.filter(a => a.in_door).map<CardVM>(a => ({
        key: a.id, title: t(a.title, lang), org: t(a.org, lang),
        chips: [t(a.role, lang)].filter(Boolean),
        date: [formatRange(a.start_date, a.end_date, a.date_precision, lang), t(a.location, lang)].filter(Boolean).join(' · '),
        desc: t(a.summary, lang), metrics: [], stack: [],
        links: a.link ? [{ href: a.link, label: ui.open + ' ↗' }] : [],
        visual: { kind: 'arch', image: a.image_url || undefined, title: t(a.title, lang), sub: t(a.org, lang) }
      }));
      cards = [...xp, ...acts];
    } else {
      cards = data.projects.filter(p => p.doors.includes(door.id)).map<CardVM>(p => {
        const kind = p.visual === 'hand' ? 'hand' : p.visual === 'monitor' ? 'monitor' : p.visual === 'phone' ? 'phone' : p.visual === 'arch' ? 'arch' : door.style === 'web' ? 'monitor' : 'phone';
        const links = [
          p.repo_url ? { href: p.repo_url, label: ui.code } : null,
          p.demo_url ? { href: p.demo_url, label: ui.demo } : null
        ].filter(Boolean) as CardVM['links'];
        return {
          key: p.id, title: t(p.title, lang), chips: projectChips(p, lang), date: projectDate(p, lang),
          tagline: t(p.tagline, lang), desc: t(p.summary, lang),
          metrics: p.metrics.map(m => ({ value: t(m.value, lang), label: t(m.label, lang) })),
          stack: p.stack, links, details: `/${lang}/projects/${p.slug}`,
          visual: { kind, image: p.cover_url || undefined, title: t(p.title, lang), sub: t(STATUS[p.status], lang) }
        };
      });
    }
    return {
      id: door.id, name: t(door.name, lang), nameAr: door.name.ar || t(door.name, lang), intro: t(door.intro, lang),
      glass: c.glass, text: c.text, art: doorArt(door.style), cards,
      countLabel: ui.count(cards.length), enterLabel: ui.enter(t(door.name, lang))
    };
  });
}

export type StoryCat = 'ai' | 'mobile' | 'web' | 'lead' | 'learn' | 'next';
export interface StoryEntry { cat: StoryCat; month: number | null; text: string; sub?: string; date: string }
export interface StoryYear { year: number; items: StoryEntry[] }

const styleCat: Record<DoorStyle, StoryCat> = { ai: 'ai', mobile: 'mobile', web: 'web', leadership: 'lead' };

export function buildStory(data: SiteData, lang: Lang): StoryYear[] {
  const items: (StoryEntry & { y: number })[] = [];
  const push = (date: string | null, precision: string, cat: StoryCat, text: string, sub?: string) => {
    const y = yearOf(date); if (!y || !text) return;
    items.push({ y, date: date!, cat, text, sub, month: precision === 'year' ? null : Number(date!.slice(5, 7)) - 1 });
  };
  const doorStyle = new Map(data.doors.map(d => [d.id, d.style]));
  for (const p of data.projects) if (p.in_story) push(p.start_date, p.date_precision, styleCat[doorStyle.get(p.doors[0]) ?? 'ai'] ?? 'ai', t(p.story_text, lang) || t(p.title, lang));
  for (const e of data.experiences) if (e.in_story) push(e.start_date, e.date_precision, 'lead', t(e.story_text, lang) || t(e.title, lang));
  for (const a of data.activities) if (a.in_story) push(a.start_date, a.date_precision, 'lead', t(a.story_text, lang) || t(a.title, lang));
  for (const a of data.achievements) if (a.in_story) push(a.date, a.date_precision, 'learn', t(a.story_text, lang) || t(a.title, lang), t(a.issuer, lang));
  for (const e of data.education) if (e.in_story) push(e.start_date, e.date_precision, 'learn', t(e.story_text, lang) || t(e.institution, lang));

  const years = new Map<number, StoryEntry[]>();
  items.sort((a, b) => (a.date < b.date ? 1 : -1)).forEach(i => {
    if (!years.has(i.y)) years.set(i.y, []);
    years.get(i.y)!.push({ cat: i.cat, month: i.month, text: i.text, sub: i.sub, date: i.date });
  });
  const out = [...years.entries()].sort((a, b) => b[0] - a[0]).map(([year, list]) => ({ year, items: list }));
  const now = new Date().getFullYear();
  const grad = data.education.find(e => e.is_expected && yearOf(e.end_date) && yearOf(e.end_date)! > now);
  if (grad && out.length) out[0].items.unshift({ cat: 'next', month: null, text: UI[lang].next(yearOf(grad.end_date)!), date: grad.end_date! });
  return out;
}

export { formatDate, formatRange };
