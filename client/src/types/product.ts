import type { ProductVariant } from './product-variant';

export interface ProductCardProps {
  _id: string;
  img: string;
  title: string;
  description: string;
  defaultPrice: number;
  discountPrice: number;
  discountPercent: number;
  rating: number;
  categories: string[];
  hasDiscount: boolean;
  isNewProduct: boolean;
  variants: ProductVariant[];
  totalQuantity: number;
}
