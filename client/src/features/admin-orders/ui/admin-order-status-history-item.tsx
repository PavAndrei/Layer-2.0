import type { OrderStatusHistoryItem } from '../../../entities/order';
import { formatDisplayDate } from '../../../shared/lib';
import { AdminOrderStatusBadge } from './admin-order-badges';

type AdminOrderStatusHistoryItemProps = {
  item: OrderStatusHistoryItem;
};

const getChangedByLabel = (item: OrderStatusHistoryItem) => {
  if (item.changedByName && item.changedByEmail) {
    return `${item.changedByName} (${item.changedByEmail})`;
  }

  return item.changedByName ?? item.changedByEmail ?? null;
};

export const AdminOrderStatusHistoryItem = ({
  item,
}: AdminOrderStatusHistoryItemProps) => {
  const changedByLabel = getChangedByLabel(item);

  return (
    <li className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <AdminOrderStatusBadge status={item.status} />
        <span className="block-small text-typography-secondary">
          {formatDisplayDate(item.changedAt)}
        </span>
      </div>

      {changedByLabel && (
        <p className="block-small text-typography-secondary">
          Changed by {changedByLabel}
        </p>
      )}

      {item.note && (
        <p className="whitespace-pre-wrap block-medium text-typography-heading">
          {item.note}
        </p>
      )}
    </li>
  );
};
