import { useMemo } from 'react';

import {
  useAdminDashboard,
  useAdminDashboardPeriod,
} from '../../../features/admin-dashboard';
import type { AdminSection } from '../../../features/admin';

type UseAdminDashboardSectionParams = {
  activeSection: AdminSection;
};

export const useAdminDashboardSection = ({
  activeSection,
}: UseAdminDashboardSectionParams) => {
  const periodState = useAdminDashboardPeriod();
  const params = useMemo(
    () => ({
      period: periodState.period,
    }),
    [periodState.period],
  );
  const dashboardQuery = useAdminDashboard({
    enabled: activeSection === 'dashboard',
    params,
  });

  return {
    dashboardQuery,
    periodState,
  };
};

export type AdminDashboardSectionState = ReturnType<
  typeof useAdminDashboardSection
>;
