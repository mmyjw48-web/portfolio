# Mohammed Nasser Mijo — portfolio

Personal portfolio with a built-in content dashboard. Visitors see a trilingual site (English, Arabic, Indonesian) themed on the doors and stained-glass *qamariya* windows of Old Sana'a. The owner signs in at `/admin` and edits everything — projects, experience, certificates, images, skills, contact details — without touching code or redeploying.

- **Site:** Next.js 16 (App Router) + TypeScript, plain CSS for the public pages, Tailwind 4 for the dashboard
- **Data, sign-in, files:** Supabase (Postgres with Row Level Security, Auth, Storage)
- **Hosting:** Vercel (free plan is enough)

Live site: https://mohammed-nasser-mijo.vercel.app · Dashboard: https://mohammed-nasser-mijo.vercel.app/admin

Arabic guides: [docs/DEPLOY_AR.md](docs/DEPLOY_AR.md) (one-time setup) and [docs/ADMIN_GUIDE_AR.md](docs/ADMIN_GUIDE_AR.md) (day-to-day editing).

---

## How it fits together

```
visitor ──► Vercel (Next.js) ──► Supabase (read: published + visible rows only)
admin   ──► /admin (signed in) ──► Supabase (write: only e-mails in public.admins)
                     └─ after every save: revalidatePath('/[lang]') → pages rebuild on next visit
```

- Public pages are statically generated and refreshed **on demand** whenever something is saved in the dashboard (plus a daily safety refresh). No redeploy is needed for content changes.
- If the Supabase environment variables are missing, the site falls back to the starting content in `src/content/seed.ts`, so a preview deploy never shows an empty page.
- Drafts (`published = false`) are visible only at `/{lang}/preview`, which requires the admin session.

### Security model

| Who | Can do |
| --- | --- |
| Anyone | Read rows that are `visible` (and `published` where that column exists); send a contact message |
| Signed-in user whose e-mail is **not** in `public.admins` | Same as anyone |
| Signed-in user whose e-mail **is** in `public.admins` | Read and change everything, read messages, upload/delete files in the `media` bucket |

- Enforced in the database with RLS (`supabase/schema.sql`), not only in the UI. Verified with an embedded Postgres: anonymous and non-admin writes are refused, messages are unreadable to the public, drafts are hidden.
- The site uses **only** the public anon/publishable key. No service-role key exists anywhere in this project.
- Public sign-ups should be disabled in Supabase; the single admin account is created by hand.
- The dashboard is behind the proxy (`src/proxy.ts`) *and* re-checks `is_admin()` on every server action.
- The contact form has a honeypot field and a minimum fill time.
- Security headers are set in `next.config.ts`.

---

## Project layout

```
src/
  app/(site)/[lang]/        public pages: home, project pages, preview, contact action
  app/(admin)/admin/        dashboard: login, password reset, lists, edit forms, media, messages
  app/api/keepalive/        daily ping so the free Supabase project is not paused
  components/site/          doors, story timeline, hero, lantern (day/night), contact form…
  components/admin/         forms, image upload, lists
  content/seed.ts           starting content (also the fallback when Supabase is not configured)
  lib/                      data loading, i18n, Supabase clients, admin actions and entity config
  styles/site.css           public site styles
supabase/
  schema.sql                tables, RLS policies, storage bucket — safe to re-run
  seed.sql                  starting content, generated from seed.ts — safe to re-run (never overwrites)
scripts/generate-seed.mts   regenerates seed.sql from seed.ts
tools/sanaa_render.py       procedural renderer used to make the door and qamariya images
public/                     portrait, door art, certificates (images only), og.png
```

---

## Local development

```bash
npm install
cp .env.example .env.local      # fill in the two Supabase values, or leave empty to use seed content
npm run dev                     # http://localhost:3000
npm run typecheck
npm run build
```

Environment variables (`.env.example`):

| Name | What |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The **anon / publishable** key (never the service-role / secret key) |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://mohammed-mijo.vercel.app` (used for SEO, sitemap and password-reset links) |
| `CRON_SECRET` | Optional. Any long random string; Vercel sends it to `/api/keepalive`, which then rejects other callers |

---

## Deploy (summary — full Arabic walkthrough in `docs/DEPLOY_AR.md`)

1. **Supabase:** new project → SQL Editor → run `supabase/schema.sql`, then `supabase/seed.sql`.
2. **Supabase Auth:** disable new sign-ups → Users → *Add user* `mmyjw48@gmail.com` with a strong password and *Auto confirm* → URL configuration: Site URL = your Vercel URL, Redirect URL = `https://<your-site>/admin/auth/callback`.
3. **Vercel:** import the GitHub repo → add the environment variables (the first three; `CRON_SECRET` is optional) → Deploy.
4. Open `/admin`, sign in, edit something, and check that the public page shows it.

---

## Maintenance

- **Content:** only through `/admin`. Editing `seed.ts` after launch does nothing to the live site (it is only the fallback and the source of `seed.sql`).
- **Adding another admin e-mail:** in Supabase SQL Editor: `insert into public.admins (email) values ('someone@example.com');` and create that user under Authentication → Users.
- **Free-tier pause:** Supabase pauses projects after a week without traffic; `vercel.json` schedules `/api/keepalive` daily to prevent it. If it ever pauses, press *Restore* in the Supabase dashboard.
- **Backups:** the free plan has no downloadable backups. Every few months: Supabase → Table Editor → each table → *Export to CSV*, and keep the files with your documents.
- **Updating dependencies:** `npm outdated`, bump, `npm run build`, push — Vercel redeploys automatically.
- **Changing the schema:** edit `supabase/schema.sql` (keep it idempotent), run it again in the SQL Editor, then update `src/lib/types.ts`, `src/lib/admin/entities.ts` and the components.
- **Regenerating door art:** `python3 tools/sanaa_render.py` (needs numpy, scipy, Pillow); outputs go to `public/images/doors/`.

### Privacy rules this project follows

- No passport, stay permit, birth certificate, ID card, school certificate, or invitation letters are published; certificate images are cropped/converted copies only.
- No date or place of birth anywhere on the site.
- Any CV uploaded through the dashboard should be a version without those details.
