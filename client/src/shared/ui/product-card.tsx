import { Link } from 'react-router';

import type { ProductCardProps as ProductCardData } from '../types';
import { ProductPrice } from './product-price';

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
    <div className="flex flex-col gap-3 rounded border p-1 lg:px-1 lg:py-2 2xl:px-2 2xl:py-3">
      <Link to={to} className="rounded bg-gray-300 text-gray-300">
        <img
          src={product.img}
          alt={product.title}
          className="h-48 w-full rounded object-cover"
        />
      </Link>
      <div className="flex flex-col gap-1">
        <Link to={to}>
          <h3 className="text-xl font-bold capitalize">{product.title}</h3>
        </Link>
        <p>{product.description}</p>
        <ProductPrice
          defaultPrice={product.defaultPrice}
          discountPrice={product.discountPrice}
          discountPercent={product.discountPercent}
          hasDiscount={product.hasDiscount}
        />
        <div>rating: {product.rating}</div>
        <div>categories: {product.categories.join(', ')}</div>
        <div className="flex flex-col gap-1">
          <span>Available colors:</span>
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
      </div>
    </div>
  );
};

