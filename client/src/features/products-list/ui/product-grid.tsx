import { ProductCardProps } from '../../../shared/types';
import { ProductCard } from './product-card';

export const ProductGrid = ({ products }: { products: ProductCardProps[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 md:gap-2 lg:gap-3 2xl:gap-4">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
