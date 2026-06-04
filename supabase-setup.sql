-- Run this entire file in your Supabase SQL editor
-- Go to: supabase.com/dashboard > your project > SQL Editor > New query > paste this > Run

-- TASKS table (for Marek and Valentina's weekly tasks)
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  person text not null,
  text text not null,
  done boolean default false
);

-- POSTS table (for the content schedule)
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  type text not null,
  title text,
  notes text,
  status text default 'Idea',
  day_label text,
  day_index integer default 0
);

-- MEETINGS table
create table if not exists meetings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  type text not null,
  day text,
  duration text,
  booked boolean default true
);

-- MEDIA table (tracks uploaded files)
create table if not exists media (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text,
  path text,
  url text,
  type text,
  size bigint
);

-- Enable Row Level Security (keeps data private)
alter table tasks enable row level security;
alter table posts enable row level security;
alter table meetings enable row level security;
alter table media enable row level security;

-- Allow all authenticated users (you and Valentina) to read/write everything
create policy "Auth users can do everything on tasks" on tasks for all to authenticated using (true) with check (true);
create policy "Auth users can do everything on posts" on posts for all to authenticated using (true) with check (true);
create policy "Auth users can do everything on meetings" on meetings for all to authenticated using (true) with check (true);
create policy "Auth users can do everything on media" on media for all to authenticated using (true) with check (true);

-- Enable realtime on all tables (so changes sync instantly between Marek and Valentina)
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table posts;
alter publication supabase_realtime add table meetings;
alter publication supabase_realtime add table media;
