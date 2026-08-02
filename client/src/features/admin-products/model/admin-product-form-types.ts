import type {
  ProductAudience,
  ProductImageRole,
  ProductSize,
  ProductStatus,
} from '../../../entities/product';

export type AdminProductVariantFormValues = {
  id: string;
  color: string;
  image: string;
  quantity: string;
  size: ProductSize;
  sku: string;
};

export type AdminProductImageFormValues = {
  id: string;
  alt: string;
  color: string;
  fileId: string;
  filePath: string;
  role: ProductImageRole;
  src: string;
};

export type AdminProductFormValues = {
  audience: ProductAudience[];
  categories: string[];
  defaultPrice: string;
  description: string;
  discountPrice: string;
  hasDiscount: boolean;
  images: AdminProductImageFormValues[];
  status: ProductStatus;
  title: string;
  variants: AdminProductVariantFormValues[];
};

export type AdminProductVariantFormErrors = Partial<
  Record<keyof Omit<AdminProductVariantFormValues, 'id'>, string>
>;

export type AdminProductImageFormErrors = Partial<
  Record<keyof Omit<AdminProductImageFormValues, 'id'>, string>
>;

export type AdminProductFormErrors = Partial<
  Record<
    Exclude<keyof AdminProductFormValues, 'variants' | 'images'>,
    string
  >
> & {
  images?: string;
  imageItems?: Record<string, AdminProductImageFormErrors>;
  variants?: string;
  variantItems?: Record<string, AdminProductVariantFormErrors>;
};
