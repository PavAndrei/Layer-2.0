export interface ProductCardProps {
  _id: string;
  img: string;
  title: string;
  description: string;
  defaultPrice: number;
  discountPrice?: number;
  discountPercent?: number;
  rating: number;
  categories: string[];
  color: string;
  hasDiscount: boolean;
  isNewProduct: boolean;
  quantity: number;
}
