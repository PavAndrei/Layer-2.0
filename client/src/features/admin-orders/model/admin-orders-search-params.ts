import type { AdminOrdersParams } from '../api';

export const toAdminOrdersSearchParams = (
  params: AdminOrdersParams,
) => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  if (params.search) {
    searchParams.set('search', params.search);
  }

  if (params.status) {
    searchParams.set('status', params.status);
  }

  if (params.paymentStatus) {
    searchParams.set('paymentStatus', params.paymentStatus);
  }

  if (params.userId) {
    searchParams.set('userId', params.userId);
  }

  return searchParams;
};
