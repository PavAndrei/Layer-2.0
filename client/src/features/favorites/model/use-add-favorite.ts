import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addFavorite } from '../api';
import { addFavoriteProductToCache } from './favorites-cache';
import { favoritesQueryKeys } from './favorites-query-keys';

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (response) => {
      if (response.success) {
        addFavoriteProductToCache(queryClient, response.data.product);
      }

      queryClient.invalidateQueries({
        queryKey: favoritesQueryKeys.all,
      });
    },
  });
};
