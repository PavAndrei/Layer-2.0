export const adminDashboardQueryKeys = {
  all: ['admin-dashboard'] as const,
  details: () => [...adminDashboardQueryKeys.all, 'detail'] as const,
  detail: (params = '') =>
    [...adminDashboardQueryKeys.details(), params] as const,
};
