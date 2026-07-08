import type { FormEvent } from 'react';
import { Link } from 'react-router';

import {
  Button,
  FeedbackMessage,
  TextInput,
} from '../../../shared/ui';
import type {
  CheckoutFormErrors,
  CheckoutFormValues,
  CheckoutShippingAddressField,
} from '../model';

type CheckoutFormProps = {
  error: string | null;
  fieldErrors: CheckoutFormErrors;
  isSubmitting: boolean;
  values: CheckoutFormValues;
  onContactEmailChange: (value: string) => void;
  onShippingAddressChange: (
    field: CheckoutShippingAddressField,
    value: string,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const linkClassName =
  'inline-flex min-h-10 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-4 py-2 block-medium text-typography-primary transition-[color,background-color,border-color,transform] duration-150 ease-out hover:bg-background-secondary active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black';

export const CheckoutForm = ({
  error,
  fieldErrors,
  isSubmitting,
  onContactEmailChange,
  onShippingAddressChange,
  onSubmit,
  values,
}: CheckoutFormProps) => (
  <form
    className="order-2 flex flex-col gap-6 lg:order-1"
    noValidate
    onSubmit={onSubmit}
  >
    {error && (
      <FeedbackMessage
        tone="danger"
        title="Could not complete checkout"
        description={error}
      />
    )}

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <h2 className="block-title text-typography-heading">Contact</h2>
      <TextInput
        required
        id="checkout-contact-email"
        label="Email"
        type="email"
        error={fieldErrors.contactEmail}
        value={values.contactEmail}
        onChange={onContactEmailChange}
      />
    </section>

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <h2 className="block-title text-typography-heading">
        Shipping address
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          required
          id="checkout-first-name"
          label="First name"
          error={fieldErrors.shippingAddress?.firstName}
          value={values.shippingAddress.firstName}
          onChange={(value) =>
            onShippingAddressChange('firstName', value)
          }
        />
        <TextInput
          required
          id="checkout-last-name"
          label="Last name"
          error={fieldErrors.shippingAddress?.lastName}
          value={values.shippingAddress.lastName}
          onChange={(value) => onShippingAddressChange('lastName', value)}
        />
      </div>

      <TextInput
        required
        id="checkout-address-line-1"
        label="Address line 1"
        error={fieldErrors.shippingAddress?.addressLine1}
        value={values.shippingAddress.addressLine1}
        onChange={(value) =>
          onShippingAddressChange('addressLine1', value)
        }
      />
      <TextInput
        id="checkout-address-line-2"
        label="Address line 2"
        error={fieldErrors.shippingAddress?.addressLine2}
        value={values.shippingAddress.addressLine2}
        onChange={(value) =>
          onShippingAddressChange('addressLine2', value)
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          required
          id="checkout-city"
          label="City"
          error={fieldErrors.shippingAddress?.city}
          value={values.shippingAddress.city}
          onChange={(value) => onShippingAddressChange('city', value)}
        />
        <TextInput
          id="checkout-region"
          label="Region"
          error={fieldErrors.shippingAddress?.region}
          value={values.shippingAddress.region}
          onChange={(value) => onShippingAddressChange('region', value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          required
          id="checkout-postal-code"
          label="Postal code"
          error={fieldErrors.shippingAddress?.postalCode}
          value={values.shippingAddress.postalCode}
          onChange={(value) =>
            onShippingAddressChange('postalCode', value)
          }
        />
        <TextInput
          required
          id="checkout-country"
          label="Country"
          error={fieldErrors.shippingAddress?.country}
          value={values.shippingAddress.country}
          onChange={(value) => onShippingAddressChange('country', value)}
        />
      </div>

      <TextInput
        id="checkout-phone"
        label="Phone"
        type="tel"
        error={fieldErrors.shippingAddress?.phone}
        value={values.shippingAddress.phone}
        onChange={(value) => onShippingAddressChange('phone', value)}
      />
    </section>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Button
        className="w-full sm:w-fit"
        disabled={isSubmitting}
        type="submit"
        variant="primary"
      >
        {isSubmitting ? 'Placing order...' : 'Place order'}
      </Button>
      <Link to="/cart" className={linkClassName}>
        Back to cart
      </Link>
    </div>
  </form>
);
