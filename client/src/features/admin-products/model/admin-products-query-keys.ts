export const adminProductsQueryKeys = {
  all: ['admin-products'] as const,
  lists: () => [...adminProductsQueryKeys.all, 'list'] as const,
  list: (params = '') =>
    [...adminProductsQueryKeys.lists(), params] as const,
};
