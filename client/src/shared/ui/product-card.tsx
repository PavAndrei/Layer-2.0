import { Link } from 'react-router';

import type { ProductCardProps as ProductCardData } from '../types';
import { ProductPrice } from './product-price';
import { StarRating } from './star-rating';

type ProductCardProps = {
  product: ProductCardData;
  to: string;
};

export const ProductCard = ({ product, to }: ProductCardProps) => {
  const availableColors = [
    ...new Set(
      product.variants
        .filter((variant) => variant.quantity > 0)
        .map((variant) => variant.color),
    ),
  ];

  return (
    <div className="flex flex-col gap-4 rounded border border-border-soft p-2 bg-background-surface">
      <div className="flex flex-col gap-2">
        <div className="aspect-4/5 overflow-hidden rounded bg-background-secondary">
          <img
            src={product.img}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        {availableColors.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {availableColors.map((color) => (
              <span
                key={color}
                className="rounded-full bg-gray-200 px-2 py-0.5 text-sm capitalize"
              >
                {color.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        ) : (
          <span className="font-semibold text-red-600">Out of stock</span>
        )}
      </div>
      <div className="flex flex-col max-h-full h-full">
        <Link to={to} className="mb-1">
          <h3 className="block-title text-typography-heading">
            {product.title}
          </h3>
        </Link>
        <p className="block-small text-typography-secondary mb-3">
          {product.description}
        </p>
        <div className="flex flex-col gap-2 mt-auto mb-0">
          <ProductPrice
            defaultPrice={product.defaultPrice}
            discountPrice={product.discountPrice}
            discountPercent={product.discountPercent}
            hasDiscount={product.hasDiscount}
          />
          <StarRating rating={product.rating} />
        </div>
      </div>
    </div>
  );
};
