import type { ProductDocument } from '../models/products.model';
import type { AdminProductDto, AdminProductListItemDto } from '../types/api';

const getUniqueValuesCount = (values: string[]) => new Set(values).size;

const getProductTotalStock = (product: ProductDocument) =>
  product.variants.reduce(
    (total, variant) => total + variant.quantity,
    0,
  );

export const adminProductToListItemDto = (
  product: ProductDocument,
): AdminProductListItemDto => {
  const totalStock = getProductTotalStock(product);

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

export const adminProductToDto = (
  product: ProductDocument,
): AdminProductDto => {
  const totalStock = getProductTotalStock(product);

  return {
    ...adminProductToListItemDto(product),
    createdAt: product.createdAt.toISOString(),
    description: product.description,
    discountPercent: product.discountPercent,
    images: product.images,
    isNewProduct: product.isNewProduct,
    totalQuantity: totalStock,
    variants: product.variants.map((variant) => ({
      _id: variant._id.toString(),
      color: variant.color,
      image: variant.image,
      quantity: variant.quantity,
      size: variant.size,
      sku: variant.sku,
    })),
  };
};
