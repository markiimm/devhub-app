import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <AnimatedBackground color="#22d3ee" />

      <div className="w-full max-w-md animate-fade-up text-center">
        <div className="mb-6 flex items-center justify-center gap-2.5">
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
            <span className="ml-3 truncate font-mono text-xs text-ink-muted">zsh — ~/devhub</span>
          </div>
          <div className="p-8 text-left">
            <p className="font-mono text-xs text-status-critical">$ cd {"{rota-desconhecida}"}</p>
            <p className="mt-1.5 font-mono text-xs text-ink-muted">
              zsh: no such file or directory
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">404 — rota não encontrada</h1>
            <p className="mt-1.5 text-sm text-ink-secondary">
              Essa página não existe (ou já foi removida). Bora voltar pro dashboard.
            </p>
            <Link href="/dashboard" className="btn btn-primary mt-6 font-mono">
              $ cd ~/dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
