import type {
  Product,
  ProductVariant,
} from '../../../entities/product';
import type {
  CartItem,
  CartItemKey,
  CartTotals,
} from './cart-types';

type CreateCartItemParams = {
  product: Product;
  variant: ProductVariant;
  quantity?: number;
};

export const getCartItemKey = (
  productId: string,
  variantId: string,
): CartItemKey => `${productId}:${variantId}`;

export const normalizeCartQuantity = (
  quantity: number,
  maxQuantity: number,
): number => {
  const safeMaxQuantity = Math.max(0, Math.trunc(maxQuantity));

  if (safeMaxQuantity === 0) return 0;

  const safeQuantity = Number.isFinite(quantity) ? Math.trunc(quantity) : 1;

  return Math.min(Math.max(1, safeQuantity), safeMaxQuantity);
};

export const canIncreaseCartItemQuantity = (item: CartItem): boolean => {
  return item.quantity < item.maxQuantity;
};

export const getCartItemsCount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

export const getCartSubtotal = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

export const getCartCompareAtSubtotal = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) =>
      total + (item.compareAtPrice ?? item.price) * item.quantity,
    0,
  );
};

export const getCartDiscountTotal = (items: CartItem[]): number => {
  return Math.max(getCartCompareAtSubtotal(items) - getCartSubtotal(items), 0);
};

export const getCartTotals = (items: CartItem[]): CartTotals => {
  const subtotal = getCartSubtotal(items);
  const compareAtSubtotal = getCartCompareAtSubtotal(items);

  return {
    itemsCount: getCartItemsCount(items),
    uniqueItemsCount: items.length,
    subtotal,
    compareAtSubtotal,
    discountTotal: Math.max(compareAtSubtotal - subtotal, 0),
  };
};

export const createCartItem = ({
  product,
  variant,
  quantity = 1,
}: CreateCartItemParams): CartItem => {
  const price = product.hasDiscount
    ? product.discountPrice
    : product.defaultPrice;

  return {
    productId: product._id,
    variantId: variant._id,
    sku: variant.sku,
    title: product.title,
    image: variant.image ?? product.img,
    color: variant.color,
    size: variant.size,
    price,
    compareAtPrice: product.hasDiscount ? product.defaultPrice : undefined,
    quantity: normalizeCartQuantity(quantity, variant.quantity),
    maxQuantity: variant.quantity,
  };
};
