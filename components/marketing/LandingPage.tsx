import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { Icon } from "@/components/ui/Icon";

const FEATURES = [
  {
    icon: "grid",
    title: "Dashboard",
    color: "text-section-dashboard",
    border: "hover:border-section-dashboard/40",
    description: "Visão geral com contadores animados, heatmap de atividade e seus projetos recentes num só lugar.",
  },
  {
    icon: "code",
    title: "Dev Brain",
    color: "text-section-brain",
    border: "hover:border-section-brain/40",
    description: "Guarde comandos, conceitos e anotações técnicas organizadas por categoria e tags.",
  },
  {
    icon: "box",
    title: "Vaults",
    color: "text-section-vaults",
    border: "hover:border-section-vaults/40",
    description: "Code, Error, Idea e Tool Vault — snippets reutilizáveis, erros documentados e ideias arquivadas.",
  },
  {
    icon: "folder",
    title: "Project Lab",
    color: "text-section-projects",
    border: "hover:border-section-projects/40",
    description: "Tarefas, problemas, tech stack e updates de build-in-public para cada projeto que você constrói.",
  },
];

const HIGHLIGHTS = [
  { icon: "zap", title: "Ctrl+K em tudo", description: "Paleta de comandos pra navegar sem tirar a mão do teclado." },
  { icon: "user", title: "Perfil público", description: "Um link tipo devhub/u/seu-handle pra mostrar seus projetos em destaque." },
  { icon: "sparkles", title: "Feito pra devs", description: "Tema terminal, mono type, dados reais — sem enfeite corporativo." },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground color="#22d3ee" />
      <PublicHeader />

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 text-center sm:px-10 sm:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
            <Icon name="zap" size={12} />
            open beta — construído em público
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl animate-fade-up text-3xl font-semibold tracking-tight sm:text-5xl">
            O núcleo pessoal de quem <span className="text-accent text-glow">constrói software</span>.
          </h1>
          <p
            className="mx-auto mt-5 max-w-xl animate-fade-up text-sm text-ink-secondary sm:text-base"
            style={{ animationDelay: "80ms" }}
          >
            Notas técnicas, snippets, erros resolvidos, ideias e projetos — organizados num só lugar,
            com um perfil público pra mostrar o que você constrói.
          </p>
          <div
            className="mt-8 flex animate-fade-up items-center justify-center gap-3"
            style={{ animationDelay: "140ms" }}
          >
            <Link href="/signup" className="btn btn-primary font-mono">
              $ criar conta grátis →
            </Link>
            <Link href="/login" className="btn btn-ghost">
              já tenho conta
            </Link>
            <Link href="/explore" className="btn btn-ghost">
              <Icon name="globe" size={14} />
              ver a comunidade
            </Link>
          </div>

          {/* terminal mockup */}
          <div
            className="mx-auto mt-14 max-w-2xl animate-fade-up overflow-hidden rounded-lg border border-border bg-surface-2 text-left shadow-popover"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center gap-1.5 border-b border-border bg-surface-1 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-status-critical/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-status-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-status-good/70" />
              <span className="ml-3 truncate font-mono text-xs text-ink-muted">zsh — ~/devhub</span>
            </div>
            <div className="space-y-2 p-5 font-mono text-xs sm:text-sm">
              <p className="text-ink-muted">$ devhub status</p>
              <p>
                <span className="text-section-dashboard">✓</span> 12 projetos <span className="text-ink-muted">·</span>{" "}
                <span className="text-section-vaults">✓</span> 48 snippets <span className="text-ink-muted">·</span>{" "}
                <span className="text-section-brain">✓</span> 23 notas
              </p>
              <p className="text-ink-muted">$ devhub deploy --project meu-saas</p>
              <p className="text-status-good">✓ build ok · 3.2s</p>
              <p className="flex items-center text-ink-muted">
                $ <span className="ml-1 inline-block h-3.5 w-1.5 animate-blink bg-accent" />
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 py-14 sm:px-10">
          <h2 className="text-center text-xs font-mono uppercase tracking-widest text-ink-muted">
            tudo que você precisa, nada que você não usa
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card card-hover animate-fade-up ${f.border}`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <Icon name={f.icon} size={20} className={f.color} />
                <div className="mt-3 text-sm font-semibold">{f.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="mx-auto max-w-5xl px-6 py-14 sm:px-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => (
              <div key={h.title} className="animate-fade-up text-center" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md border border-accent/40 bg-accent/10 text-accent">
                  <Icon name={h.icon} size={17} />
                </div>
                <div className="mt-3 text-sm font-semibold">{h.title}</div>
                <p className="mt-1 text-xs text-ink-muted">{h.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
          <div className="card animate-fade-up">
            <h2 className="text-lg font-semibold">Bora organizar o que você constrói?</h2>
            <p className="mt-2 text-sm text-ink-secondary">
              Grátis, com Supabase por trás — seus dados, suas regras (Row Level Security de verdade).
            </p>
            <Link href="/signup" className="btn btn-primary mt-5 font-mono">
              $ criar conta grátis →
            </Link>
          </div>
        </section>

        <footer className="border-t border-border px-6 py-8 text-center font-mono text-xs text-ink-muted sm:px-10">
          devHub — construído em público, com Next.js + Supabase.
        </footer>
      </main>
    </div>
  );
}
