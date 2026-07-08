import type { Order } from '../../../entities/order';
import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';

export type OrdersParams = {
  limit?: number;
  page?: number;
  status?: Order['status'];
};

export type OrdersResponseData = {
  orders: Order[];
  pagination: PaginationData;
};

export type OrderResponseData = {
  order: Order;
};

export const getOrders = async (
  params: OrdersParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<OrdersResponseData>> => {
  return apiClient.get<OrdersResponseData>({
    path: '/orders',
    params,
    signal,
    errorMessage: 'Failed to load orders',
  });
};

export const getOrderById = async (
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<OrderResponseData>> => {
  return apiClient.get<OrderResponseData>({
    path: `/orders/${orderId}`,
    signal,
    errorMessage: 'Failed to load order',
  });
};
