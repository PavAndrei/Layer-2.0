import { Link } from 'react-router';

import { Button, FeedbackMessage, Skeleton } from '../../shared/ui';
import {
  OrderHeader,
  OrderHeaderFallback,
  OrderItems,
  OrderShippingAddress,
  OrderSummary,
} from './ui';
import { useOrderPage } from './use-order-page';

export const OrderPage = () => {
  const { error, isLoading, order, orderNumber, placedAt, refetch } =
    useOrderPage();

  if (isLoading) {
    return (
      <main className="container mx-auto flex flex-col gap-6 px-2.5">
        <OrderHeaderFallback />
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </main>
    );
  }

  if (!order || !orderNumber || !placedAt) {
    return (
      <main className="container mx-auto flex flex-col gap-6 px-2.5">
        <OrderHeaderFallback />
        <FeedbackMessage
          tone="danger"
          title="Order is unavailable"
          description={error ?? 'Refresh the page or return to your profile.'}
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="sm" variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
              <Link
                to="/profile"
                className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
              >
                Go to profile
              </Link>
            </div>
          }
        />
      </main>
    );
  }

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <OrderHeader
        orderNumber={orderNumber}
        placedAt={placedAt}
        status={order.status}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <OrderItems items={order.items} />
          <OrderShippingAddress
            contactEmail={order.contactEmail}
            shippingAddress={order.shippingAddress}
          />
        </div>
        <OrderSummary
          discountTotal={order.discountTotal}
          subtotal={order.subtotal}
          total={order.total}
        />
      </div>
    </main>
  );
};
