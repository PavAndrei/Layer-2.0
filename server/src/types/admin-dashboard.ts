export const ADMIN_DASHBOARD_PERIODS = ['7d', '30d', '90d'] as const;

export type AdminDashboardPeriod =
  (typeof ADMIN_DASHBOARD_PERIODS)[number];
