import { Link, useParams } from 'react-router';

import type { AdminOrder } from '../../entities/order';
import { useScrollToTopOnChange } from '../../shared/hooks';
import {
  Button,
  FeedbackMessage,
  SectionedPageHeader,
  Skeleton,
} from '../../shared/ui';
import {
  AdminOrderCustomerCard,
  AdminOrderDetailSummary,
  AdminOrderItemsCard,
  AdminOrderManagementForm,
  AdminOrderStatusHistoryCard,
} from './ui';
import { useAdminOrder, useAdminOrderManagementForm } from './model';

const getAdminOrderBreadcrumbs = (orderNumber?: string) => [
  { label: 'Home', to: '/' },
  { label: 'Admin', to: '/admin' },
  { label: 'Orders', to: '/admin?section=orders' },
  { label: orderNumber ? `#${orderNumber}` : 'Order' },
];

const AdminOrderPageSkeleton = () => (
  <>
    <Skeleton className="h-24 w-full" />
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  </>
);

const AdminOrderLoadedContent = ({ order }: { order: AdminOrder }) => {
  const managementForm = useAdminOrderManagementForm(order);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-6">
        <AdminOrderCustomerCard order={order} />
        <AdminOrderItemsCard items={order.items} />
        <AdminOrderManagementForm
          errorMessage={managementForm.errorMessage}
          fieldErrors={managementForm.fieldErrors}
          isSubmitting={managementForm.isSubmitting}
          isStatusNoteDisabled={managementForm.isStatusNoteDisabled}
          successMessage={managementForm.successMessage}
          values={managementForm.values}
          onSubmit={managementForm.onSubmit}
          onValueChange={managementForm.setFieldValue}
        />
        <AdminOrderStatusHistoryCard history={order.statusHistory} />
      </div>

      <AdminOrderDetailSummary order={order} />
    </div>
  );
};

export const AdminOrderPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const adminOrderQuery = useAdminOrder(orderId);
  const { error, isLoading, order, refetch } = adminOrderQuery;
  const pageTitle = order ? `Order #${order.orderNumber}` : 'Order';
  const pageDescription = order
    ? `${order.customerName || 'Customer'} - ${order.contactEmail}`
    : 'Review order details and fulfillment data.';

  useScrollToTopOnChange(orderId, {
    behavior: 'auto',
    skipInitialScroll: false,
  });

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <SectionedPageHeader
        breadcrumbs={getAdminOrderBreadcrumbs(order?.orderNumber)}
        title={pageTitle}
        description={pageDescription}
      />

      {isLoading && <AdminOrderPageSkeleton />}

      {!isLoading && !order && (
        <FeedbackMessage
          tone="danger"
          title="Order is unavailable"
          description={error ?? 'Refresh the page or return to admin orders.'}
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="sm" variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
              <Link
                to="/admin?section=orders"
                className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
              >
                Back to orders
              </Link>
            </div>
          }
        />
      )}

      {!isLoading && order && <AdminOrderLoadedContent order={order} />}
    </main>
  );
};
