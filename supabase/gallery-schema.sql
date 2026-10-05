create extension if not exists pgcrypto;
create table if not exists public.galleries(id uuid primary key default gen_random_uuid(),code text unique not null,title text not null,expires_at timestamptz,active boolean not null default true,created_at timestamptz not null default now());
create table if not exists public.gallery_photos(id uuid primary key default gen_random_uuid(),gallery_id uuid not null references public.galleries(id) on delete cascade,storage_path text not null,filename text not null,sort_order integer not null default 0,created_at timestamptz not null default now());
create index if not exists gallery_photos_gallery_id_idx on public.gallery_photos(gallery_id,sort_order);
alter table public.galleries enable row level security;
alter table public.gallery_photos enable row level security;
revoke all on public.galleries from anon,authenticated;
revoke all on public.gallery_photos from anon,authenticated;
-- Create a PRIVATE Supabase Storage bucket named: client-galleries
-- Example:
-- insert into public.galleries(code,title,expires_at) values('VS-7K4P-92XM','Smith Family Session','2026-12-31T23:59:59Z');
-- insert into public.gallery_photos(gallery_id,storage_path,filename,sort_order) select id,'2026/smith/IMG_0001.jpg','IMG_0001.jpg',1 from public.galleries where code='VS-7K4P-92XM';