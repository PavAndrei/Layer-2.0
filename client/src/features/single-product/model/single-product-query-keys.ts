export const singleProductQueryKeys = {
  all: ['single-product'] as const,
  detail: (identifier: string) =>
    [...singleProductQueryKeys.all, 'detail', identifier] as const,
  reviews: (id: string, page: number, limit: number) =>
    [...singleProductQueryKeys.detail(id), 'reviews', page, limit] as const,
};
