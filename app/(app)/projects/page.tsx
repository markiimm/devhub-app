import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { createProject } from "@/lib/actions/projects";

export const dynamic = "force-dynamic";
export const metadata = { title: "Project Lab" };

export default async function ProjectsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, tagline, status, progress, tech, is_public")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <Topbar
        title="Project Lab"
        subtitle="Organize projetos com tarefas, documentação, tecnologias e progresso."
        accent="projects"
      />
      <div className="p-8 sm:p-10 space-y-5">
        <details className="card card-hover">
          <summary className="cursor-pointer font-mono text-sm font-medium text-section-projects">
            <Icon name="plus" size={13} className="mr-1 inline" />
            Novo projeto
          </summary>
          <form action={createProject} className="mt-4 space-y-3">
            <input name="name" required placeholder="Nome do projeto" className="input" />
            <input name="tagline" placeholder="Uma frase sobre o projeto" className="input" />
            <div className="grid grid-cols-2 gap-3">
              <input name="tech" placeholder="Tecnologias (separadas por vírgula)" className="input" />
              <input name="github" placeholder="github.com/usuario/repo" className="input" />
            </div>
            <button className="btn btn-primary">Criar projeto</button>
          </form>
        </details>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                style={{ animationDelay: `${i * 60}ms` }}
                className="card card-hover animate-fade-up block hover:border-section-projects/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={p.status} />
                    {p.is_public && (
                      <span title="Visível no seu perfil público" className="text-section-brain">
                        ✦
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-ink-muted">{p.progress}%</span>
                </div>
                <div className="mt-2.5 text-base font-semibold">{p.name}</div>
                <div className="mt-0.5 text-sm text-ink-muted">{p.tagline}</div>
                <ProgressBar value={p.progress} className="mt-3" />
                {p.tech?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tech.map((t: string) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon="folder" title="Nenhum projeto ainda" description="Crie o primeiro projeto acima." />
        )}
      </div>
    </div>
  );
}
