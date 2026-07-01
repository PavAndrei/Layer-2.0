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
import { Header } from '../features/header';

export const AppHeader = () => {
  const authStatus = useAuthStore(selectAuthStatus);
  const user = useAuthStore(selectAuthUser);
  const cartItemsCount = useCartStore(selectCartItemsCount);
  const logoutMutation = useLogout();

  return (
    <Header
      authStatus={authStatus}
      cartItemsCount={cartItemsCount}
      isLogoutPending={logoutMutation.isPending}
      user={user}
      onLogout={() => logoutMutation.mutate()}
    />
  );
};
