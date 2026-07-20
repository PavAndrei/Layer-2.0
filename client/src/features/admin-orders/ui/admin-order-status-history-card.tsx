import type { OrderStatusHistoryItem } from '../../../entities/order';
import { formatDisplayDate } from '../../../shared/lib';
import { AdminOrderStatusBadge } from './admin-order-badges';

type AdminOrderStatusHistoryCardProps = {
  history: OrderStatusHistoryItem[];
};

export const AdminOrderStatusHistoryCard = ({
  history,
}: AdminOrderStatusHistoryCardProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <h2 className="block-title text-typography-heading">Status history</h2>

    <ol className="flex flex-col divide-y divide-border-soft">
      {history.map((item, index) => (
        <li
          key={`${item.status}-${item.changedAt}-${index}`}
          className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <AdminOrderStatusBadge status={item.status} />
            <span className="block-small text-typography-secondary">
              {formatDisplayDate(item.changedAt)}
            </span>
          </div>

          {item.changedBy && (
            <p className="block-small text-typography-secondary">
              Changed by {item.changedBy}
            </p>
          )}

          {item.note && (
            <p className="whitespace-pre-wrap block-medium text-typography-heading">
              {item.note}
            </p>
          )}
        </li>
      ))}
    </ol>
  </section>
);
