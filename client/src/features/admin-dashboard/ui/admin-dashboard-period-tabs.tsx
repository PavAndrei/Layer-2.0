import {
  ADMIN_DASHBOARD_PERIODS,
  type AdminDashboardPeriod,
} from '../api';
import { Button } from '../../../shared/ui';

const PERIOD_LABELS: Record<AdminDashboardPeriod, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
};

type AdminDashboardPeriodTabsProps = {
  activePeriod: AdminDashboardPeriod;
  onPeriodChange: (period: AdminDashboardPeriod) => void;
};

export const AdminDashboardPeriodTabs = ({
  activePeriod,
  onPeriodChange,
}: AdminDashboardPeriodTabsProps) => (
  <div className="flex overflow-x-auto pb-2 sm:pb-0">
    <div
      className="inline-flex min-w-max rounded border border-border-soft bg-background-surface p-1"
      role="tablist"
      aria-label="Dashboard period"
    >
      {ADMIN_DASHBOARD_PERIODS.map((period) => {
        const isActive = activePeriod === period;

        return (
          <Button
            key={period}
            size="sm"
            variant={isActive ? 'primary' : 'ghost'}
            role="tab"
            aria-selected={isActive}
            className="min-h-9"
            onClick={() => onPeriodChange(period)}
          >
            {PERIOD_LABELS[period]}
          </Button>
        );
      })}
    </div>
  </div>
);
