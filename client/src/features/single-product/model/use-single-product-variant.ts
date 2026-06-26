import { useCallback, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import {
  PRODUCT_SIZES,
  type ProductCardProps,
  type ProductSize,
} from '../../../shared/types';

type UseSingleProductVariantParams = {
  product: ProductCardProps | null;
  selectedColor: string | null;
  selectedSize: ProductSize | null;
  setVariantParams: Dispatch<
    SetStateAction<{
      color: string;
      size: ProductSize | '';
    }>
  >;
};

export const useSingleProductVariant = ({
  product,
  selectedColor,
  selectedSize,
  setVariantParams,
}: UseSingleProductVariantParams) => {
  const colors = useMemo(() => {
    if (!product) return [];

    return [...new Set(product.variants.map((variant) => variant.color))];
  }, [product]);

  const sizes = useMemo(() => {
    if (!product || !selectedColor) return [];

    return PRODUCT_SIZES.filter((size) =>
      product.variants.some(
        (variant) => variant.color === selectedColor && variant.size === size,
      ),
    );
  }, [product, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;

    return (
      product.variants.find(
        (variant) =>
          variant.color === selectedColor && variant.size === selectedSize,
      ) ?? null
    );
  }, [product, selectedColor, selectedSize]);

  const isColorAvailable = useCallback(
    (color: string) => {
      return Boolean(
        product?.variants.some(
          (variant) => variant.color === color && variant.quantity > 0,
        ),
      );
    },
    [product],
  );

  const isSizeAvailable = useCallback(
    (size: ProductSize) => {
      return Boolean(
        product?.variants.some(
          (variant) =>
            variant.color === selectedColor &&
            variant.size === size &&
            variant.quantity > 0,
        ),
      );
    },
    [product, selectedColor],
  );

  const handleColorChange = useCallback(
    (color: string) => {
      if (!product) {
        setVariantParams((prev) => ({
          ...prev,
          color,
          size: '',
        }));
        return;
      }

      const availableSizes = PRODUCT_SIZES.filter((size) =>
        product.variants.some(
          (variant) =>
            variant.color === color &&
            variant.size === size &&
            variant.quantity > 0,
        ),
      );

      setVariantParams((prev) => ({
        ...prev,
        color,
        size: availableSizes.length === 1 ? availableSizes[0] : '',
      }));
    },
    [product, setVariantParams],
  );

  return {
    colors,
    sizes,
    selectedVariant,
    handleColorChange,
    isColorAvailable,
    isSizeAvailable,
  };
};
