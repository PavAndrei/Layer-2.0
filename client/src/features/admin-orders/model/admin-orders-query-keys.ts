export const adminOrdersQueryKeys = {
  all: ['admin-orders'] as const,
  list: (params = '') =>
    [...adminOrdersQueryKeys.all, 'list', params] as const,
};
