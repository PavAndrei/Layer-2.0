import type {
  AdminOrder,
  AdminOrderListItem,
  OrderPaymentStatus,
  OrderStatus,
} from '../../../entities/order';
import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';
import type {
  UpdateAdminOrderPayload,
} from '../model';

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

export type AdminOrderResponseData = {
  order: AdminOrder;
};

export type UpdateAdminOrderParams = {
  orderId: string;
  payload: UpdateAdminOrderPayload;
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

export const getAdminOrder = async (
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<AdminOrderResponseData>> => {
  return apiClient.get<AdminOrderResponseData>({
    path: `/admin/orders/${orderId}`,
    signal,
    errorMessage: 'Failed to load admin order',
  });
};

export const updateAdminOrder = async ({
  orderId,
  payload,
}: UpdateAdminOrderParams): Promise<
  ApiResponse<AdminOrderResponseData>
> => {
  return apiClient.patch<AdminOrderResponseData, UpdateAdminOrderPayload>({
    path: `/admin/orders/${orderId}`,
    body: payload,
    errorMessage: 'Failed to update admin order',
  });
};
