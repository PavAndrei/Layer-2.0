import type { ProductCardProps } from '../../../shared/types';
import { ProductPrice } from '../../../shared/ui';

type ProductInfoProps = {
  product: ProductCardProps;
};

export const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p>{product.description}</p>
      <ProductPrice
        defaultPrice={product.defaultPrice}
        discountPrice={product.discountPrice}
        discountPercent={product.discountPercent}
        hasDiscount={product.hasDiscount}
      />
      <p>Total in stock: {product.totalQuantity}</p>
      <p>Discount: {product.discountPercent}%</p>
      <p>Rating: {product.rating}</p>
      <p>Has Discount: {product.hasDiscount ? 'Yes' : 'No'}</p>
      <p>Is New: {product.isNewProduct ? 'Yes' : 'No'}</p>
    </div>
  );
};
