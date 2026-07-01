import type { QueryClient } from '@tanstack/react-query';

import type { Product } from '../../../entities/product';
import type { ApiResponse } from '../../../shared/api';
import type { FavoritesResponseData } from '../api';
import { favoritesQueryKeys } from './favorites-query-keys';

type FavoritesQueryData = ApiResponse<FavoritesResponseData>;

export const getFavoriteProductIds = (
  queryClient: QueryClient,
): Set<string> => {
  const response = queryClient.getQueryData<FavoritesQueryData>(
    favoritesQueryKeys.list(),
  );
  const products = response?.success ? response.data.products : [];

  return new Set(products.map((product) => product._id));
};

export const addFavoriteProductToCache = (
  queryClient: QueryClient,
  product: Product,
) => {
  queryClient.setQueryData<FavoritesQueryData>(
    favoritesQueryKeys.list(),
    (previousData) => {
      if (!previousData?.success) return previousData;

      const isAlreadyFavorite = previousData.data.products.some(
        (favoriteProduct) => favoriteProduct._id === product._id,
      );

      if (isAlreadyFavorite) return previousData;

      return {
        ...previousData,
        data: {
          products: [product, ...previousData.data.products],
        },
      };
    },
  );
};

export const removeFavoriteProductFromCache = (
  queryClient: QueryClient,
  productId: string,
) => {
  queryClient.setQueryData<FavoritesQueryData>(
    favoritesQueryKeys.list(),
    (previousData) => {
      if (!previousData?.success) return previousData;

      return {
        ...previousData,
        data: {
          products: previousData.data.products.filter(
            (product) => product._id !== productId,
          ),
        },
      };
    },
  );
};
