import type { ReactNode } from 'react';

type ProductsListLayoutContentProps = {
  children: ReactNode;
  error?: string | null;
  isEmpty: boolean;
  isLoading: boolean;
  total: number;
};

export const ProductsListLayoutContent = ({
  children,
  error,
  isEmpty,
  isLoading,
  total,
}: ProductsListLayoutContentProps) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (isEmpty) {
    return <p>No products found. Try adjusting your filters.</p>;
  }

  return (
    <>
      <span>{total} products found</span>
      {children}
    </>
  );
};
