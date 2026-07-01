import { useQuery } from '@tanstack/react-query';

import { getFavorites } from '../api';
import {
  FAVORITES_STALE_TIME_MS,
  favoritesQueryKeys,
} from './favorites-query-keys';

type UseFavoritesOptions = {
  enabled?: boolean;
};

export const useFavorites = ({
  enabled = true,
}: UseFavoritesOptions = {}) => {
  const favoritesQuery = useQuery({
    queryKey: favoritesQueryKeys.list(),
    queryFn: getFavorites,
    enabled,
    retry: false,
    staleTime: FAVORITES_STALE_TIME_MS,
  });

  const response = favoritesQuery.data;
  const products = response?.success ? response.data.products : [];
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    favoritesQuery.error instanceof Error
      ? favoritesQuery.error.message
      : favoritesQuery.error
        ? 'Failed to load favorites'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: favoritesQuery.isFetching,
    isLoading: favoritesQuery.isLoading,
    products,
    refetch: favoritesQuery.refetch,
  };
};
