import type { Product } from '../../../entities/product';
import { useAddFavorite } from './use-add-favorite';
import { useRemoveFavorite } from './use-remove-favorite';

type UseToggleFavoriteParams = {
  favoriteProductIds: Set<string>;
};

export const useToggleFavorite = ({
  favoriteProductIds,
}: UseToggleFavoriteParams) => {
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  const pendingProductId =
    addFavoriteMutation.isPending
      ? addFavoriteMutation.variables
      : removeFavoriteMutation.isPending
        ? removeFavoriteMutation.variables
        : null;

  const toggleFavorite = (product: Product) => {
    if (favoriteProductIds.has(product._id)) {
      removeFavoriteMutation.mutate(product._id);
      return;
    }

    addFavoriteMutation.mutate(product._id);
  };

  return {
    pendingProductId,
    toggleFavorite,
  };
};
