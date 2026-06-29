import { ProductCardSkeleton } from '../../../entities/product';
import { Skeleton } from '../../../shared/ui';

export const SingleProductLoading = () => {
  return (
    <div
      className="container mx-auto flex flex-col gap-6 px-2.5"
      aria-label="Loading product"
    >
      <header className="flex flex-col gap-4 pb-4 md:flex-row md:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-5/6 max-w-md" />
          <Skeleton className="h-7 w-2/3 max-w-md" />
        </div>
        <Skeleton className="h-10 w-10" />
      </header>

      <main className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)] lg:items-start">
        <section className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <Skeleton className="aspect-4/5 w-full sm:aspect-3/4 lg:aspect-4/5" />
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full" />
            ))}
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-36" />
          </div>

          <div className="rounded border border-border-soft bg-background-surface p-4">
            <Skeleton className="h-8 w-40" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-24" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-20" />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-20" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-14" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-5 w-52" />
          </div>
        </section>
      </main>

      <footer className="py-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
