import type { ReactNode } from 'react';

type ProductsListLayoutContentProps = {
  children: ReactNode;
  emptyFallback?: ReactNode;
  error?: ReactNode;
  errorAction?: ReactNode;
  isEmpty: boolean;
  isFetching?: boolean;
  isLoading: boolean;
  loadingFallback?: ReactNode;
  resultsSummary?: ReactNode;
  total?: number;
};

export const ProductsListLayoutContent = ({
  children,
  emptyFallback,
  error,
  errorAction,
  isEmpty,
  isFetching = false,
  isLoading,
  loadingFallback,
  resultsSummary,
  total,
}: ProductsListLayoutContentProps) => {
  if (isLoading) {
    return (
      <>
        {loadingFallback ?? (
          <p className="block-small text-typography-secondary">Loading...</p>
        )}
      </>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div>{error}</div>
        {errorAction}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <>
        {emptyFallback ?? (
          <p className="block-small text-typography-secondary">
            No products found. Try adjusting your filters.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      {resultsSummary ??
        (total !== undefined && (
          <span className="block-small text-typography-secondary">
            {total} products found
          </span>
        ))}
      {isFetching && (
        <span className="block-small text-typography-secondary">
          Updating products...
        </span>
      )}
      {children}
    </>
  );
};
