import 'dotenv/config';
import mongoose from 'mongoose';

import { MONGO_URI } from '../constants/env';
import { Order } from '../models/orders.model';
import { Product } from '../models/products.model';
import { User } from '../models/users.model';
import type {
  OrderItemSnapshot,
  OrderPaymentStatus,
  OrderShippingAddress,
  OrderStatus,
} from '../types/order';

const TEST_ORDERS_COUNT = Number(process.env.TEST_ORDERS_COUNT ?? 26);
const TEST_ORDERS_USER_EMAIL = process.env.TEST_ORDERS_USER_EMAIL;

const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'pending',
  'paid',
  'processing',
  'completed',
  'cancelled',
];

const getPaymentStatus = (status: OrderStatus): OrderPaymentStatus => {
  if (
    status === 'paid' ||
    status === 'processing' ||
    status === 'completed'
  ) {
    return 'paid';
  }

  return 'pending';
};

const shippingAddress: OrderShippingAddress = {
  firstName: 'Test',
  lastName: 'Customer',
  addressLine1: '123 Test Checkout Street',
  city: 'Tbilisi',
  country: 'GE',
  phone: '+995555000000',
  postalCode: '0100',
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const getOrderTotals = (items: OrderItemSnapshot[]) => {
  const subtotal = items.reduce(
    (total, item) =>
      total +
      Math.max(item.compareAtPrice ?? item.price, item.price) *
        item.quantity,
    0,
  );
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountTotal = subtotal - total;

  return {
    discountTotal: roundMoney(discountTotal),
    subtotal: roundMoney(subtotal),
    total: roundMoney(total),
  };
};

const getUser = async () => {
  if (TEST_ORDERS_USER_EMAIL) {
    const user = await User.findOne({
      email: TEST_ORDERS_USER_EMAIL.toLowerCase(),
    });

    if (!user) {
      throw new Error(`User ${TEST_ORDERS_USER_EMAIL} was not found.`);
    }

    return user;
  }

  const user = await User.findOne({}).sort({ createdAt: -1 });

  if (!user) {
    throw new Error('No users found.');
  }

  return user;
};

const getOrderItems = async (orderIndex: number) => {
  const products = await Product.find({}).limit(4);

  if (products.length === 0) {
    throw new Error('No products found.');
  }

  return products.slice(0, 2).map((product, productIndex) => {
    const variant =
      product.variants[(orderIndex + productIndex) % product.variants.length];

    if (!variant) {
      throw new Error(`Product ${product.title} has no variants.`);
    }

    const price = product.hasDiscount
      ? product.discountPrice
      : product.defaultPrice;

    return {
      color: variant.color,
      compareAtPrice: product.hasDiscount
        ? product.defaultPrice
        : undefined,
      image: variant.image ?? product.img,
      price,
      productId: product._id.toString(),
      productSlug: product.slug,
      quantity: (orderIndex % 3) + 1,
      size: variant.size,
      sku: variant.sku,
      title: product.title,
      variantId: variant._id.toString(),
    } satisfies OrderItemSnapshot;
  });
};

const seedTestOrders = async () => {
  await mongoose.connect(MONGO_URI);

  const user = await getUser();
  const orders = [];

  for (let index = 0; index < TEST_ORDERS_COUNT; index += 1) {
    const items = await getOrderItems(index);
    const totals = getOrderTotals(items);
    const status =
      ORDER_STATUS_SEQUENCE[index % ORDER_STATUS_SEQUENCE.length];
    const createdAt = new Date(Date.now() - index * 24 * 60 * 60 * 1000);

    orders.push({
      contactEmail: user.email,
      createdAt,
      discountTotal: totals.discountTotal,
      items,
      paymentStatus: getPaymentStatus(status),
      shippingAddress,
      status,
      statusHistory: [
        {
          changedAt: createdAt,
          status,
        },
      ],
      subtotal: totals.subtotal,
      total: totals.total,
      updatedAt: createdAt,
      userId: user._id,
    });
  }

  await Order.insertMany(orders);

  console.log(
    `Seeded ${orders.length} test orders for ${user.email}. Products were not modified.`,
  );
};

seedTestOrders()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
