import { useFavorites } from './use-favorites';

type UseFavoriteProductsCountOptions = {
  enabled?: boolean;
};

export const useFavoriteProductsCount = (
  options: UseFavoriteProductsCountOptions = {},
) => {
  const { products } = useFavorites(options);

  return products.length;
};
