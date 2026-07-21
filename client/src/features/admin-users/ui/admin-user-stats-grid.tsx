import type { AdminUserStats } from '../../../entities/user';
import { formatProductPrice } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';
import { AdminUserStatCard } from './admin-user-stat-card';

type AdminUserStatsGridProps = {
  stats: AdminUserStats;
};

export const AdminUserStatsGrid = ({ stats }: AdminUserStatsGridProps) => (
  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <AdminUserStatCard
      label="Active sessions"
      value={String(stats.activeSessionsCount)}
    />
    <AdminUserStatCard
      label="Total spent"
      value={formatProductPrice(stats.totalSpent)}
    />
    <AdminUserStatCard label="Reviews" value={String(stats.reviewsCount)} />
    <AdminUserStatCard
      label="Last order"
      value={stats.lastOrderAt ? formatDisplayDate(stats.lastOrderAt) : 'None'}
    />
  </section>
);
