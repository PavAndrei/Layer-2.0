import type { AdminProductsParams } from '../api';

export const toAdminProductsSearchParams = (
  params: AdminProductsParams,
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

  if (params.category) {
    searchParams.set('category', params.category);
  }

  if (params.audience) {
    searchParams.set('audience', params.audience);
  }

  if (params.stock) {
    searchParams.set('stock', params.stock);
  }

  if (params.hasDiscount !== undefined) {
    searchParams.set('hasDiscount', String(params.hasDiscount));
  }

  if (params.color) {
    searchParams.set('color', params.color);
  }

  if (params.size) {
    searchParams.set('size', params.size);
  }

  if (params.sort && params.sort !== 'default') {
    searchParams.set('sort', params.sort);
  }

  return searchParams;
};
