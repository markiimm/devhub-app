"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="overflow-hidden rounded-lg border border-border bg-surface-2 shadow-popover">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface-1 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-status-critical/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-status-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-status-good/70" />
            <span className="ml-3 truncate font-mono text-xs text-ink-muted">zsh — erro</span>
          </div>
          <div className="p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-status-critical/40 bg-status-critical/10 text-status-critical">
                <Icon name="zap" size={16} />
              </div>
              <div>
                <h1 className="text-base font-semibold">Algo quebrou por aqui</h1>
                <p className="mt-1 text-sm text-ink-secondary">
                  {error.message || "Erro inesperado ao carregar esta página."}
                </p>
              </div>
            </div>
            <button onClick={() => reset()} className="btn btn-primary mt-5 font-mono">
              $ retry →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
