import { Skeleton } from "@/components/ui/Skeleton";

export default function VaultsLoading() {
  return (
    <div>
      <div className="border-b border-border px-8 py-7 sm:px-10">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-2.5 h-3.5 w-80" />
      </div>
      <div className="p-8 sm:p-10">
        <div className="mb-7 flex gap-4 border-b-2 border-border pb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <Skeleton className="h-11 w-full" />
        <div className="mt-4 grid grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
