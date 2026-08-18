import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div>
      <div className="border-b border-border px-8 py-7 sm:px-10">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2.5 h-3.5 w-80" />
      </div>
      <div className="space-y-5 p-8 sm:p-10">
        <div className="card space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="card space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
