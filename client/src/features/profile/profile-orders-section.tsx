import { Pagination, Skeleton, FeedbackMessage } from '../../shared/ui';
import {
  OrdersEmptyState,
  OrdersList,
  OrdersStatusTabs,
} from '../orders';
import { ProfileSectionHeader } from './ui';
import type { ProfileOrdersSectionState } from './use-profile-orders-section';

export const ProfileOrdersSection = ({
  activeOrderStatus,
  onPageChange,
  ordersQuery,
}: ProfileOrdersSectionState) => {
  return (
    <>
      <ProfileSectionHeader
        title="Orders"
        description="Track recent orders and review their current status."
      />
      <OrdersStatusTabs activeStatus={activeOrderStatus} />
      {ordersQuery.isLoading && <Skeleton className="h-48 w-full" />}
      {ordersQuery.error && (
        <FeedbackMessage
          tone="danger"
          title="Orders are unavailable"
          description={ordersQuery.error}
        />
      )}
      {!ordersQuery.isLoading &&
        !ordersQuery.error &&
        ordersQuery.orders.length === 0 && <OrdersEmptyState />}
      {!ordersQuery.isLoading &&
        !ordersQuery.error &&
        ordersQuery.orders.length > 0 && (
        <>
          <OrdersList orders={ordersQuery.orders} />
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
    </>
  );
};
