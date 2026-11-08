-- =====================================================================
-- Portfolio database for Supabase
-- Run this whole file once in Supabase → SQL Editor → New query → Run.
-- Then run seed.sql (starting content) the same way.
-- Safe to re-run: it only creates what is missing and refreshes the rules.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Who may edit the site. Only e-mails listed here can write anything.
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  email text primary key check (email = lower(email))
);
insert into public.admins (email) values ('mmyjw48@gmail.com') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------------------------------------------------------------------
-- Content tables. Text that is translated is stored as {"en": "...", "ar": "...", "id": "..."}.
-- ---------------------------------------------------------------------
create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name jsonb not null default '{}',
  greeting jsonb, build_label jsonb, roles jsonb, status jsonb,
  available boolean not null default true,
  lead jsonb, about jsonb, facts jsonb, languages jsonb, location jsonb,
  email text, whatsapp text, phone_display text, linkedin_url text, github_url text,
  photo_url text, cv_url text,
  contact_title jsonb, contact_sub jsonb, seo_title jsonb, seo_description jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.sections (
  key text primary key check (key in ('about','projects','experience','leadership','achievements','skills','education','story','contact')),
  title jsonb not null default '{}',
  subtitle jsonb,
  visible boolean not null default true,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.doors (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name jsonb not null default '{}',
  intro jsonb,
  color text not null default 'ruby' check (color in ('ruby','cobalt','emerald','saffron','turquoise','violet')),
  style text not null default 'ai' check (style in ('ai','mobile','web','leadership')),
  kind text not null default 'projects' check (kind in ('projects','leadership')),
  visible boolean not null default true,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title jsonb not null default '{}',
  tagline jsonb, summary jsonb, body jsonb, contribution jsonb,
  status text not null default 'completed' check (status in ('completed','in_progress','prototype','concept','hackathon','planned')),
  team jsonb, award jsonb,
  start_date date, end_date date,
  date_precision text not null default 'month' check (date_precision in ('day','month','year')),
  stack text[] not null default '{}',
  metrics jsonb not null default '[]',
  repo_url text, demo_url text, cover_url text,
  gallery text[] not null default '{}',
  visual text not null default 'auto' check (visual in ('auto','phone','monitor','hand','arch','image')),
  doors text[] not null default '{}',
  featured boolean not null default false,
  visible boolean not null default true,
  published boolean not null default true,
  sort int not null default 0,
  in_story boolean not null default false,
  story_text jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{}',
  org jsonb, employment_type jsonb, location jsonb,
  start_date date, end_date date,
  is_current boolean not null default false,
  date_precision text not null default 'month' check (date_precision in ('day','month','year')),
  summary jsonb, bullets jsonb, link text,
  in_door boolean not null default true,
  visible boolean not null default true,
  published boolean not null default true,
  sort int not null default 0,
  in_story boolean not null default false,
  story_text jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{}',
  org jsonb, role jsonb,
  category text not null default 'program' check (category in ('leadership','delegation','program','conference','community','media')),
  start_date date, end_date date,
  date_precision text not null default 'day' check (date_precision in ('day','month','year')),
  location jsonb, summary jsonb, image_url text, link text,
  in_door boolean not null default false,
  visible boolean not null default true,
  published boolean not null default true,
  sort int not null default 0,
  in_story boolean not null default false,
  story_text jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{}',
  issuer jsonb,
  kind text not null default 'certificate' check (kind in ('award','certificate','participation')),
  date date,
  date_precision text not null default 'day' check (date_precision in ('day','month','year')),
  credential_id text, credential_url text, image_url text,
  summary jsonb,
  featured boolean not null default false,
  visible boolean not null default true,
  published boolean not null default true,
  sort int not null default 0,
  in_story boolean not null default false,
  story_text jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution jsonb not null default '{}',
  degree jsonb, field jsonb, location jsonb,
  start_date date, end_date date,
  is_expected boolean not null default false,
  date_precision text not null default 'month' check (date_precision in ('day','month','year')),
  summary jsonb, coursework jsonb,
  visible boolean not null default true,
  published boolean not null default true,
  sort int not null default 0,
  in_story boolean not null default false,
  story_text jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null default '{}',
  visible boolean not null default true,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.skill_groups(id) on delete cascade,
  name jsonb not null default '{}',
  level text not null default 'demonstrated' check (level in ('demonstrated','learning')),
  visible boolean not null default true,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists skills_group_idx on public.skills (group_id, sort);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200 and position('@' in email) > 1),
  message text not null check (char_length(message) between 1 and 4000),
  lang text check (lang in ('en','ar','id')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['profile','sections','doors','projects','experiences','activities','achievements','education','skill_groups','skills'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Row Level Security: visitors read published, visible rows; only admins write.
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['admins','profile','sections','doors','projects','experiences','activities','achievements','education','skill_groups','skills','messages'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;

  -- tables visitors may read when the row is visible (and published, where that column exists)
  foreach t in array array['projects','experiences','activities','achievements','education'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (visible and published)', t);
  end loop;
  foreach t in array array['doors','skill_groups','skills'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (visible)', t);
  end loop;
  foreach t in array array['profile','sections'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;

  -- the admin can read and change everything
  foreach t in array array['profile','sections','doors','projects','experiences','activities','achievements','education','skill_groups','skills','messages'] loop
    execute format('drop policy if exists "admin all" on public.%I', t);
    execute format('create policy "admin all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- anyone may send a message through the contact form, but nobody except the admin can read them
drop policy if exists "anyone can send" on public.messages;
create policy "anyone can send" on public.messages for insert to anon, authenticated with check (read = false);

-- table privileges (Row Level Security above decides which rows)
grant usage on schema public to anon, authenticated;
grant select on public.profile, public.sections, public.doors, public.projects, public.experiences, public.activities,
  public.achievements, public.education, public.skill_groups, public.skills to anon, authenticated;
grant insert, update, delete on public.profile, public.sections, public.doors, public.projects, public.experiences, public.activities,
  public.achievements, public.education, public.skill_groups, public.skills to authenticated;
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;
revoke all on public.admins from anon, authenticated;

-- ---------------------------------------------------------------------
-- Storage: one public bucket for images and files. Anyone can view; only the admin can upload or delete.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','application/pdf'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media admin read" on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin read" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
