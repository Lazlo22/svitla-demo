import { Skeleton } from '@ui/skeleton';

export default function GlobalLoader() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex w-64 border-r bg-white flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 p-2 space-y-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b bg-white px-4 flex items-center gap-2">
          <Skeleton className="h-7 w-7 md:hidden" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex-1 p-4 md:p-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

GlobalLoader.displayName = 'GlobalLoader';
