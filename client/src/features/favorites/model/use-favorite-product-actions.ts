import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

import type { Product } from '../../../entities/product';
import {
  useAuthStatus,
  useIsAuthenticated,
} from '../../auth';
import { useFavorites } from './use-favorites';
import { useToggleFavorite } from './use-toggle-favorite';

export const useFavoriteProductActions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authStatus = useAuthStatus();
  const isAuthenticated = useIsAuthenticated();
  const favorites = useFavorites({
    enabled: isAuthenticated,
  });
  const favoriteProductIds = useMemo(() => {
    return new Set(favorites.products.map((product) => product._id));
  }, [favorites.products]);
  const { pendingProductId, toggleFavorite } = useToggleFavorite({
    favoriteProductIds,
  });

  const handleToggleFavorite = (product: Product) => {
    if (authStatus === 'idle' || authStatus === 'loading') return;

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
        },
      });
      return;
    }

    toggleFavorite(product);
  };

  return {
    favoriteProductIds,
    isFavoriteActionPending: (productId: string) =>
      favorites.isLoading || pendingProductId === productId,
    toggleFavorite: handleToggleFavorite,
  };
};
