import type { AdminReviewsParams } from '../api';

export const toAdminReviewsSearchParams = (
  params: AdminReviewsParams,
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

  if (params.rating !== undefined) {
    searchParams.set('rating', String(params.rating));
  }

  if (params.productId) {
    searchParams.set('productId', params.productId);
  }

  if (params.verifiedPurchase !== undefined) {
    searchParams.set('verifiedPurchase', String(params.verifiedPurchase));
  }

  if (params.dateFrom) {
    searchParams.set('dateFrom', params.dateFrom);
  }

  if (params.dateTo) {
    searchParams.set('dateTo', params.dateTo);
  }

  return searchParams;
};
