export const singleProductQueryKeys = {
  all: ['single-product'] as const,
  detail: (id: string) =>
    [...singleProductQueryKeys.all, 'detail', id] as const,
  reviews: (id: string, page: number, limit: number) =>
    [...singleProductQueryKeys.detail(id), 'reviews', page, limit] as const,
};
