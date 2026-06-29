import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { ProductCard, type Product } from '../../../entities/product';

type ProductGridProps = {
  products: Product[];
  sourceLabel: string;
};

export const ProductGrid = ({ products, sourceLabel }: ProductGridProps) => {
  const location = useLocation();
  const productLinkState = useMemo(
    () => ({
      from: {
        label: sourceLabel,
        to: `${location.pathname}${location.search}`,
      },
    }),
    [location.pathname, location.search, sourceLabel],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 md:gap-2 lg:gap-3 2xl:gap-4">
      {products?.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          state={productLinkState}
          to={`/products/${product._id}`}
        />
      ))}
    </div>
  );
};
