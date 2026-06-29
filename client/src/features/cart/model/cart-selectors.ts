import { getCartItemsCount } from './cart-helpers';
import type { CartState } from './cart-store';

export const selectCartItems = (state: CartState) => state.items;

export const selectCartItemsCount = (state: CartState) => {
  return getCartItemsCount(state.items);
};
