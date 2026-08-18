import { buildHeatmapWeeks, heatmapLevel } from "@/lib/heatmap";

const LEVEL_CLASSES = ["bg-surface-3", "bg-accent/25", "bg-accent/50", "bg-accent/75", "bg-accent"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function ActivityHeatmap({ timestamps }: { timestamps: string[] }) {
  const weeks = buildHeatmapWeeks(timestamps);
  let lastMonth = -1;

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex gap-[3px]">
          {weeks.map((week, wi) => {
            const firstDay = new Date(week[0].date);
            const month = firstDay.getMonth();
            const showLabel = month !== lastMonth;
            if (showLabel) lastMonth = month;
            return (
              <div key={wi} className="flex flex-col gap-[3px]">
                <div className="h-3 font-mono text-[9px] leading-3 text-ink-muted">
                  {showLabel ? MONTHS[month] : ""}
                </div>
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date} · ${day.count} ${day.count === 1 ? "atividade" : "atividades"}`}
                    className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_CLASSES[heatmapLevel(day.count)]}`}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-ink-muted">
        menos
        {LEVEL_CLASSES.map((c) => (
          <span key={c} className={`h-[11px] w-[11px] rounded-[2px] ${c}`} />
        ))}
        mais
      </div>
    </div>
  );
}
