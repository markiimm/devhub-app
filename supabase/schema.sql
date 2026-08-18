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
  github_username text default '',
  created_at timestamptz not null default now()
);

-- Para quem já rodou este script antes de "github_username" existir:
alter table public.profiles add column if not exists github_username text default '';

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
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Para quem já rodou este script antes de "is_public" existir:
alter table public.projects add column if not exists is_public boolean not null default false;

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

drop policy if exists "projetos públicos são visíveis" on public.projects;
create policy "projetos públicos são visíveis" on public.projects
  for select using (is_public = true);

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

-- Dev Feed: atualizações de projetos públicos ficam visíveis pra qualquer um.
drop policy if exists "updates de projetos públicos são visíveis" on public.project_updates;
create policy "updates de projetos públicos são visíveis" on public.project_updates
  for select using (exists (select 1 from public.projects p where p.id = project_id and p.is_public = true));

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
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.snippets add column if not exists is_public boolean not null default false;
alter table public.snippets enable row level security;
drop policy if exists "dono gerencia seus snippets" on public.snippets;
create policy "dono gerencia seus snippets" on public.snippets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "snippets públicos são visíveis" on public.snippets;
create policy "snippets públicos são visíveis" on public.snippets
  for select using (is_public = true);

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
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.errors add column if not exists is_public boolean not null default false;
alter table public.errors enable row level security;
drop policy if exists "dono gerencia seus erros" on public.errors;
create policy "dono gerencia seus erros" on public.errors
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "erros públicos são visíveis" on public.errors;
create policy "erros públicos são visíveis" on public.errors
  for select using (is_public = true);

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
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.ideas add column if not exists is_public boolean not null default false;
alter table public.ideas enable row level security;
drop policy if exists "dono gerencia suas ideias" on public.ideas;
create policy "dono gerencia suas ideias" on public.ideas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "ideias públicas são visíveis" on public.ideas;
create policy "ideias públicas são visíveis" on public.ideas
  for select using (is_public = true);

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
-- FOLLOWS — seguir outros devs
-- ---------------------------------------------------------------------------
create table if not exists public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_not_self check (follower_id <> following_id)
);
alter table public.follows enable row level security;

drop policy if exists "follows são públicos para leitura" on public.follows;
create policy "follows são públicos para leitura" on public.follows
  for select using (true);

drop policy if exists "usuário gerencia os próprios follows" on public.follows;
create policy "usuário gerencia os próprios follows" on public.follows
  for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- ---------------------------------------------------------------------------
-- REACTIONS — reações rápidas nos updates do Dev Feed
-- ---------------------------------------------------------------------------
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null references public.project_updates(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null default '🔥',
  created_at timestamptz not null default now(),
  unique (update_id, user_id)
);
alter table public.reactions enable row level security;

drop policy if exists "reações são públicas para leitura" on public.reactions;
create policy "reações são públicas para leitura" on public.reactions
  for select using (true);

drop policy if exists "usuário reage a updates públicos" on public.reactions;
create policy "usuário reage a updates públicos" on public.reactions
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.project_updates u
      join public.projects p on p.id = u.project_id
      where u.id = update_id and p.is_public = true
    )
  );

drop policy if exists "usuário remove a própria reação" on public.reactions;
create policy "usuário remove a própria reação" on public.reactions
  for delete using (auth.uid() = user_id);

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
create index if not exists idx_follows_following on public.follows(following_id);
create index if not exists idx_reactions_update on public.reactions(update_id);

-- ============================================================================
-- Pronto! Depois de rodar este script:
-- 1. Vá em Project Settings > API e copie "Project URL" e "anon public key".
-- 2. Cole no arquivo .env.local do app (veja README.md).
-- 3. (Opcional) Em Authentication > Providers, confirme que "Email" está habilitado.
-- ============================================================================
