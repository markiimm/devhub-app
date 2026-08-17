-- ============================================================================
-- DevHub — schema do núcleo pessoal (Auth + Dashboard + Dev Brain + Vaults + Project Lab)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase (supabase.com).
-- Pode rodar mais de uma vez com segurança (usa "if not exists" / "or replace").
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- PROFILES — um perfil por usuário autenticado
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Novo dev',
  handle text unique,
  title text default 'Desenvolvedor(a)',
  bio text default '',
  location text default '',
  avatar_color text default '#3987e5',
  stacks text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles são públicos para leitura" on public.profiles;
create policy "profiles são públicos para leitura"
  on public.profiles for select
  using (true);

drop policy if exists "usuário edita o próprio profile" on public.profiles;
create policy "usuário edita o próprio profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "usuário insere o próprio profile" on public.profiles;
create policy "usuário insere o próprio profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Cria o profile automaticamente quando um usuário se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, handle)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'handle', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- PROJECTS (Project Lab)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  tagline text default '',
  status text not null default 'Em desenvolvimento'
    check (status in ('Em desenvolvimento','Pausado','Concluído')),
  progress smallint not null default 0 check (progress between 0 and 100),
  tech text[] not null default '{}',
  apis text[] not null default '{}',
  github text default '',
  dna jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.project_problems (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  status text not null default 'Aberto' check (status in ('Aberto','Investigando','Resolvido')),
  created_at timestamptz not null default now()
);

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_problems enable row level security;
alter table public.project_updates enable row level security;

drop policy if exists "dono gerencia seus projetos" on public.projects;
create policy "dono gerencia seus projetos" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "dono gerencia tarefas dos seus projetos" on public.project_tasks;
create policy "dono gerencia tarefas dos seus projetos" on public.project_tasks
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));

drop policy if exists "dono gerencia problemas dos seus projetos" on public.project_problems;
create policy "dono gerencia problemas dos seus projetos" on public.project_problems
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));

drop policy if exists "dono gerencia updates dos seus projetos" on public.project_updates;
create policy "dono gerencia updates dos seus projetos" on public.project_updates
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- DEV BRAIN
-- ---------------------------------------------------------------------------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text default '',
  tags text[] not null default '{}',
  body text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.notes enable row level security;
drop policy if exists "dono gerencia suas notas" on public.notes;
create policy "dono gerencia suas notas" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- CODE VAULT
-- ---------------------------------------------------------------------------
create table if not exists public.snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  lang text not null default 'TypeScript',
  tags text[] not null default '{}',
  description text default '',
  code text not null default '',
  created_at timestamptz not null default now()
);
alter table public.snippets enable row level security;
drop policy if exists "dono gerencia seus snippets" on public.snippets;
create policy "dono gerencia seus snippets" on public.snippets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ERROR VAULT
-- ---------------------------------------------------------------------------
create table if not exists public.errors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  tech text default '',
  severity text not null default 'warning' check (severity in ('good','warning','serious','critical')),
  cause text default '',
  solution text default '',
  created_at timestamptz not null default now()
);
alter table public.errors enable row level security;
drop policy if exists "dono gerencia seus erros" on public.errors;
create policy "dono gerencia seus erros" on public.errors
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- IDEA VAULT
-- ---------------------------------------------------------------------------
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text default 'SaaS',
  description text default '',
  problem text default '',
  solution text default '',
  features text[] not null default '{}',
  tech text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.ideas enable row level security;
drop policy if exists "dono gerencia suas ideias" on public.ideas;
create policy "dono gerencia suas ideias" on public.ideas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- TOOL VAULT
-- ---------------------------------------------------------------------------
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text default 'Ferramenta',
  status text not null default 'Quero testar' check (status in ('Usando','Quero testar')),
  notes text default '',
  created_at timestamptz not null default now()
);
alter table public.tools enable row level security;
drop policy if exists "dono gerencia suas ferramentas" on public.tools;
create policy "dono gerencia suas ferramentas" on public.tools
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- índices úteis
-- ---------------------------------------------------------------------------
create index if not exists idx_projects_user on public.projects(user_id);
create index if not exists idx_notes_user on public.notes(user_id);
create index if not exists idx_snippets_user on public.snippets(user_id);
create index if not exists idx_errors_user on public.errors(user_id);
create index if not exists idx_ideas_user on public.ideas(user_id);
create index if not exists idx_tools_user on public.tools(user_id);
create index if not exists idx_tasks_project on public.project_tasks(project_id);
create index if not exists idx_problems_project on public.project_problems(project_id);
create index if not exists idx_updates_project on public.project_updates(project_id);

-- ============================================================================
-- Pronto! Depois de rodar este script:
-- 1. Vá em Project Settings > API e copie "Project URL" e "anon public key".
-- 2. Cole no arquivo .env.local do app (veja README.md).
-- 3. (Opcional) Em Authentication > Providers, confirme que "Email" está habilitado.
-- ============================================================================
