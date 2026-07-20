import {
  AdminOrdersFiltersForm,
  AdminOrdersList,
} from '../admin-orders';
import {
  FeedbackMessage,
  Pagination,
  SectionHeader,
  Skeleton,
} from '../../shared/ui';
import type { AdminOrdersSectionState } from './use-admin-orders-section';

const AdminOrdersSkeleton = () => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={index} className="h-56 w-full" />
    ))}
  </div>
);

export const AdminOrdersSection = ({
  filters,
  onPageChange,
  ordersQuery,
}: AdminOrdersSectionState) => {
  const isWaitingForInitialOrders =
    ordersQuery.orders.length === 0 &&
    (ordersQuery.isLoading || filters.isDebouncing);

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Orders"
        description="Review customer orders, payment state, and fulfillment progress."
      />

      <AdminOrdersFiltersForm
        paymentStatus={filters.paymentStatus}
        search={filters.search}
        status={filters.status}
        onPaymentStatusChange={filters.handlePaymentStatusChange}
        onReset={filters.resetFilters}
        onSearchChange={filters.handleSearchChange}
        onStatusChange={filters.handleStatusChange}
      />

      {isWaitingForInitialOrders && <AdminOrdersSkeleton />}

      {!isWaitingForInitialOrders && ordersQuery.error && (
        <FeedbackMessage
          tone="danger"
          title="Orders are unavailable"
          description={ordersQuery.error}
        />
      )}

      {!isWaitingForInitialOrders &&
        !ordersQuery.error &&
        ordersQuery.orders.length === 0 && (
        <FeedbackMessage
          title="No orders found"
          description="Orders will appear here after customers complete checkout."
        />
        )}

      {!isWaitingForInitialOrders &&
        !ordersQuery.error &&
        ordersQuery.orders.length > 0 && (
        <>
          <AdminOrdersList orders={ordersQuery.orders} />
          {ordersQuery.pagination && (
            <Pagination
              currentPage={ordersQuery.pagination.page}
              limit={ordersQuery.pagination.limit}
              total={ordersQuery.pagination.total}
              onPageChange={onPageChange}
            />
          )}
        </>
        )}
    </section>
  );
};
