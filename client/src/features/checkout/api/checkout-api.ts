import type {
  Order,
  OrderShippingAddress,
} from '../../../entities/order';
import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';

export type CheckoutItemPayload = {
  productId: string;
  quantity: number;
  variantId: string;
};

export type CheckoutPayload = {
  contactEmail: string;
  items: CheckoutItemPayload[];
  shippingAddress: OrderShippingAddress;
};

export type CheckoutResponseData = {
  order: Order;
};

export const checkout = async (
  payload: CheckoutPayload,
): Promise<ApiResponse<CheckoutResponseData>> => {
  return apiClient.post<CheckoutResponseData, CheckoutPayload>({
    path: '/checkout',
    body: payload,
    errorMessage: 'Failed to complete checkout',
  });
};
