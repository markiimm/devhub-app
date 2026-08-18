# DevHub — núcleo pessoal (com Supabase)

App real (Next.js 14 + TypeScript + Tailwind + Supabase) com Auth, Dashboard, Dev Brain,
Vaults (Code / Error / Idea / Tool) e Project Lab — tudo lendo e escrevendo num banco
Postgres de verdade via Supabase.

O restante do conceito da plataforma (Comunidade, Showcase, Marketplace, Identidade
Dev, IA etc.) continua disponível como protótipo navegável (`devhub-prototype.html`,
com dados fictícios) — dá pra conectar essas áreas ao mesmo banco depois, incrementalmente.

## 1. Criar o projeto no Supabase (grátis)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (dá pra usar GitHub).
2. Clique em **New project**. Escolha um nome, uma senha de banco (guarde-a) e a região
   mais próxima de você. Aguarde ~2 minutos até o projeto ficar pronto.
3. No menu lateral, abra **SQL Editor** → **New query**.
4. Copie **todo** o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql)
   deste projeto, cole no editor e clique em **Run**. Isso cria todas as tabelas,
   políticas de segurança (RLS) e o gatilho que cria seu perfil automaticamente no cadastro.
5. No menu lateral, vá em **Project Settings → API**. Você vai precisar de dois valores:
   - **Project URL**
   - **anon public** key (em "Project API keys")

## 2. Configurar o app

```bash
cp .env.local.example .env.local
```

Abra `.env.local` e cole os dois valores do passo anterior:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## 3. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Se as variáveis de ambiente
não estiverem configuradas, o app mostra uma tela explicando o que falta — sem quebrar.

Crie uma conta pela tela de cadastro (`/signup`) e comece a usar. Por padrão o Supabase
pede confirmação por e-mail; se quiser pular isso durante o desenvolvimento, vá em
**Authentication → Providers → Email** no painel do Supabase e desative "Confirm email".

## O que já funciona de ponta a ponta

- **Autenticação real** — cadastro, login, logout, sessão via cookies (`@supabase/ssr`), rotas protegidas por middleware.
- **Dashboard** — contadores reais (projetos, snippets, erros, ideias) e projetos recentes.
- **Dev Brain** — criar, editar, excluir notas com categoria e tags.
- **Vaults** — Code Vault (com botão de copiar), Error Vault, Idea Vault e Tool Vault, cada um com criação e exclusão.
- **Project Lab** — criar projetos, editar status/progresso/tecnologias/"Project DNA", checklist de tarefas, problemas encontrados (com ciclo de status) e atualizações "build in public".
- **Landing page pública** (`/`) — só aparece pra quem não está logado; quem já tem sessão é redirecionado direto pro dashboard.
- **Perfil público compartilhável** (`/u/seu-handle`) — mostra bio, cargo, stack e os projetos marcados como "destaque público" no Project Lab. Editável em **Configurações** na sidebar.
- **Heatmap de atividade** no dashboard, estilo GitHub, calculado a partir dos seus próprios registros (sem tabela extra).
- **Paleta de comandos** (`Ctrl/Cmd+K`) pra navegar entre as áreas sem tirar a mão do teclado.

Todas as tabelas têm **Row Level Security**: cada pessoa só vê e edita os próprios dados (exceto projetos marcados como públicos, que ficam visíveis pra qualquer um no link do perfil).

> **Se seu banco já existia antes do perfil público**: abra o **SQL Editor** do Supabase e rode
> `supabase/schema.sql` de novo (é seguro rodar mais de uma vez) — ele adiciona a coluna
> `is_public` em `projects` e a policy de leitura pública. Sem isso, o toggle "mostrar no
> perfil público" salva silenciosamente sem efeito.

## Estrutura

```
app/
  (app)/            → área autenticada (sidebar + páginas)
  login/, signup/    → autenticação
  auth/callback/     → confirmação de e-mail / magic link
lib/
  supabase/          → clients (browser/server), env, tipos
  actions/           → Server Actions (mutations) por área
components/
  ui/                → primitivas (ícone, badge, progress, empty state)
  layout/            → sidebar, topbar, botão de logout
supabase/schema.sql  → schema completo (tabelas + RLS)
```

## Próximos passos sugeridos

1. **Deploy**: suba o repositório para o GitHub e importe na [Vercel](https://vercel.com)
   (adicione as mesmas variáveis de ambiente nas configs do projeto).
2. **Tipos gerados**: depois que o schema estabilizar, rode
   `npx supabase gen types typescript --project-id SEU-PROJETO > lib/supabase/types.ts`
   para tipos 100% sincronizados com o banco.
3. **Conectar o resto do conceito**: Dev Feed, Discussions, Chat, Showcase etc. seguem o
   mesmo padrão (tabela + RLS + Server Action + página) usado aqui — o protótipo estático
   já tem o desenho de cada tela pronto como referência.
4. **Segurança em produção**: antes de ir ao ar publicamente, revise as políticas de RLS,
   ative confirmação de e-mail e considere rate limiting no Supabase Auth.

## Sobre as dependências

O projeto usa Next.js 14.2.35 (a última versão patched da linha 14). Antes de colocar em
produção, vale rodar `npm audit` e considerar migrar para Next 15/16 — a linha 14 recebe
cada vez menos atualizações de segurança.
