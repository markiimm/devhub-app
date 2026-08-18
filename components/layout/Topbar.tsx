import { LogoutButton } from "./LogoutButton";

const ACCENTS: Record<string, string> = {
  dashboard: "from-section-dashboard/60",
  brain: "from-section-brain/60",
  vaults: "from-section-vaults/60",
  projects: "from-section-projects/60",
};

export function Topbar({
  title,
  subtitle,
  actions,
  accent = "dashboard",
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  accent?: keyof typeof ACCENTS;
}) {
  return (
    <header className="relative border-b border-border px-8 py-7 sm:px-10">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${ACCENTS[accent]} to-transparent`} />
      <div className="flex animate-fade-up items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-secondary">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
