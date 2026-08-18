"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const DNA_LABELS: Record<string, string> = {
  arquitetura: "Arquitetura",
  banco: "Banco de dados",
  auth: "Autenticação",
  hospedagem: "Hospedagem",
  ferramentas: "Ferramentas",
};

interface ReadmeProject {
  name: string;
  tagline: string | null;
  status: string;
  tech: string[];
  github: string | null;
  dna: Record<string, string> | null;
}

function buildReadme(p: ReadmeProject): string {
  const lines: string[] = [`# ${p.name}`];

  if (p.tagline) lines.push("", p.tagline);

  lines.push("", `> Status: **${p.status}**`);

  if (p.tech?.length > 0) {
    lines.push("", "## Stack", "", ...p.tech.map((t) => `- ${t}`));
  }

  const dnaEntries = Object.entries(p.dna ?? {}).filter(([, v]) => v);
  if (dnaEntries.length > 0) {
    lines.push("", "## Arquitetura do projeto", "");
    for (const [key, value] of dnaEntries) {
      lines.push(`- **${DNA_LABELS[key] ?? key}**: ${value}`);
    }
  }

  lines.push("", "## Como rodar", "", "```bash", "npm install", "npm run dev", "```");

  if (p.github) {
    lines.push("", "---", "", `[Repositório no GitHub](https://${p.github.replace(/^https?:\/\//, "")})`);
  }

  return lines.join("\n") + "\n";
}

export function ReadmeGenerator({ project }: { project: ReadmeProject }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const markdown = useMemo(() => buildReadme(project), [project]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponível — sem problema, botão só não confirma visualmente.
    }
  }

  return (
    <div className="card card-hover">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between font-mono text-sm font-medium text-section-projects"
      >
        <span>$ gerar README.md</span>
        <Icon name="chevronRight" size={13} className={`transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="relative mt-4 rounded-sm border-2 border-border bg-bg p-3 pt-9">
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 flex items-center gap-1.5 rounded-sm border border-border-strong bg-surface-3 px-2 py-1 font-mono text-xs text-ink-secondary transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Icon name={copied ? "check" : "copy"} size={12} />
            {copied ? "copiado" : "copiar"}
          </button>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink-secondary">
            {markdown}
          </pre>
        </div>
      )}
    </div>
  );
}
