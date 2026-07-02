import { useQueryClient } from '@tanstack/react-query';

import {
  useAuthStatus,
  useAuthUser,
  useLogout,
} from '../features/auth';
import {
  useCartItemsCount,
} from '../features/cart';
import { useFavoriteProductsCount } from '../features/favorites';
import { Header } from '../features/header';
import { clearUserSessionQueryCache } from './user-session-query-cache';

export const AppHeader = () => {
  const queryClient = useQueryClient();
  const authStatus = useAuthStatus();
  const user = useAuthUser();
  const isAuthenticated = authStatus === 'authenticated';
  const cartItemsCount = useCartItemsCount();
  const favoriteItemsCount = useFavoriteProductsCount({
    enabled: isAuthenticated,
  });
  const logoutMutation = useLogout();
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        clearUserSessionQueryCache(queryClient);
      },
    });
  };

  return (
    <Header
      authStatus={authStatus}
      cartItemsCount={cartItemsCount}
      favoriteItemsCount={favoriteItemsCount}
      isLogoutPending={logoutMutation.isPending}
      user={user}
      onLogout={handleLogout}
    />
  );
};
