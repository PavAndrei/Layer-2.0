import { useCallback, useMemo } from 'react';

import type {
  Product,
  ProductVariant,
} from '../../../entities/product';
import { createCartItem, getCartItemKey } from './cart-helpers';
import { selectCartItems } from './cart-selectors';
import { useCartStore } from './cart-store';

type UseProductVariantCartParams = {
  product: Product | null;
  variant: ProductVariant | null;
};

export const useProductVariantCart = ({
  product,
  variant,
}: UseProductVariantCartParams) => {
  const cartItems = useCartStore(selectCartItems);
  const addCartItem = useCartStore((state) => state.addItem);

  const isInCart = useMemo(() => {
    if (!product || !variant) return false;

    const variantKey = getCartItemKey(product._id, variant._id);

    return cartItems.some((item) => {
      return getCartItemKey(item.productId, item.variantId) === variantKey;
    });
  }, [cartItems, product, variant]);

  const addToCart = useCallback(() => {
    if (!product || !variant) return;

    addCartItem(
      createCartItem({
        product,
        variant,
      }),
    );
  }, [addCartItem, product, variant]);

  return {
    addToCart,
    isInCart,
  };
};
