import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type { CartItem } from '../model';

type ValidateCartPayload = {
  items: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
};

export type CartValidationRemovedItemReason =
  | 'product-not-found'
  | 'variant-not-found'
  | 'out-of-stock';

export type CartValidationUpdatedItemReason = 'quantity-reduced';

export type CartValidationRemovedItem = {
  productId: string;
  variantId: string;
  reason: CartValidationRemovedItemReason;
};

export type CartValidationUpdatedItem = {
  productId: string;
  variantId: string;
  reason: CartValidationUpdatedItemReason;
  previousQuantity: number;
  nextQuantity: number;
};

type CartValidationResponseData = {
  items: CartItem[];
  removedItems: CartValidationRemovedItem[];
  updatedItems: CartValidationUpdatedItem[];
};

type CartValidationResponse = ApiResponse<CartValidationResponseData>;

export const validateCart = async (
  payload: ValidateCartPayload,
  signal?: AbortSignal,
): Promise<CartValidationResponse> => {
  return apiClient.post<CartValidationResponseData, ValidateCartPayload>({
    path: '/cart/validate',
    body: payload,
    signal,
    errorMessage: 'Failed to validate cart',
  });
};
