import type { ProductSize } from '../../../entities/product';

export type CartItemKey = `${string}:${string}`;

export type CartItem = {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  image: string;
  color: string;
  size: ProductSize;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  maxQuantity: number;
};

export type CartTotals = {
  itemsCount: number;
  uniqueItemsCount: number;
  subtotal: number;
  compareAtSubtotal: number;
  discountTotal: number;
};
