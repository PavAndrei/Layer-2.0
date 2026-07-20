import type { AdminOrder } from '../../../entities/order';

type AdminOrderManagementCardProps = {
  order: AdminOrder;
};

export const AdminOrderManagementCard = ({
  order,
}: AdminOrderManagementCardProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <h2 className="block-title text-typography-heading">Management</h2>

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">
          Tracking number
        </span>
        <span
          className={`block-medium ${
            order.trackingNumber
              ? 'text-typography-heading'
              : 'text-typography-muted'
          }`}
        >
          {order.trackingNumber ?? 'Not added'}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">
          Order id
        </span>
        <span className="break-all block-medium text-typography-heading">
          {order._id}
        </span>
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <span className="block-small text-typography-secondary">
          Internal note
        </span>
        <p
          className={`whitespace-pre-wrap block-medium ${
            order.adminNote
              ? 'text-typography-heading'
              : 'text-typography-muted'
          }`}
        >
          {order.adminNote ?? 'No internal note yet.'}
        </p>
      </div>
    </div>
  </section>
);
