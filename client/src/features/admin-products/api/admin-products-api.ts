import type {
  ProductAudience,
  ProductImageRole,
  ProductSize,
  ProductStatus,
} from '../../../entities/product';
import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';

export type AdminProductStockFilter =
  | 'in-stock'
  | 'low-stock'
  | 'out-of-stock';

export type AdminProductSortOption =
  | 'default'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-asc'
  | 'rating-desc';

export type AdminProductsParams = {
  audience?: ProductAudience;
  category?: string;
  color?: string;
  hasDiscount?: boolean;
  limit?: number;
  page?: number;
  search?: string;
  size?: ProductSize;
  sort?: AdminProductSortOption;
  status?: ProductStatus;
  stock?: AdminProductStockFilter;
};

export type AdminProductListItem = {
  _id: string;
  audience: ProductAudience[];
  categories: string[];
  colorsCount: number;
  defaultPrice: number;
  discountPrice: number;
  hasDiscount: boolean;
  img: string;
  rating: number;
  sizesCount: number;
  slug: string;
  status: ProductStatus;
  title: string;
  totalStock: number;
  updatedAt: string;
  variantsCount: number;
};

export type AdminProductsStats = {
  active: number;
  archived: number;
  discounted: number;
  draft: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  total: number;
  totalStock: number;
  totalVariants: number;
};

export type AdminProductsResponseData = {
  pagination: PaginationData;
  products: AdminProductListItem[];
  stats: AdminProductsStats;
};

export type CreateAdminProductVariantPayload = {
  sku: string;
  size: ProductSize;
  color: string;
  quantity: number;
  image?: string;
};

export type CreateAdminProductImagePayload = {
  src: string;
  alt: string;
  role: ProductImageRole;
  color?: string;
};

export type CreateAdminProductPayload = {
  audience: ProductAudience[];
  categories: string[];
  defaultPrice: number;
  description: string;
  discountPrice?: number;
  hasDiscount?: boolean;
  images: CreateAdminProductImagePayload[];
  status?: ProductStatus;
  title: string;
  variants: CreateAdminProductVariantPayload[];
};

export type UpdateAdminProductPayload = CreateAdminProductPayload;

export type UpdateAdminProductStatusPayload = {
  status: ProductStatus;
};

export type AdminProductVariant = CreateAdminProductVariantPayload & {
  _id: string;
};

export type AdminProductImage = CreateAdminProductImagePayload;

export type AdminProduct = AdminProductListItem & {
  createdAt: string;
  description: string;
  discountPercent: number;
  images: AdminProductImage[];
  isNewProduct: boolean;
  totalQuantity: number;
  variants: AdminProductVariant[];
};

export type CreateAdminProductResponseData = {
  product: AdminProductListItem;
};

export type AdminProductResponseData = {
  product: AdminProduct;
};

export type UpdateAdminProductResponseData = {
  product: AdminProduct;
};

export type UpdateAdminProductStatusResponseData = AdminProductResponseData;

export type DeleteAdminProductResponseData = {
  deletedFavoritesCount: number;
  deletedReviewsCount: number;
  productId: string;
  slug: string;
  title: string;
};

export const getAdminProducts = async (
  params: AdminProductsParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<AdminProductsResponseData>> => {
  return apiClient.get<AdminProductsResponseData>({
    path: '/admin/products',
    params,
    signal,
    errorMessage: 'Failed to load admin products',
  });
};

export const getAdminProduct = async (
  productId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<AdminProductResponseData>> => {
  return apiClient.get<AdminProductResponseData>({
    path: `/admin/products/${encodeURIComponent(productId)}`,
    signal,
    errorMessage: 'Failed to load admin product',
  });
};

export const createAdminProduct = async (
  payload: CreateAdminProductPayload,
): Promise<ApiResponse<CreateAdminProductResponseData>> => {
  return apiClient.post<
    CreateAdminProductResponseData,
    CreateAdminProductPayload
  >({
    path: '/admin/products',
    body: payload,
    errorMessage: 'Failed to create admin product',
  });
};

export const updateAdminProduct = async ({
  payload,
  productId,
}: {
  payload: UpdateAdminProductPayload;
  productId: string;
}): Promise<ApiResponse<UpdateAdminProductResponseData>> => {
  return apiClient.patch<
    UpdateAdminProductResponseData,
    UpdateAdminProductPayload
  >({
    path: `/admin/products/${encodeURIComponent(productId)}`,
    body: payload,
    errorMessage: 'Failed to update admin product',
  });
};

export const updateAdminProductStatus = async ({
  payload,
  productId,
}: {
  payload: UpdateAdminProductStatusPayload;
  productId: string;
}): Promise<ApiResponse<UpdateAdminProductStatusResponseData>> => {
  return apiClient.patch<
    UpdateAdminProductStatusResponseData,
    UpdateAdminProductStatusPayload
  >({
    path: `/admin/products/${encodeURIComponent(productId)}/status`,
    body: payload,
    errorMessage: 'Failed to update admin product status',
  });
};

export const deleteAdminProduct = async (
  productId: string,
): Promise<ApiResponse<DeleteAdminProductResponseData>> => {
  return apiClient.delete<DeleteAdminProductResponseData>({
    path: `/admin/products/${encodeURIComponent(productId)}`,
    errorMessage: 'Failed to delete admin product',
  });
};
