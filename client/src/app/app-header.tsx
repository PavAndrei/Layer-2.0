import {
  selectCartItemsCount,
  useCartStore,
} from '../features/cart';
import { Header } from '../features/header';

export const AppHeader = () => {
  const cartItemsCount = useCartStore(selectCartItemsCount);

  return <Header cartItemsCount={cartItemsCount} />;
};
