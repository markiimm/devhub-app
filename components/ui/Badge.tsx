const VARIANTS: Record<string, string> = {
  neutral: "border-border bg-surface-3 text-ink-secondary",
  accent: "border-accent/30 bg-accent/10 text-accent",
  good: "border-status-good/30 bg-status-good/10 text-status-good",
  warning: "border-status-warning/30 bg-status-warning/10 text-status-warning",
  serious: "border-status-serious/30 bg-status-serious/10 text-status-serious",
  critical: "border-status-critical/30 bg-status-critical/10 text-status-critical",
  violet: "border-series-violet/30 bg-series-violet/10 text-series-violet",
};

const STATUS_MAP: Record<string, string> = {
  "Em desenvolvimento": "accent",
  Pausado: "warning",
  Concluído: "good",
  Aberto: "critical",
  Investigando: "warning",
  Resolvido: "good",
  Usando: "good",
  "Quero testar": "accent",
  good: "good",
  warning: "warning",
  serious: "serious",
  critical: "critical",
};

export function Badge({ children, variant = "neutral" }: { children: React.ReactNode; variant?: string }) {
  const cls = VARIANTS[variant] ?? VARIANTS.neutral;
  return <span className={`badge ${cls}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_MAP[status] ?? "neutral";
  return <Badge variant={variant}>{status}</Badge>;
}
