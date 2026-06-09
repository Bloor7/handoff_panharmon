create extension if not exists pgcrypto;

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null check (name in ('admin', 'editor', 'viewer')),
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role_id uuid references roles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.users.full_name),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  category_id uuid references categories(id),
  author_id uuid references users(id),
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists seo_metadata (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  path text,
  title text,
  description text,
  canonical_url text,
  og_image_id uuid,
  noindex boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop index if exists seo_metadata_path_key;
alter table seo_metadata drop constraint if exists seo_metadata_path_key;
alter table seo_metadata add constraint seo_metadata_path_key unique (path);

create table if not exists dream_symbols (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_vi text not null,
  name_en text,
  definition text,
  emotion_tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists library_items (
  id uuid primary key default gen_random_uuid(),
  term text unique not null,
  letter text,
  definition_en text,
  name_vi text,
  groups text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,
  alt text,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer jsonb not null default '{}',
  position int default 0,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  source text,
  context text,
  created_at timestamptz default now()
);

create table if not exists ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  feature text not null,
  prompt text,
  response text,
  model text,
  tokens int,
  created_at timestamptz default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table conversations add column if not exists title text;
alter table conversations add column if not exists created_at timestamptz not null default now();
alter table conversations add column if not exists updated_at timestamptz not null default now();
alter table conversations alter column user_id set not null;
alter table conversations drop column if exists messages;
alter table conversations drop column if exists client_id;

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists conversations_user_id_created_at_idx on conversations(user_id, created_at desc);
create index if not exists messages_conversation_id_created_at_idx on messages(conversation_id, created_at asc);

create table if not exists settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table users enable row level security;
alter table roles enable row level security;
alter table posts enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table post_tags enable row level security;
alter table media enable row level security;
alter table seo_metadata enable row level security;
alter table settings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

drop policy if exists "Users can read own profile" on users;
drop policy if exists "Users can update own profile" on users;
create policy "Users can read own profile" on users for select to authenticated using (auth.uid() = id);
create policy "Users can update own profile" on users for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Published posts are public" on posts;
create policy "Published posts are public" on posts for select to anon, authenticated using (status = 'published');

drop policy if exists "Categories are public" on categories;
drop policy if exists "Tags are public" on tags;
drop policy if exists "Published post tags are public" on post_tags;
create policy "Categories are public" on categories for select to anon, authenticated using (true);
create policy "Tags are public" on tags for select to anon, authenticated using (true);
create policy "Published post tags are public" on post_tags for select to anon, authenticated using (
  exists (
    select 1 from posts
    where posts.id = post_tags.post_id
      and posts.status = 'published'
  )
);

drop policy if exists "Users can read own conversations" on conversations;
drop policy if exists "Users can create own conversations" on conversations;
drop policy if exists "Users can update own conversations" on conversations;
drop policy if exists "Users can delete own conversations" on conversations;

create policy "Users can read own conversations"
on conversations for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create own conversations"
on conversations for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own conversations"
on conversations for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own conversations"
on conversations for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own messages" on messages;
drop policy if exists "Users can create own messages" on messages;
drop policy if exists "Users can update own messages" on messages;
drop policy if exists "Users can delete own messages" on messages;

create policy "Users can read own messages"
on messages for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create own messages"
on messages for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from conversations
    where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
  )
);

create policy "Users can update own messages"
on messages for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own messages"
on messages for delete
to authenticated
using (auth.uid() = user_id);
