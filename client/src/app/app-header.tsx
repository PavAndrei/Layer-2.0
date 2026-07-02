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

export const AppHeader = () => {
  const authStatus = useAuthStatus();
  const user = useAuthUser();
  const isAuthenticated = authStatus === 'authenticated';
  const cartItemsCount = useCartItemsCount();
  const favoriteItemsCount = useFavoriteProductsCount({
    enabled: isAuthenticated,
  });
  const logoutMutation = useLogout();

  return (
    <Header
      authStatus={authStatus}
      cartItemsCount={cartItemsCount}
      favoriteItemsCount={favoriteItemsCount}
      isLogoutPending={logoutMutation.isPending}
      user={user}
      onLogout={() => logoutMutation.mutate()}
    />
  );
};
