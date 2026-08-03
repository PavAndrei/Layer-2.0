import { Skeleton } from '../../../shared/ui';

export const BlogPostDetailSkeleton = () => {
  return (
    <main
      className="container mx-auto flex flex-col gap-6 px-2.5"
      aria-label="Loading article"
      aria-live="polite"
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-4/5 max-w-190" />
        <Skeleton className="h-6 w-full max-w-160" />
      </div>
      <Skeleton className="aspect-[16/7] w-full max-h-110" />
      <div className="flex w-full flex-col gap-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-5 w-full" />
      </div>
    </main>
  );
};
