import type { AdminProduct } from '../api';
import type { AdminProductFormValues } from './admin-product-form-types';

const formatNumberField = (value: number) => String(value);

export const toAdminProductFormValues = (
  product: AdminProduct,
): AdminProductFormValues => ({
  audience: product.audience,
  categories: product.categories,
  defaultPrice: formatNumberField(product.defaultPrice),
  description: product.description,
  discountPrice: product.hasDiscount
    ? formatNumberField(product.discountPrice)
    : '',
  hasDiscount: product.hasDiscount,
  images: product.images.map((image, index) => ({
    id: `image-${index}`,
    alt: image.alt,
    color: image.color ?? '',
    role: image.role,
    src: image.src,
  })),
  status: product.status,
  title: product.title,
  variants: product.variants.map((variant) => ({
    id: variant._id,
    color: variant.color,
    image: variant.image ?? '',
    quantity: String(variant.quantity),
    size: variant.size,
    sku: variant.sku,
  })),
});
