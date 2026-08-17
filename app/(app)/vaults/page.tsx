import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { CopyButton } from "@/components/vaults/CopyButton";
import {
  createSnippet,
  deleteSnippet,
  createErrorEntry,
  deleteErrorEntry,
  createIdea,
  deleteIdea,
  createTool,
  deleteTool,
} from "@/lib/actions/vaults";

export const dynamic = "force-dynamic";

const SEVERITY_LABELS: Record<string, string> = {
  good: "Resolvido",
  warning: "Atenção",
  serious: "Sério",
  critical: "Crítico",
};

const TABS = [
  { id: "code", label: "Code Vault" },
  { id: "error", label: "Error Vault" },
  { id: "idea", label: "Idea Vault" },
  { id: "tool", label: "Tool Vault" },
];

function DeleteBtn({ action, id }: { action: (fd: FormData) => void; id: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button className="text-ink-muted hover:text-status-critical" title="Excluir">
        <Icon name="trash" size={14} />
      </button>
    </form>
  );
}

export default async function VaultsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab ?? "code";
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <Topbar title="Vaults" subtitle="Suas bibliotecas pessoais: código, erros resolvidos, ideias e ferramentas." />
      <div className="p-8">
        <div className="mb-6 flex gap-1 border-b border-border">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/vaults?tab=${t.id}`}
              className={`border-b-2 px-3 pb-2.5 text-sm font-medium ${
                tab === t.id ? "border-accent text-ink-primary" : "border-transparent text-ink-muted hover:text-ink-primary"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {tab === "code" && <CodeVaultTab userId={user!.id} />}
        {tab === "error" && <ErrorVaultTab userId={user!.id} />}
        {tab === "idea" && <IdeaVaultTab userId={user!.id} />}
        {tab === "tool" && <ToolVaultTab userId={user!.id} />}
      </div>
    </div>
  );
}

async function CodeVaultTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const { data: snippets } = await supabase
    .from("snippets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <details className="card">
        <summary className="cursor-pointer text-sm font-medium">+ Novo snippet</summary>
        <form action={createSnippet} className="mt-4 space-y-3">
          <div className="grid grid-cols-[1fr_160px] gap-3">
            <input name="title" required placeholder="Título" className="input" />
            <input name="lang" required placeholder="Linguagem" className="input" defaultValue="TypeScript" />
          </div>
          <input name="description" placeholder="Descrição curta" className="input" />
          <textarea name="code" required rows={6} placeholder="Cole seu código aqui" className="input font-mono text-xs" />
          <input name="tags" placeholder="Tags (separadas por vírgula)" className="input" />
          <button className="btn btn-primary">Salvar snippet</button>
        </form>
      </details>

      {snippets && snippets.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {snippets.map((s) => (
            <div key={s.id} className="card">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">{s.title}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="accent">{s.lang}</Badge>
                  <DeleteBtn action={deleteSnippet} id={s.id} />
                </div>
              </div>
              {s.description && <p className="mt-1 text-sm text-ink-muted">{s.description}</p>}
              <div className="relative mt-3 rounded-sm border border-border bg-bg p-3 pt-9">
                <CopyButton text={s.code} />
                <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink-secondary">{s.code}</pre>
              </div>
              {s.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.tags.map((t: string) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="code" title="Nenhum snippet salvo" description="Guarde trechos de código que você reutiliza com frequência." />
      )}
    </div>
  );
}

async function ErrorVaultTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const { data: errors } = await supabase
    .from("errors")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <details className="card">
        <summary className="cursor-pointer text-sm font-medium">+ Novo erro</summary>
        <form action={createErrorEntry} className="mt-4 space-y-3">
          <div className="grid grid-cols-[1fr_140px_140px] gap-3">
            <input name="title" required placeholder="Título do erro" className="input" />
            <input name="tech" placeholder="Tecnologia" className="input" />
            <select name="severity" className="input" defaultValue="warning">
              <option value="good">Resolvido</option>
              <option value="warning">Atenção</option>
              <option value="serious">Sério</option>
              <option value="critical">Crítico</option>
            </select>
          </div>
          <textarea name="cause" rows={2} placeholder="Causa" className="input" />
          <textarea name="solution" rows={2} placeholder="Solução" className="input" />
          <button className="btn btn-primary">Salvar erro</button>
        </form>
      </details>

      {errors && errors.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {errors.map((e) => (
            <div key={e.id} className="card">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={e.severity}>
                  {SEVERITY_LABELS[e.severity] ?? e.severity}
                </Badge>
                <div className="flex items-center gap-2">
                  {e.tech && <span className="tag">{e.tech}</span>}
                  <DeleteBtn action={deleteErrorEntry} id={e.id} />
                </div>
              </div>
              <div className="mt-2 font-medium">{e.title}</div>
              {e.cause && (
                <p className="mt-2 text-sm text-ink-secondary">
                  <span className="text-ink-muted">Causa: </span>
                  {e.cause}
                </p>
              )}
              {e.solution && (
                <p className="mt-1.5 text-sm text-ink-secondary">
                  <span className="text-ink-muted">Solução: </span>
                  {e.solution}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="bug" title="Nenhum erro registrado" description="Documente erros e soluções para consultar depois." />
      )}
    </div>
  );
}

async function IdeaVaultTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const { data: ideas } = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <details className="card">
        <summary className="cursor-pointer text-sm font-medium">+ Nova ideia</summary>
        <form action={createIdea} className="mt-4 space-y-3">
          <div className="grid grid-cols-[1fr_160px] gap-3">
            <input name="title" required placeholder="Título da ideia" className="input" />
            <select name="category" className="input" defaultValue="SaaS">
              <option>SaaS</option>
              <option>App</option>
              <option>Experimento</option>
            </select>
          </div>
          <textarea name="description" rows={2} placeholder="Descrição" className="input" />
          <textarea name="problem" rows={2} placeholder="Problema que resolve" className="input" />
          <textarea name="solution" rows={2} placeholder="Solução proposta" className="input" />
          <input name="tech" placeholder="Tecnologias sugeridas (separadas por vírgula)" className="input" />
          <button className="btn btn-primary">Salvar ideia</button>
        </form>
      </details>

      {ideas && ideas.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {ideas.map((i) => (
            <div key={i.id} className="card">
              <div className="flex items-center justify-between">
                <Badge variant="violet">{i.category}</Badge>
                <DeleteBtn action={deleteIdea} id={i.id} />
              </div>
              <div className="mt-2 font-medium">{i.title}</div>
              {i.description && <p className="mt-1 text-sm text-ink-muted">{i.description}</p>}
              {i.problem && (
                <p className="mt-2 text-sm text-ink-secondary">
                  <span className="text-ink-muted">Problema: </span>
                  {i.problem}
                </p>
              )}
              {i.solution && (
                <p className="mt-1.5 text-sm text-ink-secondary">
                  <span className="text-ink-muted">Solução: </span>
                  {i.solution}
                </p>
              )}
              {i.tech?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {i.tech.map((t: string) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="bulb" title="Nenhuma ideia salva" description="Guarde ideias de projetos e experimentos para explorar depois." />
      )}
    </div>
  );
}

async function ToolVaultTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <details className="card">
        <summary className="cursor-pointer text-sm font-medium">+ Nova ferramenta</summary>
        <form action={createTool} className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input name="name" required placeholder="Nome" className="input" />
            <input name="category" placeholder="Categoria" className="input" />
            <select name="status" className="input" defaultValue="Quero testar">
              <option>Usando</option>
              <option>Quero testar</option>
            </select>
          </div>
          <textarea name="notes" rows={2} placeholder="Notas" className="input" />
          <button className="btn btn-primary">Salvar ferramenta</button>
        </form>
      </details>

      {tools && tools.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {tools.map((t) => (
            <div key={t.id} className="card">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.name}</div>
                <DeleteBtn action={deleteTool} id={t.id} />
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {t.category && <span className="tag">{t.category}</span>}
                <Badge variant={t.status === "Usando" ? "good" : "accent"}>{t.status}</Badge>
              </div>
              {t.notes && <p className="mt-2 text-sm text-ink-muted">{t.notes}</p>}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="wrench" title="Nenhuma ferramenta salva" description="Registre APIs, frameworks e serviços que você usa ou quer testar." />
      )}
    </div>
  );
}
