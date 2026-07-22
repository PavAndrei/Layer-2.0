import {
  AdminDashboardOrderStatusTable,
  AdminDashboardPeriodTabs,
  AdminDashboardRecentOrders,
  AdminDashboardRecentReviews,
  AdminDashboardRecentUsers,
  AdminDashboardRevenueChart,
  AdminDashboardSummaryCards,
} from '../admin-dashboard';
import {
  FeedbackMessage,
  SectionHeader,
  Skeleton,
} from '../../shared/ui';
import type { AdminDashboardSectionState } from './use-admin-dashboard-section';

const AdminDashboardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-36 w-full" />
      ))}
    </div>
    <Skeleton className="h-96 w-full" />
    <div className="grid gap-4 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-80 w-full" />
      ))}
    </div>
  </div>
);

export const AdminDashboardSection = ({
  dashboardQuery,
  periodState,
}: AdminDashboardSectionState) => {
  const dashboard = dashboardQuery.dashboard;
  const isWaitingForInitialDashboard =
    !dashboard && dashboardQuery.isLoading;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader
          title="Dashboard"
          description="Monitor store revenue, order activity, and recent admin signals."
        />
        <AdminDashboardPeriodTabs
          activePeriod={periodState.period}
          onPeriodChange={periodState.handlePeriodChange}
        />
      </div>

      {isWaitingForInitialDashboard && <AdminDashboardSkeleton />}

      {!isWaitingForInitialDashboard && dashboardQuery.error && (
        <FeedbackMessage
          tone="danger"
          title="Dashboard is unavailable"
          description={dashboardQuery.error}
        />
      )}

      {!isWaitingForInitialDashboard && !dashboardQuery.error && dashboard && (
        <div
          className={`flex flex-col gap-4 ${
            dashboardQuery.isPlaceholderData ? 'opacity-70' : ''
          }`}
        >
          <AdminDashboardSummaryCards summary={dashboard.summary} />
          <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <AdminDashboardRevenueChart
              revenueSeries={dashboard.revenueSeries}
            />
            <AdminDashboardOrderStatusTable
              distribution={dashboard.orderStatusDistribution}
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <AdminDashboardRecentOrders orders={dashboard.recentOrders} />
            <AdminDashboardRecentReviews reviews={dashboard.recentReviews} />
            <AdminDashboardRecentUsers users={dashboard.recentUsers} />
          </div>
        </div>
      )}
    </section>
  );
};
