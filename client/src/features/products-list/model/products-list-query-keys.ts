export const PRODUCTS_LIST_STALE_TIME_MS = 1000 * 60 * 2;

export const productsListQueryKeys = {
  all: ['products-list'] as const,
  list: (params: string) => [...productsListQueryKeys.all, 'list', params] as const,
};
