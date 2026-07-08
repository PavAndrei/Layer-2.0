import {
  CheckoutEmptyState,
  CheckoutForm,
  CheckoutHeader,
  CheckoutOrderSummary,
} from './ui';
import { useCheckoutPage } from './use-checkout-page';

export const CheckoutPage = () => {
  const {
    error,
    fieldErrors,
    handleSubmit,
    isEmpty,
    isSubmitting,
    items,
    totals,
    updateContactEmail,
    updateShippingAddress,
    values,
  } = useCheckoutPage();

  if (isEmpty) {
    return (
      <main className="container mx-auto flex flex-col gap-6 px-2.5">
        <CheckoutHeader />
        <CheckoutEmptyState />
      </main>
    );
  }

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <CheckoutHeader />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <CheckoutForm
          error={error}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
          values={values}
          onContactEmailChange={updateContactEmail}
          onShippingAddressChange={updateShippingAddress}
          onSubmit={handleSubmit}
        />
        <CheckoutOrderSummary items={items} totals={totals} />
      </div>
    </main>
  );
};
