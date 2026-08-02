import { Skeleton } from '../../../shared/ui';

type BlogPostsSkeletonProps = {
  count?: number;
};

export const BlogPostsSkeleton = ({
  count = 6,
}: BlogPostsSkeletonProps) => {
  return (
    <div
      className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Loading articles"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};
