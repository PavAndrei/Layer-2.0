import { formatProductPrice } from '../../../entities/product';
import type { AdminDashboardSummary } from '../api';
import { AdminDashboardSummaryCard } from './admin-dashboard-summary-card';

type AdminDashboardSummaryCardsProps = {
  summary: AdminDashboardSummary;
};

export const AdminDashboardSummaryCards = ({
  summary,
}: AdminDashboardSummaryCardsProps) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <AdminDashboardSummaryCard
      href="/admin?section=orders"
      label="Revenue"
      value={formatProductPrice(summary.revenue)}
      description="Paid order revenue for the selected period."
    />
    <AdminDashboardSummaryCard
      href="/admin?section=orders"
      label="Orders"
      value={summary.orders}
      description="All orders created during the selected period."
    />
    <AdminDashboardSummaryCard
      href="/admin?section=orders"
      label="Average order value"
      value={formatProductPrice(summary.averageOrderValue)}
      description="Paid revenue divided by paid orders."
    />
    <AdminDashboardSummaryCard
      href="/admin?section=users"
      label="New customers"
      value={summary.newCustomers}
      description="Accounts registered during the selected period."
    />
  </div>
);
