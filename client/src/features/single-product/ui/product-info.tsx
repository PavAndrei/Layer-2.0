import { ProductPrice, type Product } from '../../../entities/product';
import { StarRating } from '../../../shared/ui';

type ProductInfoProps = {
  product: Product;
};

export const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="block-medium">{product.description}</p>
      <ProductPrice
        defaultPrice={product.defaultPrice}
        discountPrice={product.discountPrice}
        discountPercent={product.discountPercent}
        hasDiscount={product.hasDiscount}
      />
      <div className="flex flex-wrap items-center gap-2">
        <StarRating rating={product.rating} />
        <span className="block-small text-typography-secondary">
          {product.reviewsCount}{' '}
          {product.reviewsCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {product.hasDiscount && <p className="badge animate-pulse">Sale</p>}
        {product.isNewProduct && (
          <p className="badge animate-pulse">New Arrival</p>
        )}
      </div>
    </div>
  );
};
