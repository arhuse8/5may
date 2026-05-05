# ApnaCricket.co.in 🏏

Built for village champions. Bring professional live scoring to your local grounds.

## 🛠️ Supabase Database Setup

To use the database features, you need to create the following tables in your Supabase SQL Editor:

```sql
-- 1. Table for Organizers
create table public.organizers (
  id uuid references auth.users not null primary key,
  name text not null,
  mobile text unique not null,
  pin text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table for Tournaments
create table public.tournaments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text not null,
  date text not null,
  spots text,
  status text check (status in ('open', 'urgent', 'full')),
  creator_id uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table for Live Scores
create table public.live_scores (
  id uuid default gen_random_uuid() primary key,
  team_a text not null default 'Team A',
  team_b text not null default 'Team B',
  runs integer default 0,
  wickets integer default 0,
  overs text default '0.0',
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Settings (for Ticker)
create table public.settings (
  key text primary key,
  value text not null
);

-- Insert initial data
insert into public.live_scores (team_a, team_b, runs, wickets, overs, status)
values ('Sangli Strikers', 'Pune Panthers', 142, 4, '16.4', 'active');

insert into public.settings (key, value)
values ('ticker', '🚨 Welcome to ApnaCricket.co.in! Registrations for Gram Panchayat Cup are now open. 🏆');

-- Enable RLS
alter table public.organizers enable row level security;
alter table public.tournaments enable row level security;
alter table public.live_scores enable row level security;
alter table public.settings enable row level security;

-- Policies
create policy "Public Read" on public.live_scores for select using (true);
create policy "Public Read Tourney" on public.tournaments for select using (true);
create policy "Public Read Settings" on public.settings for select using (true);
create policy "Public Read Organizers" on public.organizers for select using (true);

-- Basic Write Policies (Allowing Anonymous Auth writes for Demo)
create policy "Allow Anonymous Writes Score" on public.live_scores for update using (true);
create policy "Allow Anonymous Writes Tourney" on public.tournaments for all using (true);
create policy "Allow Anonymous Writes Organizers" on public.organizers for all using (true);
```

## ⚠️ Important API Key Fix

If you are getting an **"Invalid API Key"** error:

1. **Check the Format**: You likely copied the **Clerk Publishable Key** (starts with `sb_publishable_`) from a different project.
2. **Correct Source**: Go to your **Supabase Dashboard** > **Project Settings** > **API**.
3. **Copy the Right Key**: Locate the **anon public** key. It MUST start with **`eyJ`**.
4. **Update Env**: Paste this into your `VITE_SUPABASE_ANON_KEY` in Vercel or your `.env` file.
