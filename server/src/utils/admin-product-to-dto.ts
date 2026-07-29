import type { ProductDocument } from '../models/products.model';
import type { AdminProductListItemDto } from '../types/api';

const getUniqueValuesCount = (values: string[]) => new Set(values).size;

export const adminProductToListItemDto = (
  product: ProductDocument,
): AdminProductListItemDto => {
  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.quantity,
    0,
  );

  return {
    _id: product._id.toString(),
    audience: product.audience?.length ? product.audience : ['unisex'],
    categories: product.categories,
    colorsCount: getUniqueValuesCount(
      product.variants.map((variant) => variant.color),
    ),
    defaultPrice: product.defaultPrice,
    discountPrice: product.discountPrice,
    hasDiscount: product.hasDiscount,
    img: product.img,
    rating: product.rating,
    sizesCount: getUniqueValuesCount(
      product.variants.map((variant) => variant.size),
    ),
    slug: product.slug,
    status: product.status ?? 'active',
    title: product.title,
    totalStock,
    updatedAt: product.updatedAt.toISOString(),
    variantsCount: product.variants.length,
  };
};
