import type { OrderStatusHistoryItem } from '../../../entities/order';
import { FeedbackMessage } from '../../../shared/ui';
import { AdminOrderStatusHistoryItem } from './admin-order-status-history-item';

type AdminOrderStatusHistoryCardProps = {
  history: OrderStatusHistoryItem[];
};

export const AdminOrderStatusHistoryCard = ({
  history,
}: AdminOrderStatusHistoryCardProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <h2 className="block-title text-typography-heading">Status history</h2>

    {history.length === 0 ? (
      <FeedbackMessage
        title="No status history"
        description="Status changes will appear here after an admin updates this order."
      />
    ) : (
      <ol className="flex flex-col divide-y divide-border-soft">
        {history.map((item, index) => (
          <AdminOrderStatusHistoryItem
            key={`${item.status}-${item.changedAt}-${index}`}
            item={item}
          />
        ))}
      </ol>
    )}
  </section>
);
