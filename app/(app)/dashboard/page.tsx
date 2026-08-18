import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { StatTile } from "@/components/dashboard/StatTile";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { fetchGithubActivity } from "@/lib/github";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const since = new Date();
  since.setDate(since.getDate() - 371);
  const sinceIso = since.toISOString();

  const [
    { count: projectsCount },
    { count: snippetsCount },
    { count: errorsCount },
    { count: ideasCount },
    { data: recentProjects },
    { data: projectDates },
    { data: snippetDates },
    { data: errorDates },
    { data: ideaDates },
    { data: noteDates },
    { data: profile },
  ] = await Promise.all([
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
    supabase.from("projects").select("created_at").eq("user_id", user!.id).gte("created_at", sinceIso),
    supabase.from("snippets").select("created_at").eq("user_id", user!.id).gte("created_at", sinceIso),
    supabase.from("errors").select("created_at").eq("user_id", user!.id).gte("created_at", sinceIso),
    supabase.from("ideas").select("created_at").eq("user_id", user!.id).gte("created_at", sinceIso),
    supabase.from("notes").select("created_at").eq("user_id", user!.id).gte("created_at", sinceIso),
    supabase.from("profiles").select("github_username").eq("id", user!.id).single(),
  ]);

  const githubTimestamps = profile?.github_username ? await fetchGithubActivity(profile.github_username) : [];

  const activityTimestamps = [
    ...(projectDates ?? []),
    ...(snippetDates ?? []),
    ...(errorDates ?? []),
    ...(ideaDates ?? []),
    ...(noteDates ?? []),
  ]
    .map((r) => r.created_at)
    .concat(githubTimestamps);

  const firstName = (user?.user_metadata?.name as string | undefined)?.split(" ")[0];

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle={`Bem-vindo${firstName ? `, ${firstName}` : ""}. Aqui está o resumo do seu espaço.`}
      />
      <div className="p-8 sm:p-10">
        <div className="grid grid-cols-4 gap-5">
          <StatTile label="Projetos" value={projectsCount ?? 0} icon="folder" accent="orange" delay={0} />
          <StatTile label="Snippets salvos" value={snippetsCount ?? 0} icon="code" accent="green" delay={80} />
          <StatTile label="Erros registrados" value={errorsCount ?? 0} icon="bug" accent="cyan" delay={160} />
          <StatTile label="Ideias salvas" value={ideasCount ?? 0} icon="bulb" accent="violet" delay={240} />
        </div>

        <div className="mt-8 card animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-sm font-semibold">Atividade</h2>
            {profile?.github_username && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-ink-muted">
                <Icon name="github" size={11} />
                inclui commits de @{profile.github_username}
              </span>
            )}
          </div>
          <ActivityHeatmap timestamps={activityTimestamps} />
        </div>

        <div className="mt-8 card card-hover animate-fade-up" style={{ animationDelay: "320ms" }}>
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
                  className="group flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="truncate text-xs text-ink-muted">{p.tagline}</div>
                  </div>
                  <StatusBadge status={p.status} />
                  <div className="w-20">
                    <ProgressBar value={p.progress} />
                  </div>
                  <Icon
                    name="chevronRight"
                    size={15}
                    className="text-ink-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent"
                  />
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

        <div className="mt-8 grid grid-cols-3 gap-5">
          <Link
            href="/vaults?tab=code"
            style={{ animationDelay: "380ms" }}
            className="card card-hover group animate-fade-up flex flex-col gap-2.5 hover:border-section-vaults/40"
          >
            <Icon
              name="code"
              size={18}
              className="text-section-vaults transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-sm font-medium">Novo snippet</span>
          </Link>
          <Link
            href="/vaults?tab=error"
            style={{ animationDelay: "440ms" }}
            className="card card-hover group animate-fade-up flex flex-col gap-2.5 hover:border-status-critical/40"
          >
            <Icon
              name="bug"
              size={18}
              className="text-status-critical transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-sm font-medium">Registrar erro</span>
          </Link>
          <Link
            href="/brain"
            style={{ animationDelay: "500ms" }}
            className="card card-hover group animate-fade-up flex flex-col gap-2.5 hover:border-section-brain/40"
          >
            <Icon
              name="fileText"
              size={18}
              className="text-section-brain transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-sm font-medium">Nova nota</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
