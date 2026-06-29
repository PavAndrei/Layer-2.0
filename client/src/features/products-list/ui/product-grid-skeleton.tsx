import { ProductCardSkeleton } from '../../../entities/product';

type ProductGridSkeletonProps = {
  count?: number;
};

export const ProductGridSkeleton = ({
  count = 8,
}: ProductGridSkeletonProps) => {
  return (
    <div
      className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-3 2xl:grid-cols-4 2xl:gap-4"
      aria-label="Loading products"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
