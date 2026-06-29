import { useCallback, useEffect, useMemo } from 'react';

import type { UrlStateSetter } from '../../../shared/model';
import {
  PRODUCT_SIZES,
  type Product,
  type ProductSize,
} from '../../../entities/product';

type UseSingleProductVariantParams = {
  product: Product | null;
  selectedColor: string | null;
  selectedSize: ProductSize | null;
  setVariantParams: UrlStateSetter<{
    color: string;
    size: ProductSize | '';
  }>;
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

  useEffect(() => {
    if (!product) return;

    const firstAvailableVariant =
      product.variants.find((variant) => variant.quantity > 0) ?? null;

    if (!firstAvailableVariant) {
      if (selectedColor || selectedSize) {
        setVariantParams(
          {
            color: '',
            size: '',
          },
          { replace: true },
        );
      }

      return;
    }

    if (selectedVariant?.quantity && selectedVariant.quantity > 0) {
      return;
    }

    const selectedColorExists = product.variants.some(
      (variant) => variant.color === selectedColor,
    );
    const firstAvailableVariantForSelectedColor = selectedColorExists
      ? product.variants.find(
          (variant) =>
            variant.color === selectedColor && variant.quantity > 0,
        )
      : null;
    const nextVariant =
      firstAvailableVariantForSelectedColor ?? firstAvailableVariant;

    if (
      selectedColor === nextVariant.color &&
      selectedSize === nextVariant.size
    ) {
      return;
    }

    setVariantParams(
      {
        color: nextVariant.color,
        size: nextVariant.size,
      },
      { replace: true },
    );
  }, [
    product,
    selectedColor,
    selectedSize,
    selectedVariant,
    setVariantParams,
  ]);

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
        setVariantParams({
          color,
          size: '',
        });
        return;
      }

      const currentSizeVariant = selectedSize
        ? product.variants.find(
            (variant) =>
              variant.color === color &&
              variant.size === selectedSize &&
              variant.quantity > 0,
          )
        : null;
      const firstAvailableVariantForColor = product.variants.find(
        (variant) => variant.color === color && variant.quantity > 0,
      );
      const nextVariant = currentSizeVariant ?? firstAvailableVariantForColor;

      setVariantParams({
        color,
        size: nextVariant?.size ?? '',
      });
    },
    [product, selectedSize, setVariantParams],
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
