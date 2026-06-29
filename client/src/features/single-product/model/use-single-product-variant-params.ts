import { useCallback } from 'react';

import { customParam, stringParam, useUrlState } from '../../../shared/model';
import { PRODUCT_SIZES, type ProductSize } from '../../../entities/product';

type SingleProductVariantParams = {
  color: string;
  size: ProductSize | '';
};

const SINGLE_PRODUCT_VARIANT_URL_SCHEMA = {
  color: stringParam({ name: 'color' }),
  size: customParam<ProductSize | ''>({
    parse: (searchParams) => {
      const size = searchParams.get('size');

      return PRODUCT_SIZES.find((productSize) => productSize === size) ?? '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('size');
        return;
      }

      searchParams.set('size', value);
    },
  }),
};

export const useSingleProductVariantParams = () => {
  const [variantParams, setVariantParams] =
    useUrlState<SingleProductVariantParams>(SINGLE_PRODUCT_VARIANT_URL_SCHEMA, {
      replace: true,
    });

  const setSelectedColor = useCallback(
    (color: string | null) => {
      setVariantParams((prev) => ({
        ...prev,
        color: color ?? '',
      }));
    },
    [setVariantParams],
  );

  const setSelectedSize = useCallback(
    (size: ProductSize | null) => {
      setVariantParams((prev) => ({
        ...prev,
        size: size ?? '',
      }));
    },
    [setVariantParams],
  );

  return {
    selectedColor: variantParams.color || null,
    selectedSize: variantParams.size || null,
    setSelectedColor,
    setSelectedSize,
    setVariantParams,
  };
};
