export const productsListQueryKeys = {
  all: ['products-list'] as const,
  list: (params: string) => [...productsListQueryKeys.all, 'list', params] as const,
};
