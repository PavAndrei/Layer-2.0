import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeFavorite } from '../api';
import { removeFavoriteProductFromCache } from './favorites-cache';
import { favoritesQueryKeys } from './favorites-query-keys';

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: (response, productId) => {
      if (response.success) {
        removeFavoriteProductFromCache(
          queryClient,
          response.data.productId,
        );
      } else {
        removeFavoriteProductFromCache(queryClient, productId);
      }

      queryClient.invalidateQueries({
        queryKey: favoritesQueryKeys.all,
      });
    },
  });
};
