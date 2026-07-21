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
import type { UserAuthProvider, UserRole } from '../types/user';
import { hashPassword } from '../utils/password';

const TEST_USERS_EMAIL_DOMAIN = 'admin-users.test';
const TEST_USERS_PASSWORD = 'Password123!';

type TestUserSeed = {
  authProviders: UserAuthProvider[];
  avatarUrl?: string;
  email: string;
  googleId?: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  name: string;
  ordersCount: number;
  paidOrdersCount: number;
  role: UserRole;
  totalMultiplier: number;
};

const TEST_USERS: TestUserSeed[] = [
  {
    authProviders: ['password'],
    email: `ava.customer@${TEST_USERS_EMAIL_DOMAIN}`,
    isBlocked: false,
    isEmailVerified: true,
    name: 'Ava Customer',
    ordersCount: 8,
    paidOrdersCount: 7,
    role: 'customer',
    totalMultiplier: 1.4,
  },
  {
    authProviders: ['google'],
    avatarUrl: 'https://lh3.googleusercontent.com/a/test-ava-google',
    email: `noah.google@${TEST_USERS_EMAIL_DOMAIN}`,
    googleId: 'test-google-noah-admin-users',
    isBlocked: false,
    isEmailVerified: true,
    name: 'Noah Google',
    ordersCount: 3,
    paidOrdersCount: 3,
    role: 'customer',
    totalMultiplier: 2.4,
  },
  {
    authProviders: ['password'],
    email: `mia.unverified@${TEST_USERS_EMAIL_DOMAIN}`,
    isBlocked: false,
    isEmailVerified: false,
    name: 'Mia Unverified',
    ordersCount: 1,
    paidOrdersCount: 0,
    role: 'customer',
    totalMultiplier: 1,
  },
  {
    authProviders: ['password', 'google'],
    avatarUrl: 'https://lh3.googleusercontent.com/a/test-luca-linked',
    email: `luca.linked@${TEST_USERS_EMAIL_DOMAIN}`,
    googleId: 'test-google-luca-admin-users',
    isBlocked: false,
    isEmailVerified: true,
    name: 'Luca Linked',
    ordersCount: 5,
    paidOrdersCount: 4,
    role: 'customer',
    totalMultiplier: 1.8,
  },
  {
    authProviders: ['google'],
    avatarUrl: 'https://lh3.googleusercontent.com/a/test-emma-blocked',
    email: `emma.blocked@${TEST_USERS_EMAIL_DOMAIN}`,
    googleId: 'test-google-emma-admin-users',
    isBlocked: true,
    isEmailVerified: true,
    name: 'Emma Blocked',
    ordersCount: 2,
    paidOrdersCount: 1,
    role: 'customer',
    totalMultiplier: 0.8,
  },
  {
    authProviders: ['password'],
    email: `liam.admin@${TEST_USERS_EMAIL_DOMAIN}`,
    isBlocked: false,
    isEmailVerified: true,
    name: 'Liam Admin',
    ordersCount: 0,
    paidOrdersCount: 0,
    role: 'admin',
    totalMultiplier: 1,
  },
  {
    authProviders: ['password', 'google'],
    avatarUrl: 'https://lh3.googleusercontent.com/a/test-sophia-admin',
    email: `sophia.admin-google@${TEST_USERS_EMAIL_DOMAIN}`,
    googleId: 'test-google-sophia-admin-users',
    isBlocked: false,
    isEmailVerified: true,
    name: 'Sophia Admin Google',
    ordersCount: 1,
    paidOrdersCount: 1,
    role: 'admin',
    totalMultiplier: 3,
  },
  {
    authProviders: ['password'],
    email: `oliver.bigspender@${TEST_USERS_EMAIL_DOMAIN}`,
    isBlocked: false,
    isEmailVerified: true,
    name: 'Oliver Big Spender',
    ordersCount: 4,
    paidOrdersCount: 4,
    role: 'customer',
    totalMultiplier: 4.5,
  },
  {
    authProviders: ['password'],
    email: `isabella.manyorders@${TEST_USERS_EMAIL_DOMAIN}`,
    isBlocked: false,
    isEmailVerified: true,
    name: 'Isabella Many Orders',
    ordersCount: 12,
    paidOrdersCount: 9,
    role: 'customer',
    totalMultiplier: 1.1,
  },
  {
    authProviders: ['google'],
    avatarUrl: 'https://lh3.googleusercontent.com/a/test-ethan-inactive',
    email: `ethan.blocked-unverified@${TEST_USERS_EMAIL_DOMAIN}`,
    googleId: 'test-google-ethan-admin-users',
    isBlocked: true,
    isEmailVerified: false,
    name: 'Ethan Blocked Unverified',
    ordersCount: 0,
    paidOrdersCount: 0,
    role: 'customer',
    totalMultiplier: 1,
  },
  {
    authProviders: ['password'],
    email: `amelia.failed-payments@${TEST_USERS_EMAIL_DOMAIN}`,
    isBlocked: false,
    isEmailVerified: true,
    name: 'Amelia Failed Payments',
    ordersCount: 3,
    paidOrdersCount: 0,
    role: 'customer',
    totalMultiplier: 1.3,
  },
  {
    authProviders: ['google'],
    avatarUrl: 'https://lh3.googleusercontent.com/a/test-james-new',
    email: `james.new-google@${TEST_USERS_EMAIL_DOMAIN}`,
    googleId: 'test-google-james-admin-users',
    isBlocked: false,
    isEmailVerified: true,
    name: 'James New Google',
    ordersCount: 2,
    paidOrdersCount: 2,
    role: 'customer',
    totalMultiplier: 2,
  },
];

const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'pending',
  'paid',
  'processing',
  'completed',
  'cancelled',
];

const PAYMENT_STATUS_SEQUENCE: OrderPaymentStatus[] = [
  'pending',
  'paid',
  'paid',
  'paid',
  'failed',
  'refunded',
];

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const getPaymentStatus = (
  orderIndex: number,
  paidOrdersCount: number,
): OrderPaymentStatus => {
  if (orderIndex < paidOrdersCount) return 'paid';

  return PAYMENT_STATUS_SEQUENCE[
    orderIndex % PAYMENT_STATUS_SEQUENCE.length
  ] ?? 'pending';
};

const getShippingAddress = (user: TestUserSeed): OrderShippingAddress => {
  const [firstName = 'Test', lastName = 'User'] = user.name.split(' ');

  return {
    firstName,
    lastName,
    addressLine1: '500 Admin Users Seed Street',
    city: 'Tbilisi',
    country: 'GE',
    phone: '+995555100000',
    postalCode: '0100',
  };
};

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

  return {
    discountTotal: roundMoney(subtotal - total),
    subtotal: roundMoney(subtotal),
    total: roundMoney(total),
  };
};

const getOrderItems = (
  products: Awaited<ReturnType<typeof Product.find>>,
  orderIndex: number,
  totalMultiplier: number,
) => {
  const selectedProducts = products.slice(
    orderIndex % Math.max(products.length - 1, 1),
    orderIndex % Math.max(products.length - 1, 1) + 2,
  );
  const productsForOrder =
    selectedProducts.length > 0 ? selectedProducts : products.slice(0, 2);

  return productsForOrder.map((product, productIndex) => {
    const variant =
      product.variants[(orderIndex + productIndex) % product.variants.length];

    if (!variant) {
      throw new Error(`Product ${product.title} has no variants.`);
    }

    const basePrice = product.hasDiscount
      ? product.discountPrice
      : product.defaultPrice;
    const price = roundMoney(basePrice * totalMultiplier);

    return {
      color: variant.color,
      compareAtPrice: product.hasDiscount
        ? roundMoney(product.defaultPrice * totalMultiplier)
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

const seedTestUsers = async () => {
  await mongoose.connect(MONGO_URI);

  const existingTestUsers = await User.find({
    email: {
      $regex: `@${TEST_USERS_EMAIL_DOMAIN.replace('.', '\\.')}$`,
      $options: 'i',
    },
  }).select('_id');
  const existingTestUserIds = existingTestUsers.map((user) => user._id);

  if (existingTestUserIds.length > 0) {
    await Order.deleteMany({
      userId: {
        $in: existingTestUserIds,
      },
    });
    await User.deleteMany({
      _id: {
        $in: existingTestUserIds,
      },
    });
  }

  const products = await Product.find({}).limit(8);

  if (products.length === 0) {
    throw new Error('No products found. Run seed:database first.');
  }

  const passwordHash = await hashPassword(TEST_USERS_PASSWORD);
  const users = await User.insertMany(
    TEST_USERS.map((user, index) => {
      const createdAt = new Date(
        Date.now() - (TEST_USERS.length - index) * 24 * 60 * 60 * 1000,
      );

      return {
        authProviders: user.authProviders,
        avatarUrl: user.avatarUrl,
        createdAt,
        email: user.email,
        googleId: user.googleId,
        isBlocked: user.isBlocked,
        isEmailVerified: user.isEmailVerified,
        name: user.name,
        passwordHash: user.authProviders.includes('password')
          ? passwordHash
          : undefined,
        role: user.role,
        updatedAt: createdAt,
      };
    }),
  );

  const orders = users.flatMap((user, userIndex) => {
    const seed = TEST_USERS[userIndex];

    if (!seed) return [];

    return Array.from({ length: seed.ordersCount }, (_, orderIndex) => {
      const items = getOrderItems(
        products,
        userIndex + orderIndex,
        seed.totalMultiplier,
      );
      const totals = getOrderTotals(items);
      const paymentStatus = getPaymentStatus(
        orderIndex,
        seed.paidOrdersCount,
      );
      const status =
        ORDER_STATUS_SEQUENCE[
          (userIndex + orderIndex) % ORDER_STATUS_SEQUENCE.length
        ] ?? 'pending';
      const createdAt = new Date(
        Date.now() -
          (userIndex * 7 + orderIndex) * 24 * 60 * 60 * 1000,
      );

      return {
        contactEmail: user.email,
        createdAt,
        discountTotal: totals.discountTotal,
        items,
        paymentStatus,
        shippingAddress: getShippingAddress(seed),
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
      };
    });
  });

  if (orders.length > 0) {
    await Order.insertMany(orders);
  }

  console.log(
    `Seeded ${users.length} admin test users and ${orders.length} orders. Products were not modified. Test password: ${TEST_USERS_PASSWORD}`,
  );
};

seedTestUsers()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
