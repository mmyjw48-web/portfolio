import 'server-only';
import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { seed } from '@/content/seed';
import type { SiteData } from './types';
import { publicClient } from './supabase/public';
import { hasSupabase } from './supabase/env';

const TABLES = {
  sections: 'sections', doors: 'doors', projects: 'projects', experiences: 'experiences', activities: 'activities',
  achievements: 'achievements', education: 'education', skillGroups: 'skill_groups', skills: 'skills'
} as const;

const PUBLISHABLE = new Set(['projects', 'experiences', 'activities', 'achievements', 'education']);

function fromSeed(drafts: boolean): SiteData {
  const keep = <T extends { visible?: boolean; published?: boolean }>(rows: T[]) =>
    rows.filter(r => r.visible !== false && (drafts || r.published !== false));
  return {
    profile: seed.profile,
    sections: [...seed.sections].sort((a, b) => a.sort - b.sort),
    doors: keep(seed.doors), projects: keep(seed.projects), experiences: keep(seed.experiences), activities: keep(seed.activities),
    achievements: keep(seed.achievements), education: keep(seed.education), skillGroups: keep(seed.skillGroups), skills: keep(seed.skills)
  };
}

async function load(db: SupabaseClient, drafts: boolean): Promise<SiteData> {
  const q = (key: keyof typeof TABLES) => {
    let query = db.from(TABLES[key]).select('*').order('sort', { ascending: true });
    if (key !== 'sections') query = query.eq('visible', true);
    if (PUBLISHABLE.has(TABLES[key]) && !drafts) query = query.eq('published', true);
    return query;
  };
  const [profile, ...rest] = await Promise.all([
    db.from('profile').select('*').eq('id', 1).maybeSingle(),
    q('sections'), q('doors'), q('projects'), q('experiences'), q('activities'), q('achievements'), q('education'), q('skillGroups'), q('skills')
  ]);
  const err = [profile, ...rest].find(r => r.error);
  if (err?.error) throw new Error(`Supabase: ${err.error.message}`);
  const [sections, doors, projects, experiences, activities, achievements, education, skillGroups, skills] = rest.map(r => r.data ?? []);
  return {
    profile: (profile.data as SiteData['profile']) ?? seed.profile,
    sections, doors, projects, experiences, activities, achievements, education, skillGroups, skills
  } as SiteData;
}

/** Everything the public site shows. Falls back to the bundled seed content when Supabase isn't configured. */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const db = publicClient();
  if (!db) return fromSeed(false);
  return load(db, false);
});

/** Same data including drafts, read with the signed-in admin's session (for /preview). */
export async function getPreviewData(db: SupabaseClient | null): Promise<SiteData> {
  if (!db || !hasSupabase()) return fromSeed(true);
  return load(db, true);
}
