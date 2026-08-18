import { Icon } from "./Icon";

export function EmptyState({
  icon = "box",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-border py-16 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-border bg-surface-3 text-ink-muted">
        <Icon name={icon} size={18} />
      </div>
      <div>
        <p className="text-sm font-medium text-ink-primary">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
