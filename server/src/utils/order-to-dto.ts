import type { OrderDocument } from '../models/orders.model';
import type { OrderDto } from '../types/api';

export const orderToDto = (order: OrderDocument): OrderDto => ({
  _id: order._id.toString(),
  userId: order.userId.toString(),
  status: order.status,
  items: order.items.map((item) => ({
    productId: item.productId,
    productSlug: item.productSlug,
    variantId: item.variantId,
    sku: item.sku,
    title: item.title,
    image: item.image,
    color: item.color,
    size: item.size,
    price: item.price,
    compareAtPrice: item.compareAtPrice,
    quantity: item.quantity,
  })),
  shippingAddress: {
    firstName: order.shippingAddress.firstName,
    lastName: order.shippingAddress.lastName,
    addressLine1: order.shippingAddress.addressLine1,
    addressLine2: order.shippingAddress.addressLine2,
    city: order.shippingAddress.city,
    region: order.shippingAddress.region,
    postalCode: order.shippingAddress.postalCode,
    country: order.shippingAddress.country,
    phone: order.shippingAddress.phone,
  },
  contactEmail: order.contactEmail,
  subtotal: order.subtotal,
  discountTotal: order.discountTotal,
  total: order.total,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
});
