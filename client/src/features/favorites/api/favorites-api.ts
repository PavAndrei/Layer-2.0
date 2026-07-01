import type { Product } from '../../../entities/product';
import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';

export type FavoritesResponseData = {
  products: Product[];
};

export type AddFavoriteResponseData = {
  product: Product;
};

export type RemoveFavoriteResponseData = {
  productId: string;
};

export const getFavorites = async (): Promise<
  ApiResponse<FavoritesResponseData>
> => {
  return apiClient.get<FavoritesResponseData>({
    path: '/favorites',
    errorMessage: 'Failed to load favorites',
  });
};

export const addFavorite = async (
  productId: string,
): Promise<ApiResponse<AddFavoriteResponseData>> => {
  return apiClient.post<AddFavoriteResponseData>({
    path: `/favorites/${productId}`,
    errorMessage: 'Failed to add favorite',
  });
};

export const removeFavorite = async (
  productId: string,
): Promise<ApiResponse<RemoveFavoriteResponseData>> => {
  return apiClient.delete<RemoveFavoriteResponseData>({
    path: `/favorites/${productId}`,
    errorMessage: 'Failed to remove favorite',
  });
};
