import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { PRODUCT_SIZES } from '../../../entities/product';
import type { CartItem, CartItemKey } from './cart-types';
import {
  getCartItemKey,
  normalizeCartQuantity,
} from './cart-helpers';

export type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: CartItemKey) => void;
  replaceCart: (items: CartItem[]) => void;
  increaseItemQuantity: (key: CartItemKey) => void;
  decreaseItemQuantity: (key: CartItemKey) => void;
  setItemQuantity: (key: CartItemKey, quantity: number) => void;
  clearCart: () => void;
};

type PersistedCartState = Pick<CartState, 'items'>;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

const getItemKey = (item: CartItem): CartItemKey => {
  return getCartItemKey(item.productId, item.variantId);
};

const isCartItem = (value: unknown): value is CartItem => {
  if (!isRecord(value)) return false;

  return (
    typeof value.productId === 'string' &&
    (value.productSlug === undefined ||
      typeof value.productSlug === 'string') &&
    typeof value.variantId === 'string' &&
    typeof value.sku === 'string' &&
    typeof value.title === 'string' &&
    typeof value.image === 'string' &&
    typeof value.color === 'string' &&
    typeof value.size === 'string' &&
    PRODUCT_SIZES.some((size) => size === value.size) &&
    isFiniteNumber(value.price) &&
    (value.compareAtPrice === undefined ||
      isFiniteNumber(value.compareAtPrice)) &&
    isFiniteNumber(value.quantity) &&
    isFiniteNumber(value.maxQuantity)
  );
};

const normalizeCartItem = (item: CartItem): CartItem | null => {
  const maxQuantity = Math.max(0, Math.trunc(item.maxQuantity));
  const quantity = normalizeCartQuantity(item.quantity, maxQuantity);

  if (quantity === 0) return null;

  return {
    ...item,
    quantity,
    maxQuantity,
  };
};

const normalizeCartItems = (items: CartItem[]): CartItem[] => {
  const uniqueItems = new Map<CartItemKey, CartItem>();

  items.forEach((item) => {
    const normalizedItem = normalizeCartItem(item);

    if (!normalizedItem) return;

    const key = getItemKey(normalizedItem);
    const existingItem = uniqueItems.get(key);

    if (!existingItem) {
      uniqueItems.set(key, normalizedItem);
      return;
    }

    uniqueItems.set(key, {
      ...existingItem,
      ...normalizedItem,
      quantity: normalizeCartQuantity(
        existingItem.quantity + normalizedItem.quantity,
        normalizedItem.maxQuantity,
      ),
    });
  });

  return [...uniqueItems.values()];
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: normalizeCartItems([...state.items, item]),
        })),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((item) => getItemKey(item) !== key),
        })),
      replaceCart: (items) =>
        set({
          items: normalizeCartItems(items),
        }),
      increaseItemQuantity: (key) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (getItemKey(item) !== key) return item;

            return {
              ...item,
              quantity: normalizeCartQuantity(
                item.quantity + 1,
                item.maxQuantity,
              ),
            };
          }),
        })),
      decreaseItemQuantity: (key) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (getItemKey(item) !== key) return item;

            return {
              ...item,
              quantity: normalizeCartQuantity(
                item.quantity - 1,
                item.maxQuantity,
              ),
            };
          }),
        })),
      setItemQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (getItemKey(item) !== key) return item;

            return {
              ...item,
              quantity: normalizeCartQuantity(quantity, item.maxQuantity),
            };
          }),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'layer-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedCartState => ({
        items: state.items,
      }),
      migrate: (persistedState): PersistedCartState => {
        if (!isRecord(persistedState) || !Array.isArray(persistedState.items)) {
          return {
            items: [],
          };
        }

        return {
          items: normalizeCartItems(persistedState.items.filter(isCartItem)),
        };
      },
      version: 1,
    },
  ),
);
