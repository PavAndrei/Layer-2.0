import { Skeleton } from '../../../shared/ui';

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-2">
      <Skeleton className="aspect-4/5 w-full" />

      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
};
