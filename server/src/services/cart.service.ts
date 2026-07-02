import { Types } from 'mongoose';

import { Product } from '../models/products.model';
import type {
  CartValidationRemovedItemReason,
  CartValidationResponse,
} from '../types/api';
import type { ValidateCartBody } from '../validators/cart.validators';

type CartValidationData = CartValidationResponse['data'];
type CartValidationItem = ValidateCartBody['items'][number];

const getRequestedItemKey = (item: CartValidationItem) =>
  `${item.productId}:${item.variantId}`;

const getRemovedItem = (
  item: CartValidationItem,
  reason: CartValidationRemovedItemReason,
): CartValidationData['removedItems'][number] => ({
  productId: item.productId,
  variantId: item.variantId,
  reason,
});

export const validateCartData = async (
  body: ValidateCartBody,
): Promise<CartValidationData> => {
  const requestedItems = new Map<string, CartValidationItem>();

  body.items.forEach((item) => {
    const key = getRequestedItemKey(item);
    const existingItem = requestedItems.get(key);

    requestedItems.set(key, {
      ...item,
      quantity: (existingItem?.quantity ?? 0) + item.quantity,
    });
  });

  const items = [...requestedItems.values()];
  const products = await Product.find({
    _id: {
      $in: items.map((item) => new Types.ObjectId(item.productId)),
    },
  });
  const productsById = new Map(
    products.map((product) => [product._id.toString(), product]),
  );
  const validatedItems: CartValidationData['items'] = [];
  const removedItems: CartValidationData['removedItems'] = [];
  const updatedItems: CartValidationData['updatedItems'] = [];

  items.forEach((item) => {
    const product = productsById.get(item.productId);

    if (!product) {
      removedItems.push(getRemovedItem(item, 'product-not-found'));
      return;
    }

    const variant = product.variants.find(
      (productVariant) => productVariant._id.toString() === item.variantId,
    );

    if (!variant) {
      removedItems.push(getRemovedItem(item, 'variant-not-found'));
      return;
    }

    if (variant.quantity <= 0) {
      removedItems.push(getRemovedItem(item, 'out-of-stock'));
      return;
    }

    const price = product.hasDiscount
      ? product.discountPrice
      : product.defaultPrice;
    const quantity = Math.min(item.quantity, variant.quantity);

    if (quantity < item.quantity) {
      updatedItems.push({
        productId: item.productId,
        variantId: item.variantId,
        reason: 'quantity-reduced',
        previousQuantity: item.quantity,
        nextQuantity: quantity,
      });
    }

    validatedItems.push({
      productId: product._id.toString(),
      productSlug: product.slug,
      variantId: variant._id.toString(),
      sku: variant.sku,
      title: product.title,
      image: variant.image ?? product.img,
      color: variant.color,
      size: variant.size,
      price,
      compareAtPrice: product.hasDiscount
        ? product.defaultPrice
        : undefined,
      quantity,
      maxQuantity: variant.quantity,
    });
  });

  return {
    items: validatedItems,
    removedItems,
    updatedItems,
  };
};
