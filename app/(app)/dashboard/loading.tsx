import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div className="border-b border-border px-8 py-7 sm:px-10">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2.5 h-3.5 w-72" />
      </div>
      <div className="p-8 sm:p-10">
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card space-y-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-7 w-10" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
        <div className="mt-8 card">
          <Skeleton className="mb-4 h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="mt-8 card">
          <Skeleton className="mb-4 h-4 w-32" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card space-y-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
