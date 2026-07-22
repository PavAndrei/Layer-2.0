import type { OrderShippingSnapshot } from './order-types';

type OrderShippingLabelData = {
  hasShippingSnapshot?: boolean;
  shippingSnapshot?: OrderShippingSnapshot;
  shippingTotal: number;
};

export const hasCapturedShipping = (order: OrderShippingLabelData) => {
  return order.hasShippingSnapshot ?? Boolean(order.shippingSnapshot);
};

export const getOrderShippingLabel = (
  order: OrderShippingLabelData,
  formatPrice: (price: number) => string,
) => {
  if (!hasCapturedShipping(order)) {
    return 'Not captured';
  }

  return order.shippingTotal === 0
    ? 'Free'
    : formatPrice(order.shippingTotal);
};
