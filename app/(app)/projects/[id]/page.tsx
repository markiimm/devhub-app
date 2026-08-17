import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import {
  updateProjectMeta,
  deleteProject,
  addTask,
  toggleTask,
  deleteTask,
  addProblem,
  cycleProblemStatus,
  deleteProblem,
  addUpdate,
  deleteUpdate,
} from "@/lib/actions/projects";

export const dynamic = "force-dynamic";

const DNA_LABELS: Record<string, string> = {
  arquitetura: "Arquitetura",
  banco: "Banco de dados",
  auth: "Autenticação",
  hospedagem: "Hospedagem",
  ferramentas: "Ferramentas",
};

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single();
  if (!project) notFound();

  const [{ data: tasks }, { data: problems }, { data: updates }] = await Promise.all([
    supabase.from("project_tasks").select("*").eq("project_id", params.id).order("created_at"),
    supabase.from("project_problems").select("*").eq("project_id", params.id).order("created_at", { ascending: false }),
    supabase.from("project_updates").select("*").eq("project_id", params.id).order("created_at", { ascending: false }),
  ]);

  const dna = (project.dna ?? {}) as Record<string, string>;

  return (
    <div>
      <Topbar
        title={project.name}
        subtitle={project.tagline}
        actions={
          project.github ? (
            <a href={`https://${project.github}`} target="_blank" className="btn btn-ghost">
              <Icon name="github" size={14} />
              {project.github}
            </a>
          ) : undefined
        }
      />
      <div className="space-y-4 p-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <StatusBadge status={project.status} />
            <span className="text-xs text-ink-muted">{project.progress}% completo</span>
          </div>
          <ProgressBar value={project.progress} className="mt-2" />
          {project.tech?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((t: string) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        <details className="card">
          <summary className="cursor-pointer text-sm font-medium">Editar projeto</summary>
          <form action={updateProjectMeta} className="mt-4 space-y-3">
            <input type="hidden" name="id" value={project.id} />
            <div className="grid grid-cols-2 gap-3">
              <input name="name" defaultValue={project.name} className="input" placeholder="Nome" />
              <input name="tagline" defaultValue={project.tagline ?? ""} className="input" placeholder="Tagline" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <select name="status" defaultValue={project.status} className="input">
                <option>Em desenvolvimento</option>
                <option>Pausado</option>
                <option>Concluído</option>
              </select>
              <input type="number" name="progress" min={0} max={100} defaultValue={project.progress} className="input" />
              <input name="github" defaultValue={project.github ?? ""} className="input" placeholder="github.com/..." />
            </div>
            <input name="tech" defaultValue={project.tech?.join(", ") ?? ""} className="input" placeholder="Tecnologias" />
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(DNA_LABELS).map(([key, label]) => (
                <input
                  key={key}
                  name={`dna_${key}`}
                  defaultValue={dna[key] ?? ""}
                  className="input"
                  placeholder={label}
                />
              ))}
            </div>
            <div className="flex justify-between">
              <form action={deleteProject}>
                <input type="hidden" name="id" value={project.id} />
                <button className="btn btn-ghost text-status-critical hover:text-status-critical">Excluir projeto</button>
              </form>
              <button className="btn btn-primary">Salvar alterações</button>
            </div>
          </form>
        </details>

        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <h2 className="mb-3 text-sm font-semibold">Tarefas</h2>
            <div className="space-y-1">
              {tasks?.map((t) => (
                <div key={t.id} className="flex items-center gap-2 py-1.5">
                  <form action={toggleTask}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="project_id" value={project.id} />
                    <input type="hidden" name="done" value={String(t.done)} />
                    <button type="submit" className={t.done ? "text-status-good" : "text-ink-muted"}>
                      <Icon name={t.done ? "check" : "clock"} size={15} />
                    </button>
                  </form>
                  <span className={`flex-1 text-sm ${t.done ? "text-ink-muted line-through" : ""}`}>{t.title}</span>
                  <form action={deleteTask}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="project_id" value={project.id} />
                    <button className="text-ink-muted hover:text-status-critical">
                      <Icon name="x" size={13} />
                    </button>
                  </form>
                </div>
              ))}
              {(!tasks || tasks.length === 0) && <p className="py-2 text-sm text-ink-muted">Sem tarefas ainda.</p>}
            </div>
            <form action={addTask} className="mt-3 flex gap-2">
              <input type="hidden" name="project_id" value={project.id} />
              <input name="title" placeholder="Nova tarefa" className="input" required />
              <button className="btn shrink-0">
                <Icon name="plus" size={14} />
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="mb-3 text-sm font-semibold">Problemas encontrados</h2>
            <div className="space-y-1">
              {problems?.map((p) => (
                <div key={p.id} className="flex items-center gap-2 py-1.5">
                  <span className="flex-1 text-sm">{p.title}</span>
                  <form action={cycleProblemStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="project_id" value={project.id} />
                    <input type="hidden" name="status" value={p.status} />
                    <button>
                      <StatusBadge status={p.status} />
                    </button>
                  </form>
                  <form action={deleteProblem}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="project_id" value={project.id} />
                    <button className="text-ink-muted hover:text-status-critical">
                      <Icon name="x" size={13} />
                    </button>
                  </form>
                </div>
              ))}
              {(!problems || problems.length === 0) && (
                <p className="py-2 text-sm text-ink-muted">Nenhum problema registrado.</p>
              )}
            </div>
            <form action={addProblem} className="mt-3 flex gap-2">
              <input type="hidden" name="project_id" value={project.id} />
              <input name="title" placeholder="Novo problema" className="input" required />
              <button className="btn shrink-0">
                <Icon name="plus" size={14} />
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-3 text-sm font-semibold">Build in Public — atualizações</h2>
          <form action={addUpdate} className="mb-3 flex gap-2">
            <input type="hidden" name="project_id" value={project.id} />
            <input name="body" placeholder="O que mudou hoje?" className="input" required />
            <button className="btn shrink-0">
              <Icon name="plus" size={14} />
            </button>
          </form>
          <div className="space-y-3">
            {updates?.map((u) => (
              <div key={u.id} className="flex items-start gap-3 border-t border-border pt-3 first:border-0 first:pt-0">
                <span className="w-20 shrink-0 text-xs text-ink-muted">
                  {new Date(u.created_at).toLocaleDateString("pt-BR")}
                </span>
                <span className="flex-1 text-sm text-ink-secondary">{u.body}</span>
                <form action={deleteUpdate}>
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="project_id" value={project.id} />
                  <button className="text-ink-muted hover:text-status-critical">
                    <Icon name="x" size={13} />
                  </button>
                </form>
              </div>
            ))}
            {(!updates || updates.length === 0) && <p className="text-sm text-ink-muted">Nenhuma atualização ainda.</p>}
          </div>
        </div>

        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink-primary">
          ← Voltar para todos os projetos
        </Link>
      </div>
    </div>
  );
}
