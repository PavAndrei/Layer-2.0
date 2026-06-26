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
    return <>{loadingFallback ?? <p>Loading...</p>}</>;
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
        {emptyFallback ?? <p>No products found. Try adjusting your filters.</p>}
      </>
    );
  }

  return (
    <>
      {resultsSummary ??
        (total !== undefined ? <span>{total} products found</span> : null)}
      {isFetching && <span>Updating products...</span>}
      {children}
    </>
  );
};
