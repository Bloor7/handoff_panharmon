# Panharmon Next.js

## Chạy local

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Mở `http://localhost:3000`.

## Biến môi trường

- `ANTHROPIC_API_KEY` dùng cho `/api/claude`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REVALIDATE_SECRET`

## Supabase

Schema production foundation nằm ở `supabase/schema.sql`.
