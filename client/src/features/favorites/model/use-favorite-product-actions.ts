import { useMemo } from 'react';

import type { Product } from '../../../entities/product';
import { useFavorites } from './use-favorites';
import { useToggleFavorite } from './use-toggle-favorite';

type UseFavoriteProductActionsOptions = {
  isAccessPending?: boolean;
  isEnabled?: boolean;
  onAccessDenied?: () => void;
};

export const useFavoriteProductActions = ({
  isAccessPending = false,
  isEnabled = true,
  onAccessDenied,
}: UseFavoriteProductActionsOptions = {}) => {
  const favorites = useFavorites({
    enabled: isEnabled,
  });
  const favoriteProductIds = useMemo(() => {
    return new Set(favorites.products.map((product) => product._id));
  }, [favorites.products]);
  const { pendingProductId, toggleFavorite } = useToggleFavorite({
    favoriteProductIds,
  });

  const handleToggleFavorite = (product: Product) => {
    if (isAccessPending) return;

    if (!isEnabled) {
      onAccessDenied?.();
      return;
    }

    toggleFavorite(product);
  };

  return {
    favoriteProductIds,
    isFavoriteActionPending: (productId: string) =>
      isAccessPending || favorites.isLoading || pendingProductId === productId,
    toggleFavorite: handleToggleFavorite,
  };
};
