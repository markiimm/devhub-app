import { Skeleton } from "@/components/ui/Skeleton";

export default function BrainLoading() {
  return (
    <div>
      <div className="flex items-start justify-between border-b border-border px-8 py-7 sm:px-10">
        <div>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="mt-2.5 h-3.5 w-96" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-[280px_1fr] gap-6 p-8 sm:p-10">
        <div className="card space-y-2 !p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5 px-2 py-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
        <div className="card">
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
