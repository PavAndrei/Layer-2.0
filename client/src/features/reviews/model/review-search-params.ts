import type { ReviewsPaginationParams } from '../api';

export const toReviewsSearchParams = (
  params: ReviewsPaginationParams,
) => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  return searchParams;
};
