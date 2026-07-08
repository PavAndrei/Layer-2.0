import type { CheckoutPayload } from '../api';

export type CheckoutFormValues = Omit<CheckoutPayload, 'items'>;

export type CheckoutShippingAddressField =
  keyof CheckoutFormValues['shippingAddress'];

export type CheckoutFormErrors = {
  contactEmail?: string;
  shippingAddress?: Partial<
    Record<CheckoutShippingAddressField, string>
  >;
};

export type CheckoutSummaryItem = {
  color: string;
  image: string;
  price: number;
  productId: string;
  quantity: number;
  size: string;
  title: string;
  variantId: string;
};

export type CheckoutSummaryTotals = {
  discountTotal: number;
  itemsCount: number;
  subtotal: number;
};
