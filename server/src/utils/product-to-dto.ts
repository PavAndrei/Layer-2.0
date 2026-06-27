import type { ProductDocument } from '../models/products.model';
import type { ProductDto } from '../types/api';

export const productToDto = (product: ProductDocument): ProductDto => ({
  _id: product._id.toString(),
  img: product.img,
  title: product.title,
  description: product.description,
  defaultPrice: product.defaultPrice,
  discountPrice: product.discountPrice,
  discountPercent: product.discountPercent,
  rating: product.rating,
  categories: product.categories,
  audience: product.audience?.length ? product.audience : ['unisex'],
  hasDiscount: product.hasDiscount,
  isNewProduct: product.isNewProduct,
  images: product.images ?? [],
  variants: product.variants.map((variant) => ({
    _id: variant._id.toString(),
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    quantity: variant.quantity,
    image: variant.image,
  })),
  totalQuantity: product.variants.reduce(
    (total, variant) => total + variant.quantity,
    0,
  ),
});
