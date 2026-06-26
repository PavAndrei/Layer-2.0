import type { ProductVariant } from './product-variant-types';
import type { ProductAudience } from './product-audience-types';

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
  audience: ProductAudience[];
  hasDiscount: boolean;
  isNewProduct: boolean;
  variants: ProductVariant[];
  totalQuantity: number;
}
