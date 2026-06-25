import type { ReactNode } from 'react';

type ProductsListLayoutContentProps = {
  children: ReactNode;
  emptyFallback?: ReactNode;
  error?: ReactNode;
  isEmpty: boolean;
  isLoading: boolean;
  loadingFallback?: ReactNode;
  resultsSummary?: ReactNode;
  total?: number;
};

export const ProductsListLayoutContent = ({
  children,
  emptyFallback,
  error,
  isEmpty,
  isLoading,
  loadingFallback,
  resultsSummary,
  total,
}: ProductsListLayoutContentProps) => {
  if (isLoading) {
    return <>{loadingFallback ?? <p>Loading...</p>}</>;
  }

  if (error) {
    return <>{error}</>;
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
      {children}
    </>
  );
};
