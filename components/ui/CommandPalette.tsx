"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";

type Router = ReturnType<typeof useRouter>;

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: string;
  color: string;
  action: (router: Router) => void | Promise<void>;
};

export function CommandPalette() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const commands: Command[] = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", hint: "visão geral", icon: "grid", color: "text-section-dashboard", action: (r) => r.push("/dashboard") },
      { id: "brain", label: "Dev Brain", hint: "notas e conhecimento", icon: "code", color: "text-section-brain", action: (r) => r.push("/brain") },
      { id: "brain-new", label: "Nova nota", hint: "Dev Brain", icon: "plus", color: "text-section-brain", action: (r) => r.push("/brain?id=new") },
      { id: "vaults", label: "Vaults", hint: "código, erros, ideias, ferramentas", icon: "box", color: "text-section-vaults", action: (r) => r.push("/vaults") },
      { id: "vaults-code", label: "Code Vault", hint: "Vaults", icon: "code", color: "text-section-vaults", action: (r) => r.push("/vaults?tab=code") },
      { id: "vaults-error", label: "Error Vault", hint: "Vaults", icon: "bug", color: "text-section-vaults", action: (r) => r.push("/vaults?tab=error") },
      { id: "vaults-idea", label: "Idea Vault", hint: "Vaults", icon: "bulb", color: "text-section-vaults", action: (r) => r.push("/vaults?tab=idea") },
      { id: "vaults-tool", label: "Tool Vault", hint: "Vaults", icon: "wrench", color: "text-section-vaults", action: (r) => r.push("/vaults?tab=tool") },
      { id: "projects", label: "Project Lab", hint: "seus projetos", icon: "folder", color: "text-section-projects", action: (r) => r.push("/projects") },
      { id: "settings", label: "Configurações", hint: "perfil público", icon: "user", color: "text-ink-secondary", action: (r) => r.push("/settings") },
      { id: "explore", label: "Comunidade", hint: "devs em destaque", icon: "globe", color: "text-accent", action: (r) => r.push("/explore") },
      {
        id: "logout",
        label: "Sair",
        hint: "encerrar sessão",
        icon: "logOut",
        color: "text-status-critical",
        action: async (r) => {
          await supabase.auth.signOut();
          r.push("/login");
          r.refresh();
        },
      },
    ],
    [supabase]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filtered = commands.filter((c) =>
    `${c.label} ${c.hint ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function runCommand(cmd: Command) {
    setOpen(false);
    cmd.action(router);
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) runCommand(cmd);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="focus-ring flex w-full items-center justify-between rounded-sm border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:border-border-strong hover:text-ink-secondary"
      >
        <span className="flex items-center gap-1.5">
          <Icon name="search" size={13} />
          Buscar
        </span>
        <kbd className="rounded-sm border border-border bg-surface-3 px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-lg animate-fade-up overflow-hidden rounded-lg border border-border bg-surface-2 shadow-popover"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Icon name="search" size={15} className="text-ink-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Ir para... (dashboard, vaults, nova nota)"
                  className="w-full bg-transparent font-mono text-sm text-ink-primary outline-none placeholder:text-ink-muted"
                />
                <kbd className="rounded-sm border border-border bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                  esc
                </kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-ink-muted">Nenhum comando encontrado.</p>
                )}
                {filtered.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => runCommand(c)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors ${
                      i === activeIndex ? "bg-surface-3 text-ink-primary" : "text-ink-secondary"
                    }`}
                  >
                    <Icon name={c.icon} size={15} className={c.color} />
                    <span className="flex-1">{c.label}</span>
                    {c.hint && <span className="text-xs text-ink-muted">{c.hint}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
