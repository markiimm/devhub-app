import { fetchGithubRepo } from "@/lib/github";
import { Icon } from "@/components/ui/Icon";

export async function GithubCard({ repo }: { repo: string }) {
  const info = await fetchGithubRepo(repo);
  if (!info) return null;

  return (
    <a
      href={info.url}
      target="_blank"
      rel="noreferrer"
      className="card card-hover block hover:border-ink-primary/30"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 font-mono text-sm font-medium">
          <Icon name="github" size={16} className="shrink-0 text-ink-muted" />
          <span className="truncate">{info.fullName}</span>
        </div>
        <Icon name="chevronRight" size={14} className="shrink-0 text-ink-muted" />
      </div>
      {info.description && <p className="mt-1.5 text-xs text-ink-muted">{info.description}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-ink-secondary">
        {info.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {info.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Icon name="star" size={12} className="text-status-warning" />
          {info.stars}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="gitFork" size={12} className="text-ink-muted" />
          {info.forks}
        </span>
        {info.openIssues > 0 && <span className="text-ink-muted">{info.openIssues} issues abertas</span>}
      </div>
    </a>
  );
}
