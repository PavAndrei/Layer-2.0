import { Breadcrumbs } from '../../../shared/ui';

const checkoutBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout' },
];

export const CheckoutHeader = () => (
  <div className="flex flex-col gap-4 pb-4">
    <Breadcrumbs items={checkoutBreadcrumbs} />

    <div className="flex flex-col gap-2">
      <h1 className="heading text-typography-heading">Checkout</h1>
      <p className="description text-typography-secondary">
        Confirm your contact details and delivery address.
      </p>
    </div>
  </div>
);
