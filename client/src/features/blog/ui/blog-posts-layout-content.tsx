import type { ReactNode } from 'react';

type BlogPostsLayoutContentProps = {
  children: ReactNode;
  emptyFallback?: ReactNode;
  error?: ReactNode;
  errorFallback?: ReactNode;
  isEmpty: boolean;
  isFetching?: boolean;
  isLoading: boolean;
  loadingFallback?: ReactNode;
  resultsSummary?: ReactNode;
  total?: number;
};

export const BlogPostsLayoutContent = ({
  children,
  emptyFallback,
  error,
  errorFallback,
  isEmpty,
  isFetching = false,
  isLoading,
  loadingFallback,
  resultsSummary,
  total,
}: BlogPostsLayoutContentProps) => {
  if (isLoading) {
    return (
      <>
        {loadingFallback ?? (
          <p className="block-small text-typography-secondary">
            Loading articles...
          </p>
        )}
      </>
    );
  }

  if (error) {
    return <>{errorFallback ?? <div>{error}</div>}</>;
  }

  if (isEmpty) {
    return (
      <>
        {emptyFallback ?? (
          <p className="block-small text-typography-secondary">
            No articles found.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {resultsSummary ??
          (total !== undefined && (
            <span className="block-small text-typography-secondary">
              {total} articles found
            </span>
          ))}
        {isFetching && (
          <span className="block-small text-typography-secondary">
            Updating articles...
          </span>
        )}
      </div>
      {children}
    </>
  );
};
