import { Icon } from "@/components/ui/Icon";

export function StatTile({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="text-ink-muted">
          <Icon name={icon} size={17} />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-ink-muted">{label}</div>
    </div>
  );
}
