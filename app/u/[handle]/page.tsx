import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Icon } from "@/components/ui/Icon";
import { GithubBadgeInline } from "@/components/projects/GithubBadgeInline";
import { fetchGithubRepo, type GithubRepoInfo } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { handle: string } }) {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, handle, bio")
    .eq("handle", params.handle)
    .single();
  if (!profile) return { title: "Perfil não encontrado" };
  return {
    title: `${profile.name} (@${profile.handle})`,
    description: profile.bio || undefined,
  };
}

export default async function PublicProfilePage({ params }: { params: { handle: string } }) {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", params.handle)
    .single();
  if (!profile) notFound();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, tagline, status, progress, tech, github")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("updated_at", { ascending: false });

  const githubInfos: (GithubRepoInfo | null)[] = await Promise.all(
    (projects ?? []).map((p) => (p.github ? fetchGithubRepo(p.github) : Promise.resolve(null)))
  );
  const totalStars = githubInfos.reduce((sum, info) => sum + (info?.stars ?? 0), 0);
  const uniqueTech = new Set((projects ?? []).flatMap((p) => p.tech ?? [])).size;

  const avatarColor = profile.avatar_color || "#22d3ee";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground color={avatarColor} />
      <PublicHeader />

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <div className="card animate-fade-up">
          <div className="flex items-start gap-5">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 font-mono text-lg font-bold"
              style={{ borderColor: avatarColor, color: avatarColor, background: `${avatarColor}1a` }}
            >
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">{profile.name}</h1>
              <p className="font-mono text-sm text-ink-muted">@{profile.handle}</p>
              {profile.title && <p className="mt-1.5 text-sm text-ink-secondary">{profile.title}</p>}
              {profile.location && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                  <Icon name="box" size={12} />
                  {profile.location}
                </p>
              )}
            </div>
          </div>

          {profile.bio && <p className="mt-5 border-t border-border pt-5 text-sm text-ink-secondary">{profile.bio}</p>}

          {profile.stacks?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.stacks.map((s: string) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          )}

          {(projects?.length ?? 0) > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 font-mono text-xs text-ink-secondary">
              <span className="flex items-center gap-1.5">
                <Icon name="folder" size={13} className="text-section-projects" />
                {projects!.length} {projects!.length === 1 ? "projeto público" : "projetos públicos"}
              </span>
              {uniqueTech > 0 && (
                <span className="flex items-center gap-1.5">
                  <Icon name="box" size={13} className="text-section-vaults" />
                  {uniqueTech} tecnologias
                </span>
              )}
              {totalStars > 0 && (
                <span className="flex items-center gap-1.5">
                  <Icon name="star" size={13} className="text-status-warning" />
                  {totalStars} stars no GitHub
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h2 className="mb-3 text-sm font-semibold text-ink-secondary">✦ Projetos em destaque</h2>
          {projects && projects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  className="card card-hover animate-fade-up"
                  style={{ animationDelay: `${120 + i * 60}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={p.status} />
                    <span className="font-mono text-xs text-ink-muted">{p.progress}%</span>
                  </div>
                  <div className="mt-2.5 text-base font-semibold">{p.name}</div>
                  <div className="mt-0.5 text-sm text-ink-muted">{p.tagline}</div>
                  <ProgressBar value={p.progress} className="mt-3" />
                  {p.tech?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tech.map((t: string) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {githubInfos[i] && (
                    <div className="mt-3">
                      <GithubBadgeInline info={githubInfos[i]!} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Nenhum projeto em destaque ainda.</p>
          )}
        </div>

        <div className="mt-12 flex animate-fade-up items-center justify-between gap-4 border-t border-border pt-8" style={{ animationDelay: "160ms" }}>
          <p className="text-sm text-ink-secondary">
            Quer um perfil como esse pra mostrar seus projetos?
          </p>
          <Link href="/signup" className="btn btn-primary shrink-0 font-mono">
            $ criar meu perfil →
          </Link>
        </div>
      </main>
    </div>
  );
}
