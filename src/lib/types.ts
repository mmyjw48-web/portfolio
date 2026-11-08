export const LOCALES = ['en', 'ar', 'id'] as const;
export type Lang = (typeof LOCALES)[number];

/** A piece of text in the three site languages. English is the fallback. */
export type I18n = Partial<Record<Lang, string>>;
/** A list (one item per line in the dashboard) in the three site languages. */
export type I18nList = Partial<Record<Lang, string[]>>;

export type DatePrecision = 'day' | 'month' | 'year';
export type DoorColor = 'ruby' | 'cobalt' | 'emerald' | 'saffron' | 'turquoise' | 'violet';
export type DoorStyle = 'ai' | 'mobile' | 'web' | 'leadership';
export type ProjectStatus = 'completed' | 'in_progress' | 'prototype' | 'concept' | 'hackathon' | 'planned';
export type Visual = 'auto' | 'phone' | 'monitor' | 'hand' | 'arch' | 'image';

export interface Profile {
  id: number;
  name: I18n;
  greeting: I18n;
  build_label: I18n;
  roles: I18nList;
  status: I18n;
  available: boolean;
  lead: I18n;
  about: I18n;
  facts: I18nList;
  languages: I18nList;
  location: I18n;
  email: string | null;
  whatsapp: string | null;
  phone_display: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  photo_url: string | null;
  cv_url: string | null;
  contact_title: I18n;
  contact_sub: I18n;
  seo_title: I18n;
  seo_description: I18n;
}

export type SectionKey = 'about' | 'projects' | 'experience' | 'leadership' | 'achievements' | 'skills' | 'education' | 'story' | 'contact';

export interface Section {
  key: SectionKey;
  title: I18n;
  subtitle: I18n;
  visible: boolean;
  sort: number;
}

export interface Door {
  id: string;
  name: I18n;
  intro: I18n;
  color: DoorColor;
  style: DoorStyle;
  kind: 'projects' | 'leadership';
  visible: boolean;
  sort: number;
}

export interface Metric { value: I18n; label: I18n }

interface Publishable {
  id: string;
  visible: boolean;
  published: boolean;
  sort: number;
  in_story: boolean;
  story_text: I18n | null;
}

export interface Project extends Publishable {
  slug: string;
  title: I18n;
  tagline: I18n;
  summary: I18n;
  body: I18n;
  contribution: I18nList;
  status: ProjectStatus;
  team: I18n | null;
  award: I18n | null;
  start_date: string | null;
  end_date: string | null;
  date_precision: DatePrecision;
  stack: string[];
  metrics: Metric[];
  repo_url: string | null;
  demo_url: string | null;
  cover_url: string | null;
  gallery: string[];
  visual: Visual;
  doors: string[];
  featured: boolean;
}

export interface Experience extends Publishable {
  title: I18n;
  org: I18n;
  employment_type: I18n;
  location: I18n;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  date_precision: DatePrecision;
  summary: I18n;
  bullets: I18nList;
  link: string | null;
  in_door: boolean;
}

export type ActivityCategory = 'leadership' | 'delegation' | 'program' | 'conference' | 'community' | 'media';

export interface Activity extends Publishable {
  title: I18n;
  org: I18n;
  role: I18n;
  category: ActivityCategory;
  start_date: string | null;
  end_date: string | null;
  date_precision: DatePrecision;
  location: I18n;
  summary: I18n;
  image_url: string | null;
  link: string | null;
  in_door: boolean;
}

export interface Achievement extends Publishable {
  title: I18n;
  issuer: I18n;
  kind: 'award' | 'certificate' | 'participation';
  date: string | null;
  date_precision: DatePrecision;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  summary: I18n;
  featured: boolean;
}

export interface Education extends Publishable {
  institution: I18n;
  degree: I18n;
  field: I18n;
  location: I18n;
  start_date: string | null;
  end_date: string | null;
  is_expected: boolean;
  date_precision: DatePrecision;
  summary: I18n;
  coursework: I18nList;
}

export interface SkillGroup { id: string; name: I18n; visible: boolean; sort: number }
export interface Skill { id: string; group_id: string; name: I18n; level: 'demonstrated' | 'learning'; visible: boolean; sort: number }

export interface SiteData {
  profile: Profile;
  sections: Section[];
  doors: Door[];
  projects: Project[];
  experiences: Experience[];
  activities: Activity[];
  achievements: Achievement[];
  education: Education[];
  skillGroups: SkillGroup[];
  skills: Skill[];
}
