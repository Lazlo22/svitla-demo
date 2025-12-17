import { Skeleton } from '@ui/skeleton';

export function PdfLoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <Skeleton className="w-[600px] h-[800px]" />
    </div>
  );
}

PdfLoadingState.displayName = 'PdfLoadingState';
