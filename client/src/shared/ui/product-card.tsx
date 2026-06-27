import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

import type {
  ProductCardProps as ProductCardData,
  ProductVariant,
} from '../types';
import { ProductCardColorSelector } from './product-card-color-selector';
import { ProductPrice } from './product-price';
import { StarRating } from './star-rating';

type ProductCardProps = {
  product: ProductCardData;
  to: string;
};

const buildProductUrl = (to: string, variant: ProductVariant | null) => {
  if (!variant) return to;

  const searchParams = new URLSearchParams({
    color: variant.color,
    size: variant.size,
  });

  return `${to}?${searchParams.toString()}`;
};

export const ProductCard = ({ product, to }: ProductCardProps) => {
  const firstAvailableVariant = useMemo(() => {
    return product.variants.find((variant) => variant.quantity > 0) ?? null;
  }, [product.variants]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    firstAvailableVariant,
  );

  useEffect(() => {
    setSelectedVariant(firstAvailableVariant);
  }, [firstAvailableVariant]);

  const colorOptions = useMemo(() => {
    const uniqueColors = [
      ...new Set(product.variants.map((variant) => variant.color)),
    ];

    return uniqueColors.map((color) => ({
      color,
      isAvailable: product.variants.some(
        (variant) => variant.color === color && variant.quantity > 0,
      ),
    }));
  }, [product.variants]);

  const productUrl = buildProductUrl(to, selectedVariant);
  const previewImage = selectedVariant?.image ?? product.img;
  const isOutOfStock = !firstAvailableVariant;

  const handleColorChange = (color: string) => {
    const nextVariant = product.variants.find(
      (variant) => variant.color === color && variant.quantity > 0,
    );

    if (!nextVariant) return;

    setSelectedVariant(nextVariant);
  };

  return (
    <div className="flex flex-col gap-4 rounded border border-border-soft p-2 bg-background-surface">
      <div className="flex flex-col gap-2">
        <Link
          to={productUrl}
          className="group aspect-4/5 overflow-hidden rounded bg-background-secondary"
        >
          <img
            src={previewImage}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="flex items-center justify-between">
          <ProductCardColorSelector
            colors={colorOptions}
            selectedColor={selectedVariant?.color ?? null}
            onColorChange={handleColorChange}
          />

          {isOutOfStock && (
            <span className="badge text-accent-secondary">Out of stock</span>
          )}
        </div>
      </div>
      <div className="flex flex-col max-h-full h-full">
        <Link to={productUrl} className="mb-1">
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
