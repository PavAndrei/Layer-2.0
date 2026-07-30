export const adminProductsQueryKeys = {
  all: ['admin-products'] as const,
  details: () => [...adminProductsQueryKeys.all, 'detail'] as const,
  detail: (productId: string) =>
    [...adminProductsQueryKeys.details(), productId] as const,
  lists: () => [...adminProductsQueryKeys.all, 'list'] as const,
  list: (params = '') =>
    [...adminProductsQueryKeys.lists(), params] as const,
};
