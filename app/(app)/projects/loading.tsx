import { Skeleton } from "@/components/ui/Skeleton";

export default function ProjectsLoading() {
  return (
    <div>
      <div className="border-b border-border px-8 py-7 sm:px-10">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2.5 h-3.5 w-80" />
      </div>
      <div className="space-y-5 p-8 sm:p-10">
        <Skeleton className="h-11 w-full" />
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3.5 w-8" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3.5 w-56" />
              <Skeleton className="h-1.5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
