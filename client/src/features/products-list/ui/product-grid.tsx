import { ProductCardProps } from '../../../shared/types';
import { ProductCard } from '../../../shared/ui';

export const ProductGrid = ({ products }: { products: ProductCardProps[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 md:gap-2 lg:gap-3 2xl:gap-4">
      {products?.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          to={`/products/${product._id}`}
        />
      ))}
    </div>
  );
};
