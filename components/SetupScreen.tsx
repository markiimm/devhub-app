import { Icon } from "@/components/ui/Icon";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export function SetupScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <AnimatedBackground color="#22d3ee" />

      <div className="w-full max-w-lg animate-fade-up">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-accent/50 bg-accent/10 font-mono text-sm font-bold text-accent shadow-glow">
            DH
          </div>
          <span className="font-mono text-lg font-semibold tracking-tight">
            dev<span className="text-accent">Hub</span>
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface-2 shadow-popover">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface-1 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-status-critical/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-status-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-status-good/70" />
            <span className="ml-3 truncate font-mono text-xs text-ink-muted">zsh — ~/devhub/setup</span>
          </div>

          <div className="p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-accent/50 bg-accent/10 text-accent">
                <Icon name="zap" size={16} />
              </div>
              <div>
                <h1 className="text-base font-semibold">Conecte o Supabase para continuar</h1>
                <p className="mt-1 text-sm text-ink-secondary">
                  O app está pronto, mas ainda não tem um banco de dados conectado.
                </p>
              </div>
            </div>

            <ol className="mt-5 space-y-3 border-t border-border pt-5 text-sm text-ink-secondary">
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs font-medium text-accent">
                  1
                </span>
                <span>
                  Crie um projeto grátis em <span className="font-mono text-ink-primary">supabase.com</span>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs font-medium text-accent">
                  2
                </span>
                <span>
                  Abra o <span className="font-mono text-ink-primary">SQL Editor</span> do projeto e rode o conteúdo
                  de <span className="font-mono text-ink-primary">supabase/schema.sql</span>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs font-medium text-accent">
                  3
                </span>
                <span>
                  Copie <span className="font-mono text-ink-primary">Project URL</span> e{" "}
                  <span className="font-mono text-ink-primary">anon public key</span> em Project Settings → API.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs font-medium text-accent">
                  4
                </span>
                <span>
                  Cole os dois valores em <span className="font-mono text-ink-primary">.env.local</span> (copie de{" "}
                  <span className="font-mono text-ink-primary">.env.local.example</span>) e reinicie{" "}
                  <span className="font-mono text-ink-primary">npm run dev</span>.
                </span>
              </li>
            </ol>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-ink-muted">
          O passo a passo completo está no <span className="font-mono">README.md</span> do projeto.
        </p>
      </div>
    </div>
  );
}
