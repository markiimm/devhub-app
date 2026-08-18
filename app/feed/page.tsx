import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { toggleReaction } from "@/lib/actions/reactions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Feed" };

function formatWhen(ts: string) {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function FeedPage({ searchParams }: { searchParams: { tab?: string } }) {
  const supabase = createClient();
  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();

  const tab = searchParams.tab === "following" && viewer ? "following" : "all";

  const { data: publicProjects } = await supabase
    .from("projects")
    .select("id, name, user_id")
    .eq("is_public", true);

  const projectIds = (publicProjects ?? []).map((p) => p.id);
  const projectsById = new Map((publicProjects ?? []).map((p) => [p.id, p]));

  const { data: updates } =
    projectIds.length > 0
      ? await supabase
          .from("project_updates")
          .select("id, project_id, body, created_at")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false })
          .limit(60)
      : { data: [] };

  const userIds = Array.from(new Set((publicProjects ?? []).map((p) => p.user_id)));
  const { data: profiles } =
    userIds.length > 0 ? await supabase.from("profiles").select("*").in("id", userIds) : { data: [] };
  const profilesById = new Map((profiles ?? []).map((p) => [p.id, p]));

  let followingIds: Set<string> | null = null;
  if (viewer) {
    const { data: follows } = await supabase.from("follows").select("following_id").eq("follower_id", viewer.id);
    followingIds = new Set((follows ?? []).map((f) => f.following_id));
  }

  let entries = (updates ?? [])
    .map((u) => {
      const project = projectsById.get(u.project_id);
      const profile = project ? profilesById.get(project.user_id) : null;
      if (!project || !profile) return null;
      return { update: u, project, profile };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  if (tab === "following" && followingIds) {
    entries = entries.filter((e) => followingIds!.has(e.profile.id));
  }

  const updateIds = entries.map((e) => e.update.id);
  const { data: reactions } =
    updateIds.length > 0 ? await supabase.from("reactions").select("update_id, user_id").in("update_id", updateIds) : { data: [] };
  const reactionCounts = new Map<string, number>();
  const viewerReacted = new Set<string>();
  for (const r of reactions ?? []) {
    reactionCounts.set(r.update_id, (reactionCounts.get(r.update_id) ?? 0) + 1);
    if (viewer && r.user_id === viewer.id) viewerReacted.add(r.update_id);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground color="#fb923c" />
      <PublicHeader />

      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-4 sm:px-10">
        <div className="animate-fade-up text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dev Feed</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-secondary">
            O que a comunidade está construindo agora — direto dos updates de "build in public".
          </p>
        </div>

        {viewer && (
          <div className="mt-6 flex justify-center gap-1 border-b-2 border-border">
            <Link
              href="/feed"
              className={`border-b-2 px-3 pb-2.5 font-mono text-sm font-medium transition-colors ${
                tab === "all" ? "border-section-projects text-ink-primary" : "border-transparent text-ink-muted hover:text-ink-primary"
              }`}
            >
              Todo mundo
            </Link>
            <Link
              href="/feed?tab=following"
              className={`border-b-2 px-3 pb-2.5 font-mono text-sm font-medium transition-colors ${
                tab === "following" ? "border-section-projects text-ink-primary" : "border-transparent text-ink-muted hover:text-ink-primary"
              }`}
            >
              Seguindo
            </Link>
          </div>
        )}

        {entries.length > 0 ? (
          <div className="mt-10 space-y-4">
            {entries.map((entry, i) => {
              const avatarColor = entry.profile.avatar_color || "#22d3ee";
              const count = reactionCounts.get(entry.update.id) ?? 0;
              const reacted = viewerReacted.has(entry.update.id);
              return (
                <div
                  key={entry.update.id}
                  className="card card-hover animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <Link
                      href={`/u/${entry.profile.handle}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold"
                      style={{ borderColor: avatarColor, color: avatarColor, background: `${avatarColor}1a` }}
                    >
                      {entry.profile.name.slice(0, 2).toUpperCase()}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                        <Link href={`/u/${entry.profile.handle}`} className="font-semibold hover:underline">
                          {entry.profile.name}
                        </Link>
                        <span className="text-ink-muted">atualizou</span>
                        <span className="flex items-center gap-1 font-mono text-section-projects">
                          <Icon name="folder" size={12} />
                          {entry.project.name}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-secondary">{entry.update.body}</p>
                      <div className="mt-2.5 flex items-center gap-3">
                        <p className="font-mono text-[11px] text-ink-muted">{formatWhen(entry.update.created_at)}</p>
                        {viewer ? (
                          <form action={toggleReaction}>
                            <input type="hidden" name="update_id" value={entry.update.id} />
                            <input type="hidden" name="reacted" value={String(reacted)} />
                            <button
                              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] transition-colors ${
                                reacted
                                  ? "border-status-serious/40 bg-status-serious/10 text-status-serious"
                                  : "border-border text-ink-muted hover:border-status-serious/40 hover:text-status-serious"
                              }`}
                            >
                              🔥 {count > 0 ? count : ""}
                            </button>
                          </form>
                        ) : (
                          count > 0 && <span className="font-mono text-[11px] text-ink-muted">🔥 {count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              icon="zap"
              title={tab === "following" ? "Ninguém que você segue postou ainda" : "O feed está vazio por enquanto"}
              description={
                tab === "following"
                  ? "Siga outros devs na Comunidade pra ver as atualizações deles aqui."
                  : 'Quando alguém postar um update de "build in public" num projeto marcado como destaque, aparece aqui.'
              }
              action={
                tab === "following" ? (
                  <Link href="/explore" className="btn btn-primary font-mono">
                    ver comunidade →
                  </Link>
                ) : (
                  <Link href="/signup" className="btn btn-primary font-mono">
                    $ criar conta →
                  </Link>
                )
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}
