import type { ProductAudience } from './product-audience';

export type ProductCollectionId =
  | 'catalog'
  | 'men'
  | 'women'
  | 'unisex'
  | 'sales'
  | 'new';

export type ProductCollectionBaseFilters = {
  audience?: ProductAudience[];
  hasDiscount?: boolean;
  isNewProduct?: boolean;
};

export type ProductCollection = {
  id: ProductCollectionId;
  title: string;
  description: string;
  baseFilters: ProductCollectionBaseFilters;
};
