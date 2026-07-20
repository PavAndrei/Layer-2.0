import {
  AdminOrdersList,
  useAdminOrders,
} from '../admin-orders';
import {
  FeedbackMessage,
  SectionHeader,
  Skeleton,
} from '../../shared/ui';

const ADMIN_ORDERS_PAGE_LIMIT = 12;

const AdminOrdersSkeleton = () => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={index} className="h-56 w-full" />
    ))}
  </div>
);

export const AdminOrdersSection = () => {
  const ordersQuery = useAdminOrders({
    params: {
      limit: ADMIN_ORDERS_PAGE_LIMIT,
    },
  });

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Orders"
        description="Review customer orders, payment state, and fulfillment progress."
      />

      {ordersQuery.isLoading && <AdminOrdersSkeleton />}

      {!ordersQuery.isLoading && ordersQuery.error && (
        <FeedbackMessage
          tone="danger"
          title="Orders are unavailable"
          description={ordersQuery.error}
        />
      )}

      {!ordersQuery.isLoading &&
        !ordersQuery.error &&
        ordersQuery.orders.length === 0 && (
        <FeedbackMessage
          title="No orders found"
          description="Orders will appear here after customers complete checkout."
        />
        )}

      {!ordersQuery.isLoading &&
        !ordersQuery.error &&
        ordersQuery.orders.length > 0 && (
        <AdminOrdersList orders={ordersQuery.orders} />
        )}
    </section>
  );
};
