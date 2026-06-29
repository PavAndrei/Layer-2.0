import { Skeleton } from '../../../shared/ui';

type ReviewListSkeletonProps = {
  count?: number;
};

export const ReviewListSkeleton = ({ count = 2 }: ReviewListSkeletonProps) => {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading reviews">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded border border-border-soft bg-background-surface p-3"
        >
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
};
