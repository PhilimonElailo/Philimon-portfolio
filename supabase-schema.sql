-- Create the projects table
create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('web', 'video')),
  description text not null,
  tags text[] not null default '{}',
  media_url text,
  project_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create index if not exists idx_projects_display_order
  on public.projects (display_order asc);

-- Allow public read access to the gallery
create policy "Public can view projects"
  on public.projects
  for select
  using (true);

-- Restrict writes to authenticated users only
create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update projects"
  on public.projects
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  using (auth.role() = 'authenticated');

-- Optional: create storage bucket for portfolio media
-- Run this in Supabase Dashboard > Storage > New bucket
-- Bucket name: portfolio-media
-- Public bucket: true

-- Example media upload policy (if bucket is created publicly):
-- create policy "Public upload to portfolio-media"
-- on storage.objects for insert
-- with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');
--
-- create policy "Public read portfolio-media"
-- on storage.objects for select
-- using (bucket_id = 'portfolio-media');
