import { useMutation } from '@tanstack/react-query';

import { validateCart } from '../api';
import type { CartItem } from './cart-types';

const toValidateCartPayload = (items: CartItem[]) => {
  return {
    items: items.map(({ productId, quantity, variantId }) => ({
      productId,
      quantity,
      variantId,
    })),
  };
};

export const useValidateCart = () => {
  return useMutation({
    mutationFn: async (items: CartItem[]) => {
      const response = await validateCart(toValidateCartPayload(items));

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });
};
