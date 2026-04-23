-- Triad Solutions admin schema
-- Invite-only: only authenticated members (rows in profiles) may read/write.

-- Extensions
create extension if not exists "pgcrypto";

-- PROFILES ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  role text default 'member',
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile row on signup (invited users)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- CUSTOMERS -----------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_person text,
  industry text,
  status text default 'prospect', -- prospect | active | inactive | closed
  email text,
  phone text,
  website text,
  notes text,
  kund_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PROJECTS ------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references public.profiles(id) on delete set null,
  status text default 'planning', -- planning | in_progress | paused | idea | backlog | done | canceled
  priority text default 'medium', -- low | medium | high
  start_date date,
  end_date date,
  summary text,
  customer_id uuid references public.customers(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TASKS ---------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assignee_id uuid references public.profiles(id) on delete set null,
  status text default 'not_started', -- not_started | in_progress | done | archived
  priority text default 'medium', -- low | medium | high
  due_at timestamptz,
  completed_at timestamptz,
  tags text[] default '{}',
  parent_task_id uuid references public.tasks(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_project_idx on public.tasks (project_id);
create index if not exists tasks_assignee_idx on public.tasks (assignee_id);

-- MEETINGS ------------------------------------------------------------
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date_time timestamptz not null,
  type text, -- internal | customer | workshop | planning | followup
  status text default 'planned', -- planned | completed | canceled
  location text,
  agenda text,
  notes text,
  action_items text,
  participants text[] default '{}', -- founder handles: rayan/sahil/firas
  customer_id uuid references public.customers(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists meetings_date_idx on public.meetings (date_time);

-- DOCUMENTS -----------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text default 'Utan titel',
  icon text,
  content text default '',
  parent_id uuid references public.documents(id) on delete cascade,
  is_template boolean default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists documents_parent_idx on public.documents (parent_id);

-- EXPENSES ------------------------------------------------------------
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount_sek numeric(12,2) not null default 0,
  paid_by text, -- rayan | sahil | firas | company
  category text,
  date date default current_date,
  receipt_url text,
  status text default 'pending', -- pending | reimbursed
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz default now()
);

-- INCOME --------------------------------------------------------------
create table if not exists public.income (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount_sek numeric(12,2) not null default 0,
  source text, -- customer | grant | investment | other
  date date default current_date,
  status text default 'pending', -- pending | received | late
  customer_id uuid references public.customers(id) on delete set null,
  created_at timestamptz default now()
);

-- INVOICES ------------------------------------------------------------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text,
  amount_sek numeric(12,2) not null default 0,
  issued_at date,
  due_date date,
  status text default 'draft', -- draft | sent | paid | overdue | credited
  pdf_url text,
  notes text,
  created_at timestamptz default now()
);

-- UPDATED_AT trigger -------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$
declare t text;
begin
  foreach t in array array['customers','projects','tasks','meetings','documents']
  loop
    execute format('drop trigger if exists trg_%I_updated on public.%I;', t, t);
    execute format('create trigger trg_%I_updated before update on public.%I for each row execute function public.touch_updated_at();', t, t);
  end loop;
end $$;

-- ROW LEVEL SECURITY --------------------------------------------------
-- Invite-only: only users with a row in profiles can read/write.
alter table public.profiles   enable row level security;
alter table public.customers  enable row level security;
alter table public.projects   enable row level security;
alter table public.tasks      enable row level security;
alter table public.meetings   enable row level security;
alter table public.documents  enable row level security;
alter table public.expenses   enable row level security;
alter table public.income     enable row level security;
alter table public.invoices   enable row level security;

create or replace function public.is_member()
returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

-- PROFILES: members can read all, update self
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (public.is_member());
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update using (id = auth.uid());

-- Generic policy: members can do anything on the other tables
do $$
declare t text;
begin
  foreach t in array array['customers','projects','tasks','meetings','documents','expenses','income','invoices']
  loop
    execute format('drop policy if exists %I_all on public.%I;', t||'_member', t);
    execute format('create policy %I on public.%I for all using (public.is_member()) with check (public.is_member());', t||'_member', t);
  end loop;
end $$;
