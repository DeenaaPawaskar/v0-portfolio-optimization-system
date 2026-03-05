-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create saved_portfolios table
create table if not exists public.saved_portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  stocks jsonb not null, -- Array of {symbol: string, weight: number}
  investment_amount numeric not null,
  total_return numeric,
  annual_volatility numeric,
  sharpe_ratio numeric,
  strategy_type text default 'optimized', -- 'optimized' or 'equal_weight'
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create portfolio_history table for tracking results over time
create table if not exists public.portfolio_history (
  id uuid primary key default gen_random_uuid(),
  saved_portfolio_id uuid not null references public.saved_portfolios(id) on delete cascade,
  total_return numeric not null,
  annual_volatility numeric not null,
  sharpe_ratio numeric not null,
  max_drawdown numeric,
  value_at_risk_95 numeric,
  beta numeric,
  recorded_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.saved_portfolios enable row level security;
alter table public.portfolio_history enable row level security;

-- Create RLS policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create RLS policies for saved_portfolios
create policy "portfolios_select_own" on public.saved_portfolios for select using (auth.uid() = user_id);
create policy "portfolios_insert_own" on public.saved_portfolios for insert with check (auth.uid() = user_id);
create policy "portfolios_update_own" on public.saved_portfolios for update using (auth.uid() = user_id);
create policy "portfolios_delete_own" on public.saved_portfolios for delete using (auth.uid() = user_id);

-- Create RLS policies for portfolio_history
create policy "history_select_own" on public.portfolio_history for select 
  using (
    saved_portfolio_id in (
      select id from public.saved_portfolios where user_id = auth.uid()
    )
  );
create policy "history_insert_own" on public.portfolio_history for insert 
  with check (
    saved_portfolio_id in (
      select id from public.saved_portfolios where user_id = auth.uid()
    )
  );

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
