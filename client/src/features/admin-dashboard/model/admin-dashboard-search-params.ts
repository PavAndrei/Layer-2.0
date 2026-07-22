import type { AdminDashboardParams } from '../api';

export const toAdminDashboardSearchParams = (
  params: AdminDashboardParams,
) => {
  const searchParams = new URLSearchParams();

  if (params.period) {
    searchParams.set('period', params.period);
  }

  return searchParams;
};
