import { Skeleton } from "@/components/ui/Skeleton";

export default function ProjectDetailLoading() {
  return (
    <div>
      <div className="border-b border-border px-8 py-7 sm:px-10">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2.5 h-3.5 w-64" />
      </div>
      <div className="space-y-5 p-8 sm:p-10">
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <Skeleton className="h-1.5 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card space-y-2.5">
              <Skeleton className="mb-1 h-4 w-28" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
        <div className="card space-y-2.5">
          <Skeleton className="mb-1 h-4 w-56" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
