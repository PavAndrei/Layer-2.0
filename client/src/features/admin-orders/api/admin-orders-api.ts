import type {
  AdminOrderListItem,
  OrderPaymentStatus,
  OrderStatus,
} from '../../../entities/order';
import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';

export type AdminOrdersParams = {
  limit?: number;
  page?: number;
  paymentStatus?: OrderPaymentStatus;
  search?: string;
  status?: OrderStatus;
};

export type AdminOrdersResponseData = {
  orders: AdminOrderListItem[];
  pagination: PaginationData;
};

export const getAdminOrders = async (
  params: AdminOrdersParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<AdminOrdersResponseData>> => {
  return apiClient.get<AdminOrdersResponseData>({
    path: '/admin/orders',
    params,
    signal,
    errorMessage: 'Failed to load admin orders',
  });
};
