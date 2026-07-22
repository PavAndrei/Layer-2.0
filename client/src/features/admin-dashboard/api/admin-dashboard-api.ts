import type { AdminOrderListItem } from '../../../entities/order';
import type { AdminReviewListItem } from '../../../entities/review';
import type { AdminUserListItem } from '../../../entities/user';
import type { OrderStatus } from '../../../entities/order';
import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';

export const ADMIN_DASHBOARD_PERIODS = ['7d', '30d', '90d'] as const;

export type AdminDashboardPeriod =
  (typeof ADMIN_DASHBOARD_PERIODS)[number];

export type AdminDashboardParams = {
  period?: AdminDashboardPeriod;
};

export type AdminDashboardSummary = {
  averageOrderValue: number;
  newCustomers: number;
  orders: number;
  revenue: number;
};

export type AdminDashboardRevenuePoint = {
  date: string;
  revenue: number;
};

export type AdminDashboardOrderStatusItem = {
  count: number;
  status: OrderStatus;
};

export type AdminDashboard = {
  orderStatusDistribution: AdminDashboardOrderStatusItem[];
  period: AdminDashboardPeriod;
  recentOrders: AdminOrderListItem[];
  recentReviews: AdminReviewListItem[];
  recentUsers: AdminUserListItem[];
  revenueSeries: AdminDashboardRevenuePoint[];
  summary: AdminDashboardSummary;
};

export type AdminDashboardResponseData = {
  dashboard: AdminDashboard;
};

export const getAdminDashboard = async (
  params: AdminDashboardParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<AdminDashboardResponseData>> => {
  return apiClient.get<AdminDashboardResponseData>({
    path: '/admin/dashboard',
    params,
    signal,
    errorMessage: 'Failed to load admin dashboard',
  });
};
