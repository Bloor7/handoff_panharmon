# Panharmon Next.js

Production Next.js App Router project rebuilt from the original prototype in `source/`.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Production check:

```bash
npm run build
```

## Environment

Required for AI:

```env
ANTHROPIC_API_KEY=
```

Required for CMS/Admin:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
REVALIDATE_SECRET=
```

`SUPABASE_SERVICE_ROLE_KEY` is used only in server actions. Never expose it to client code.
`ADMIN_EMAIL` and `ADMIN_PASSWORD` protect `/admin`; `ADMIN_SESSION_SECRET` signs the admin cookie.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Create a Storage bucket named `media`.
4. Enable email/password auth in Supabase for public users who want saved Iris chat history.
5. Fill `.env.local`.
6. Start the app and visit `/admin/login`.

## CMS Features

Admin routes live under `/admin` and are protected by the admin credentials in `.env`:

- `/admin/dashboard` - content counts.
- `/admin/posts` - create, edit, delete posts with Tiptap JSON content, status, category, scheduled date.
- `/admin/categories` - create, edit, delete categories.
- `/admin/tags` - create, edit, delete tags.
- `/admin/media` - upload/delete media via Supabase Storage and `media` table.
- `/admin/seo` - create, edit, delete metadata records.
- `/admin/settings` - create, edit, delete JSON settings.

If Supabase env vars are missing, admin pages show configuration notices or redirect to login.

## Public Routes

- `/` - Home, Interpreter, Hero, Process, Lenses.
- `/giai-ma` - article list.
- `/giai-ma/[slug]` - article detail, SSG.
- `/blog` and `/blog/[slug]` - aliases for SEO/blog URL structure.
- `/san-pham` - subscriptions and Sleep Goods.
- `/thu-vien` - interactive Mộng Triệu library.
- `/thu-vien/[slug]` - static SEO pages for library symbols.
- `/lien-he` - contact form.
- `/faq` - FAQ placeholder with JSON-LD.

## File Reading Guide

Read the project in this order:

1. `app/layout.tsx`
   Global shell: fonts, metadata, JSON-LD, nav, footer, Iris, star field, drum rings.

2. `styles/globals.css`
   Design tokens and most visual fidelity from the prototype. Search by class names from components.

3. `app/page.tsx` and `components/home/Interpreter.tsx`
   Home page and Claude-powered dream interpretation.

4. `app/giai-ma/*`, `app/blog/*`, `lib/articles.ts`
   Server-rendered article list/detail and article data.

5. `app/thu-vien/page.tsx`, `components/library/*`, `hooks/usePlacedCards.ts`
   Interactive drum library, popup, zoom card, placed cards, static translated data.

6. `components/layout/Iris.tsx`
   Floating chat, localStorage history, `/api/claude` integration.

7. `app/admin/*`, `components/admin/*`, `app/admin/actions.ts`, `services/cms.ts`
   CMS UI, forms, server actions, Supabase data access.

8. `supabase/schema.sql`
   Database schema and initial RLS foundation.

9. `app/api/*`, `app/sitemap.ts`, `app/robots.ts`
   API and SEO infrastructure.

The original prototype remains in `source/` for comparison only. Do not import directly from it.

## Data and Persistence

Client persistence keys:

- `iris.history.v1`
- `panharmon.placedCards.v1`

Authenticated Iris conversations are saved in the Supabase `conversations` table by `auth.users.id`.

Large library data:

- Original alphabet source: `dream_moods_dictionary.json`
- Emotion-tagged translated source: `symbols-tagged.json`
- Untagged remainder source: `symbols-untagged.json`
- Reviewed static source: `symbols-tagged-reviewed.json`, `symbols-untagged-reviewed.json`
- Vietnamese cultural source: `vietnamese-symbols.json`
- Runtime merged data: `public/library-data.json`
- Runtime raw copies: `public/data/dream_moods_dictionary.json`, `public/data/symbols-tagged.json`, `public/data/symbols-untagged.json`, `public/data/vietnamese-symbols.json`, plus reviewed files when present.

Regenerate runtime library data after editing the JSON files:

```bash
npm run build:library
```

Generate reviewed static Vietnamese data and emotion branches without Anthropic/runtime translation:

```bash
npm run translate:symbols
```

This writes `symbols-tagged-reviewed.json` and `symbols-untagged-reviewed.json`, then rebuilds `public/library-data.json`. The script is resumable because it saves progress after each batch. For a quick limited run:

```powershell
$env:STATIC_TRANSLATE_LIMIT='40'
npm run translate:symbols
```

For a local deterministic fallback that never touches any external translation endpoint:

```bash
npm run review:symbols
```

The merge script is `scripts/build-library-data.mjs`. It prefers reviewed JSON files when present and creates a normalized 6,302-entry dataset:

- `tags` from `symbols-tagged.json`
- all entries keep `t`, `v`, `l`, `d`, `d_en`, `g`, `source`, and `reviewed`
- Vietnamese cultural entries use `source: "vietnamese"` and are written directly in Vietnamese
- untagged alphabet entries are assigned emotion branches before publishing
- `d` is Vietnamese display text; `d_en` keeps the original English definition

On `/thu-vien`, the drum tree uses all branch-tagged entries, full search uses all 6,302 entries, and clicking a symbol opens the static Vietnamese translation immediately. No library translation call is made at runtime.

## AI API

`POST /api/claude`

Body:

```json
{ "prompt": "..." }
```

or:

```json
{
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

The route uses `@anthropic-ai/sdk`, model `claude-haiku-4-5`, `max_tokens: 1024`.

## Notes

- Main SEO content is server-rendered.
- Heavy interactive library UI is client-rendered.
- Tiptap stores post content as JSON in `posts.content`.
- Media upload expects Supabase Storage bucket `media`.
- Run `npm run build` before deployment.
