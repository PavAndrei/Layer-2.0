export const adminReviewsQueryKeys = {
  all: ['admin-reviews'] as const,
  details: () => [...adminReviewsQueryKeys.all, 'detail'] as const,
  detail: (reviewId: string) =>
    [...adminReviewsQueryKeys.details(), reviewId] as const,
  lists: () => [...adminReviewsQueryKeys.all, 'list'] as const,
  list: (params = '') =>
    [...adminReviewsQueryKeys.lists(), params] as const,
};
