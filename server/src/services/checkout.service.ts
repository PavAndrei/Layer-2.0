import { Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { Product } from '../models/products.model';
import { createOrderData } from './orders.service';
import type {
  CartValidationResponse,
  OrderResponse,
} from '../types/api';
import type { OrderItemSnapshot } from '../types/order';
import type { CheckoutBody } from '../validators/checkout.validators';
import { validateCartData } from './cart.service';
import {
  getStoreSettingsDocument,
  storeOrderSettingsToDto,
  storeShippingSettingsToDto,
} from './store-settings.service';

type StockItem = Pick<
  OrderItemSnapshot,
  'productId' | 'quantity' | 'variantId'
>;

type CheckoutUserContext = {
  isEmailVerified: boolean;
};

const restoreProductStock = async (items: StockItem[]) => {
  await Promise.all(
    items.map((item) =>
      Product.updateOne(
        {
          _id: new Types.ObjectId(item.productId),
          'variants._id': new Types.ObjectId(item.variantId),
        },
        {
          $inc: {
            'variants.$.quantity': item.quantity,
          },
        },
      ),
    ),
  );
};

const decrementProductStock = async (items: StockItem[]) => {
  const decrementedItems: StockItem[] = [];

  for (const item of items) {
    const result = await Product.updateOne(
      {
        _id: new Types.ObjectId(item.productId),
        variants: {
          $elemMatch: {
            _id: new Types.ObjectId(item.variantId),
            quantity: {
              $gte: item.quantity,
            },
          },
        },
      },
      {
        $inc: {
          'variants.$.quantity': -item.quantity,
        },
      },
    );

    if (result.modifiedCount !== 1) {
      await restoreProductStock(decrementedItems);

      throw ApiError.Conflict(
        'Some cart items are no longer available',
      );
    }

    decrementedItems.push(item);
  }

  return decrementedItems;
};

const getOrderItemsFromCart = (
  items: CartValidationResponse['data']['items'],
): OrderItemSnapshot[] =>
  items.map((item) => ({
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
  }));

export const checkoutData = async (
  userId: string,
  body: CheckoutBody,
  user: CheckoutUserContext,
): Promise<OrderResponse['data']> => {
  const settings = await getStoreSettingsDocument();
  const orderSettings = storeOrderSettingsToDto(settings);
  const shippingSettings = storeShippingSettingsToDto(settings);

  if (!orderSettings.ordersEnabled) {
    throw ApiError.Forbidden('Checkout is currently unavailable');
  }

  if (
    orderSettings.requireVerifiedEmailForCheckout &&
    !user.isEmailVerified
  ) {
    throw ApiError.Forbidden(
      'Email verification is required before checkout',
    );
  }

  const cart = await validateCartData({
    items: body.items,
  });

  if (cart.removedItems.length > 0 || cart.updatedItems.length > 0) {
    throw ApiError.Conflict('Cart must be updated before checkout');
  }

  const orderItems = getOrderItemsFromCart(cart.items);
  const decrementedItems = await decrementProductStock(orderItems);

  try {
    return await createOrderData(
      userId,
      {
        contactEmail: body.contactEmail,
        items: orderItems,
        shippingAddress: body.shippingAddress,
      },
      {
        shippingSettings,
      },
    );
  } catch (error) {
    await restoreProductStock(decrementedItems);

    throw error;
  }
};
