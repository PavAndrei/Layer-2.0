export const adminOrdersQueryKeys = {
  all: ['admin-orders'] as const,
  details: () => [...adminOrdersQueryKeys.all, 'detail'] as const,
  detail: (orderId: string) =>
    [...adminOrdersQueryKeys.details(), orderId] as const,
  lists: () => [...adminOrdersQueryKeys.all, 'list'] as const,
  list: (params = '') =>
    [...adminOrdersQueryKeys.lists(), params] as const,
};
