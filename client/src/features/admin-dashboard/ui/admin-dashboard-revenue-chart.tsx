import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatProductPrice } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';
import type { AdminDashboardRevenuePoint } from '../api';

type AdminDashboardRevenueChartProps = {
  revenueSeries: AdminDashboardRevenuePoint[];
};

const shortDateFormatter = (date: string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));

export const AdminDashboardRevenueChart = ({
  revenueSeries,
}: AdminDashboardRevenueChartProps) => {
  const hasRevenue = revenueSeries.some((point) => point.revenue > 0);

  return (
    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <div className="flex flex-col gap-1">
        <h3 className="block-title text-typography-heading">Revenue</h3>
        <p className="block-small text-typography-secondary">
          Paid order revenue by day.
        </p>
      </div>

      {revenueSeries.length === 0 || !hasRevenue ? (
        <div className="flex h-72 items-center rounded border border-dashed border-border-soft bg-background-primary p-4">
          <p className="block-small text-typography-secondary">
            No paid orders in this period.
          </p>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueSeries}
              margin={{ bottom: 8, left: 0, right: 8, top: 8 }}
            >
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDateFormatter}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip
                formatter={(value) => [
                  formatProductPrice(Number(value)),
                  'Revenue',
                ]}
                labelFormatter={(label) =>
                  formatDisplayDate(String(label))
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#111827"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};
