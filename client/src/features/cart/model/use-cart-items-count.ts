import { selectCartItemsCount } from './cart-selectors';
import { useCartStore } from './cart-store';

export const useCartItemsCount = () => {
  return useCartStore(selectCartItemsCount);
};
