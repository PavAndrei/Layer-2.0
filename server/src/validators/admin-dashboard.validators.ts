import { z } from 'zod';

import { ADMIN_DASHBOARD_PERIODS } from '../types/admin-dashboard';

export const adminDashboardQuerySchema = z
  .object({
    period: z.enum(ADMIN_DASHBOARD_PERIODS).optional().default('7d'),
  })
  .strict();

export const getAdminDashboardSchema = z.object({
  query: adminDashboardQuerySchema,
});

export type AdminDashboardQuery = z.infer<
  typeof adminDashboardQuerySchema
>;
