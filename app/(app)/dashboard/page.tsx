import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { StatTile } from "@/components/dashboard/StatTile";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: projectsCount }, { count: snippetsCount }, { count: errorsCount }, { count: ideasCount }, { data: recentProjects }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
      supabase.from("snippets").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
      supabase.from("errors").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
      supabase.from("ideas").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
      supabase
        .from("projects")
        .select("id, name, tagline, status, progress")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(4),
    ]);

  const firstName = (user?.user_metadata?.name as string | undefined)?.split(" ")[0];

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle={`Bem-vindo${firstName ? `, ${firstName}` : ""}. Aqui está o resumo do seu espaço.`}
      />
      <div className="p-8">
        <div className="grid grid-cols-4 gap-4">
          <StatTile label="Projetos" value={projectsCount ?? 0} icon="folder" />
          <StatTile label="Snippets salvos" value={snippetsCount ?? 0} icon="code" />
          <StatTile label="Erros registrados" value={errorsCount ?? 0} icon="bug" />
          <StatTile label="Ideias salvas" value={ideasCount ?? 0} icon="bulb" />
        </div>

        <div className="mt-6 card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Projetos recentes</h2>
            <Link href="/projects" className="text-xs font-medium text-accent hover:underline">
              ver todos
            </Link>
          </div>
          {recentProjects && recentProjects.length > 0 ? (
            <div className="divide-y divide-border">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="truncate text-xs text-ink-muted">{p.tagline}</div>
                  </div>
                  <StatusBadge status={p.status} />
                  <div className="w-20">
                    <ProgressBar value={p.progress} />
                  </div>
                  <Icon name="chevronRight" size={15} className="text-ink-muted" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="folder"
              title="Nenhum projeto ainda"
              description="Crie seu primeiro projeto no Project Lab para acompanhar tarefas e progresso."
              action={
                <Link href="/projects" className="btn btn-primary">
                  <Icon name="plus" size={14} />
                  Novo projeto
                </Link>
              }
            />
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Link href="/vaults?tab=code" className="card flex flex-col gap-2 transition-colors hover:bg-surface-3">
            <Icon name="code" size={18} className="text-ink-muted" />
            <span className="text-sm font-medium">Novo snippet</span>
          </Link>
          <Link href="/vaults?tab=error" className="card flex flex-col gap-2 transition-colors hover:bg-surface-3">
            <Icon name="bug" size={18} className="text-ink-muted" />
            <span className="text-sm font-medium">Registrar erro</span>
          </Link>
          <Link href="/brain" className="card flex flex-col gap-2 transition-colors hover:bg-surface-3">
            <Icon name="fileText" size={18} className="text-ink-muted" />
            <span className="text-sm font-medium">Nova nota</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
