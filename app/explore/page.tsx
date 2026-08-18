import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { isPro } from "@/lib/billing";

export const dynamic = "force-dynamic";
export const metadata = { title: "Comunidade" };

export default async function ExplorePage({ searchParams }: { searchParams: { tech?: string } }) {
  const supabase = createClient();
  const activeTech = searchParams.tech;

  const { data: publicProjects } = await supabase
    .from("projects")
    .select("id, user_id, name, tech")
    .eq("is_public", true)
    .order("updated_at", { ascending: false });

  const allTech = Array.from(new Set((publicProjects ?? []).flatMap((p) => p.tech ?? []))).sort();

  const filteredProjects = activeTech
    ? (publicProjects ?? []).filter((p) => p.tech?.includes(activeTech))
    : publicProjects ?? [];

  const userIds = Array.from(new Set(filteredProjects.map((p) => p.user_id)));

  const { data: profiles } =
    userIds.length > 0 ? await supabase.from("profiles").select("*").in("id", userIds) : { data: [] };

  const profilesById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const { data: subscriptions } =
    userIds.length > 0 ? await supabase.from("subscriptions").select("user_id, status").in("user_id", userIds) : { data: [] };
  const proUserIds = new Set((subscriptions ?? []).filter((s) => isPro(s.status)).map((s) => s.user_id));

  // preserva a ordem de "mais recentemente ativo" vinda de publicProjects
  const entries: { profile: NonNullable<ReturnType<typeof profilesById.get>>; projects: typeof filteredProjects }[] = [];
  const seen = new Set<string>();
  for (const p of filteredProjects) {
    if (seen.has(p.user_id)) continue;
    const profile = profilesById.get(p.user_id);
    if (!profile) continue;
    seen.add(p.user_id);
    entries.push({ profile, projects: filteredProjects.filter((pp) => pp.user_id === p.user_id) });
  }

  // destaque Pro: assinantes aparecem primeiro, mantendo a ordem de recência dentro de cada grupo
  entries.sort((a, b) => Number(proUserIds.has(b.profile.id)) - Number(proUserIds.has(a.profile.id)));

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground color="#22d3ee" />
      <PublicHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-4 sm:px-10">
        <div className="animate-fade-up text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Comunidade devHub</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-secondary">
            Devs que estão construindo em público, com projetos e perfis compartilhados.
          </p>
        </div>

        {allTech.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            <Link
              href="/explore"
              className={`rounded-full border px-2.5 py-1 font-mono text-xs transition-colors ${
                !activeTech ? "border-accent/40 bg-accent/10 text-accent" : "border-border text-ink-muted hover:text-ink-primary"
              }`}
            >
              todos
            </Link>
            {allTech.map((t) => (
              <Link
                key={t}
                href={`/explore?tech=${encodeURIComponent(t)}`}
                className={`rounded-full border px-2.5 py-1 font-mono text-xs transition-colors ${
                  activeTech === t ? "border-accent/40 bg-accent/10 text-accent" : "border-border text-ink-muted hover:text-ink-primary"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {entries.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, i) => {
              const avatarColor = entry.profile.avatar_color || "#22d3ee";
              return (
                <Link
                  key={entry.profile.id}
                  href={`/u/${entry.profile.handle}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="card card-hover animate-fade-up block"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold"
                      style={{ borderColor: avatarColor, color: avatarColor, background: `${avatarColor}1a` }}
                    >
                      {entry.profile.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate text-sm font-semibold">
                        {entry.profile.name}
                        {proUserIds.has(entry.profile.id) && (
                          <span className="shrink-0 rounded-full border border-status-warning/40 bg-status-warning/10 px-1.5 py-0.5 text-[9px] text-status-warning">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="truncate font-mono text-xs text-ink-muted">@{entry.profile.handle}</div>
                    </div>
                  </div>

                  {entry.profile.title && (
                    <p className="mt-3 truncate text-xs text-ink-secondary">{entry.profile.title}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(entry.projects ?? []).slice(0, 3).map((p) => (
                      <span key={p.id} className="tag">
                        {p.name}
                      </span>
                    ))}
                    {(entry.projects?.length ?? 0) > 3 && (
                      <span className="tag">+{entry.projects!.length - 3}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              icon="globe"
              title={activeTech ? `Ninguém usando ${activeTech} ainda` : "Ninguém publicou um projeto ainda"}
              description={
                activeTech
                  ? "Tente outra tecnologia ou volte pra ver todo mundo."
                  : "Marque um dos seus projetos como destaque público no Project Lab e seja o primeiro a aparecer aqui."
              }
              action={
                activeTech ? (
                  <Link href="/explore" className="btn btn-primary font-mono">
                    ver todos →
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
