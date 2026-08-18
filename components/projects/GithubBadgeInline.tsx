import { Icon } from "@/components/ui/Icon";
import type { GithubRepoInfo } from "@/lib/github";

export function GithubBadgeInline({ info }: { info: GithubRepoInfo }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-sm border border-border bg-surface-3 px-2 py-1 font-mono text-xs text-ink-secondary">
      <Icon name="github" size={12} />
      <span className="flex items-center gap-1">
        <Icon name="star" size={11} className="text-status-warning" />
        {info.stars}
      </span>
      {info.language && <span className="text-ink-muted">{info.language}</span>}
    </span>
  );
}
