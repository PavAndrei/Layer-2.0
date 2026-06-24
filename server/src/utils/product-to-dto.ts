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
  color: product.color,
  hasDiscount: product.hasDiscount,
  isNewProduct: product.isNewProduct,
  quantity: product.quantity,
});
