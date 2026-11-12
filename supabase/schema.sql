-- Already applied to the Clearlist Supabase project. Kept here for reference or a fresh project.
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text default 'none',
  plan text,
  trial_end timestamptz,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);
alter table public.subscriptions enable row level security;
create policy "read own subscription" on public.subscriptions for select using ((select auth.uid()) = user_id);

create table if not exists public.workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table public.workspaces enable row level security;
create policy "own workspace select" on public.workspaces for select using ((select auth.uid()) = user_id);
create policy "own workspace insert" on public.workspaces for insert with check ((select auth.uid()) = user_id);
create policy "own workspace update" on public.workspaces for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own workspace delete" on public.workspaces for delete using ((select auth.uid()) = user_id);

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day text not null,
  count integer not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security; -- no policies on purpose: server only
