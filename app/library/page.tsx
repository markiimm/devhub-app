import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CopyButton } from "@/components/vaults/CopyButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Biblioteca" };

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
];

function AuthorTag({ profile }: { profile: { handle: string; name: string; avatar_color: string | null } }) {
  const color = profile.avatar_color || "#22d3ee";
  return (
    <Link href={`/u/${profile.handle}`} className="flex items-center gap-1.5 font-mono text-xs text-ink-muted hover:text-ink-primary">
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full border text-[8px] font-bold"
        style={{ borderColor: color, color, background: `${color}1a` }}
      >
        {profile.name.slice(0, 1).toUpperCase()}
      </span>
      @{profile.handle}
    </Link>
  );
}

export default async function LibraryPage({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab ?? "code";
  const supabase = createClient();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground color="#34d399" />
      <PublicHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-4 sm:px-10">
        <div className="animate-fade-up text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Biblioteca pública</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-secondary">
            Snippets, erros resolvidos e ideias que a comunidade decidiu compartilhar.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-1 border-b-2 border-border">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/library?tab=${t.id}`}
              className={`border-b-2 px-3 pb-2.5 font-mono text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-section-vaults text-ink-primary"
                  : "border-transparent text-ink-muted hover:text-ink-primary"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="mt-8">
          {tab === "code" && <CodeLibrary supabase={supabase} />}
          {tab === "error" && <ErrorLibrary supabase={supabase} />}
          {tab === "idea" && <IdeaLibrary supabase={supabase} />}
        </div>
      </main>
    </div>
  );
}

async function CodeLibrary({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const { data: snippets } = await supabase
    .from("snippets")
    .select("id, title, lang, description, code, tags, user_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(40);

  const userIds = Array.from(new Set((snippets ?? []).map((s) => s.user_id)));
  const { data: profiles } = userIds.length > 0 ? await supabase.from("profiles").select("*").in("id", userIds) : { data: [] };
  const profilesById = new Map((profiles ?? []).map((p) => [p.id, p]));

  if (!snippets || snippets.length === 0) {
    return <EmptyState icon="code" title="Nenhum snippet público ainda" description="Marque um snippet como público no seu Code Vault." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {snippets.map((s, i) => {
        const profile = profilesById.get(s.user_id);
        return (
          <div key={s.id} className="card card-hover animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">{s.title}</div>
              <Badge variant="accent">{s.lang}</Badge>
            </div>
            {s.description && <p className="mt-1 text-sm text-ink-muted">{s.description}</p>}
            <div className="relative mt-3 rounded-sm border-2 border-border bg-bg p-3 pt-9">
              <CopyButton text={s.code} />
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink-secondary">{s.code}</pre>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {s.tags?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t: string) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <span />
              )}
              {profile && <AuthorTag profile={profile} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

async function ErrorLibrary({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const { data: errors } = await supabase
    .from("errors")
    .select("id, title, tech, severity, cause, solution, user_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(40);

  const userIds = Array.from(new Set((errors ?? []).map((e) => e.user_id)));
  const { data: profiles } = userIds.length > 0 ? await supabase.from("profiles").select("*").in("id", userIds) : { data: [] };
  const profilesById = new Map((profiles ?? []).map((p) => [p.id, p]));

  if (!errors || errors.length === 0) {
    return <EmptyState icon="bug" title="Nenhum erro público ainda" description="Marque um erro resolvido como público no seu Error Vault." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {errors.map((e, i) => {
        const profile = profilesById.get(e.user_id);
        return (
          <div key={e.id} className="card card-hover animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-center justify-between gap-2">
              <Badge variant={e.severity}>{SEVERITY_LABELS[e.severity] ?? e.severity}</Badge>
              {e.tech && <span className="tag">{e.tech}</span>}
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
            {profile && (
              <div className="mt-3 flex justify-end">
                <AuthorTag profile={profile} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

async function IdeaLibrary({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const { data: ideas } = await supabase
    .from("ideas")
    .select("id, title, category, description, problem, solution, tech, user_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(40);

  const userIds = Array.from(new Set((ideas ?? []).map((idea) => idea.user_id)));
  const { data: profiles } = userIds.length > 0 ? await supabase.from("profiles").select("*").in("id", userIds) : { data: [] };
  const profilesById = new Map((profiles ?? []).map((p) => [p.id, p]));

  if (!ideas || ideas.length === 0) {
    return <EmptyState icon="bulb" title="Nenhuma ideia pública ainda" description="Marque uma ideia como pública no seu Idea Vault." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ideas.map((idea, i) => {
        const profile = profilesById.get(idea.user_id);
        return (
          <div key={idea.id} className="card card-hover animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
            <Badge variant="violet">{idea.category}</Badge>
            <div className="mt-2 font-medium">{idea.title}</div>
            {idea.description && <p className="mt-1 text-sm text-ink-muted">{idea.description}</p>}
            {idea.problem && (
              <p className="mt-2 text-sm text-ink-secondary">
                <span className="text-ink-muted">Problema: </span>
                {idea.problem}
              </p>
            )}
            {idea.solution && (
              <p className="mt-1.5 text-sm text-ink-secondary">
                <span className="text-ink-muted">Solução: </span>
                {idea.solution}
              </p>
            )}
            <div className="mt-3 flex items-center justify-between">
              {idea.tech?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {idea.tech.map((t: string) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <span />
              )}
              {profile && <AuthorTag profile={profile} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
