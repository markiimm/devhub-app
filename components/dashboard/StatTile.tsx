import { Icon } from "@/components/ui/Icon";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const ACCENTS: Record<string, string> = {
  cyan: "text-section-dashboard",
  orange: "text-section-projects",
  green: "text-section-vaults",
  violet: "text-section-brain",
};

export function StatTile({
  label,
  value,
  icon,
  accent = "cyan",
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent?: keyof typeof ACCENTS;
  delay?: number;
}) {
  return (
    <div
      className="card card-hover animate-fade-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className={`${ACCENTS[accent]} transition-transform duration-300 group-hover:scale-110`}>
          <Icon name={icon} size={17} />
        </span>
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tracking-tight">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </div>
      <div className="mt-0.5 text-xs text-ink-muted">{label}</div>
    </div>
  );
}
