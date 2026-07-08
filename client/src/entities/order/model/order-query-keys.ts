export const orderQueryKeys = {
  all: ['orders'] as const,
  detail: (orderId: string) =>
    [...orderQueryKeys.all, 'detail', orderId] as const,
  list: (params = '') => [...orderQueryKeys.all, 'list', params] as const,
};
