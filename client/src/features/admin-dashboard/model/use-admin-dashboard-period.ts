import { useCallback, useMemo } from 'react';

import {
  ADMIN_DASHBOARD_PERIODS,
  type AdminDashboardPeriod,
} from '../api';
import {
  customParam,
  stringParam,
  useUrlState,
} from '../../../shared/model';

export type AdminDashboardPeriodState = {
  period: AdminDashboardPeriod;
  handlePeriodChange: (period: AdminDashboardPeriod) => void;
};

const DEFAULT_ADMIN_DASHBOARD_PERIOD: AdminDashboardPeriod = '7d';

type AdminDashboardUrlState = {
  period: AdminDashboardPeriod;
  section: string;
};

const ADMIN_DASHBOARD_URL_SCHEMA = {
  section: stringParam({ name: 'section' }),
  period: customParam<AdminDashboardPeriod>({
    parse: (searchParams) => {
      const period = searchParams.get('period');

      return (
        ADMIN_DASHBOARD_PERIODS.find((item) => item === period) ??
        DEFAULT_ADMIN_DASHBOARD_PERIOD
      );
    },
    serialize: (searchParams, value) => {
      if (value === DEFAULT_ADMIN_DASHBOARD_PERIOD) {
        searchParams.delete('period');
        return;
      }

      searchParams.set('period', value);
    },
  }),
};

export const useAdminDashboardPeriod = (): AdminDashboardPeriodState => {
  const [urlState, setUrlState] = useUrlState<AdminDashboardUrlState>(
    ADMIN_DASHBOARD_URL_SCHEMA,
    { replace: true },
  );

  const handlePeriodChange = useCallback(
    (period: AdminDashboardPeriod) => {
      setUrlState((prev) => ({
        ...prev,
        period,
      }));
    },
    [setUrlState],
  );

  return useMemo(
    () => ({
      handlePeriodChange,
      period: urlState.period,
    }),
    [handlePeriodChange, urlState.period],
  );
};
