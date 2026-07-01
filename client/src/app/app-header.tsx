import {
  selectAuthStatus,
  selectAuthUser,
  useAuthStore,
  useLogout,
} from '../features/auth';
import {
  selectCartItemsCount,
  useCartStore,
} from '../features/cart';
import { useFavorites } from '../features/favorites';
import { Header } from '../features/header';

export const AppHeader = () => {
  const authStatus = useAuthStore(selectAuthStatus);
  const user = useAuthStore(selectAuthUser);
  const isAuthenticated = authStatus === 'authenticated';
  const cartItemsCount = useCartStore(selectCartItemsCount);
  const { products: favoriteProducts } = useFavorites({
    enabled: isAuthenticated,
  });
  const logoutMutation = useLogout();

  return (
    <Header
      authStatus={authStatus}
      cartItemsCount={cartItemsCount}
      favoriteItemsCount={favoriteProducts.length}
      isLogoutPending={logoutMutation.isPending}
      user={user}
      onLogout={() => logoutMutation.mutate()}
    />
  );
};
