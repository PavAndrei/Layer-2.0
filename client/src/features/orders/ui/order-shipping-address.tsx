import type {
  OrderShippingAddress as OrderShippingAddressData,
} from '../../../entities/order';

type OrderShippingAddressProps = {
  contactEmail: string;
  shippingAddress: OrderShippingAddressData;
};

export const OrderShippingAddress = ({
  contactEmail,
  shippingAddress,
}: OrderShippingAddressProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <h2 className="block-title text-typography-heading">Shipping</h2>

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">
          Recipient
        </span>
        <span className="block-medium text-typography-heading">
          {shippingAddress.firstName} {shippingAddress.lastName}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">Email</span>
        <span className="block-medium text-typography-heading">
          {contactEmail}
        </span>
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <span className="block-small text-typography-secondary">
          Address
        </span>
        <span className="block-medium text-typography-heading">
          {shippingAddress.addressLine1}
          {shippingAddress.addressLine2
            ? `, ${shippingAddress.addressLine2}`
            : ''}
        </span>
        <span className="block-medium text-typography-heading">
          {shippingAddress.city}
          {shippingAddress.region ? `, ${shippingAddress.region}` : ''}{' '}
          {shippingAddress.postalCode}
        </span>
        <span className="block-medium text-typography-heading">
          {shippingAddress.country}
        </span>
      </div>

      {shippingAddress.phone && (
        <div className="flex flex-col gap-1">
          <span className="block-small text-typography-secondary">
            Phone
          </span>
          <span className="block-medium text-typography-heading">
            {shippingAddress.phone}
          </span>
        </div>
      )}
    </div>
  </section>
);
