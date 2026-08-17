import { Icon } from "@/components/ui/Icon";

export function SetupScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
            DH
          </div>
          <span className="text-lg font-semibold">DevHub</span>
        </div>
        <div className="card">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
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
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-medium text-ink-primary">1</span>
              <span>
                Crie um projeto grátis em{" "}
                <span className="font-mono text-ink-primary">supabase.com</span>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-medium text-ink-primary">2</span>
              <span>
                Abra o <span className="font-mono text-ink-primary">SQL Editor</span> do projeto e rode o conteúdo de{" "}
                <span className="font-mono text-ink-primary">supabase/schema.sql</span>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-medium text-ink-primary">3</span>
              <span>
                Copie <span className="font-mono text-ink-primary">Project URL</span> e{" "}
                <span className="font-mono text-ink-primary">anon public key</span> em Project Settings → API.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-medium text-ink-primary">4</span>
              <span>
                Cole os dois valores em <span className="font-mono text-ink-primary">.env.local</span> (copie de{" "}
                <span className="font-mono text-ink-primary">.env.local.example</span>) e reinicie{" "}
                <span className="font-mono text-ink-primary">npm run dev</span>.
              </span>
            </li>
          </ol>
        </div>
        <p className="mt-4 text-center text-xs text-ink-muted">O passo a passo completo está no README.md do projeto.</p>
      </div>
    </div>
  );
}
