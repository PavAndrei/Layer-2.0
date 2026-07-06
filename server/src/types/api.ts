import type { ProductSize, ProductVariant } from './product-variant';
import type { ProductAudience } from './product-audience';
import type { ProductImage } from './product-image';
import type { ReviewStatus } from './review';
import type { UserAuthProvider, UserRole } from './user';

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type ProductDto = {
  _id: string;
  slug: string;
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
  images: ProductImage[];
  reviewsCount: number;
  variants: ProductVariant[];
  totalQuantity: number;
};

export type ReviewDto = {
  _id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  text: string;
  verifiedPurchase: boolean;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
};

export type ReviewSummaryDto = {
  count: number;
  averageRating: number;
};

export type UserDto = {
  _id: string;
  authProviders: UserAuthProvider[];
  avatarUrl?: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
};

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductsResponse = ApiSuccess<{
  products: ProductDto[];
  pagination: PaginationData;
}>;

export type ProductResponse = ApiSuccess<{
  product: ProductDto;
  relatedProducts: ProductDto[];
}>;

export type ProductReviewsResponse = ApiSuccess<{
  reviews: ReviewDto[];
  summary: ReviewSummaryDto;
  pagination: PaginationData;
}>;

export type FavoritesResponse = ApiSuccess<{
  products: ProductDto[];
}>;

export type AddFavoriteResponse = ApiSuccess<{
  product: ProductDto;
}>;

export type RemoveFavoriteResponse = ApiSuccess<{
  productId: string;
}>;

export type CartValidationRemovedItemReason =
  | 'product-not-found'
  | 'variant-not-found'
  | 'out-of-stock';

export type CartValidationUpdatedItemReason = 'quantity-reduced';

export type CartValidationItemDto = {
  productId: string;
  productSlug: string;
  variantId: string;
  sku: string;
  title: string;
  image: string;
  color: string;
  size: ProductSize;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  maxQuantity: number;
};

export type CartValidationRemovedItemDto = {
  productId: string;
  variantId: string;
  reason: CartValidationRemovedItemReason;
};

export type CartValidationUpdatedItemDto = {
  productId: string;
  variantId: string;
  reason: CartValidationUpdatedItemReason;
  previousQuantity: number;
  nextQuantity: number;
};

export type CartValidationResponse = ApiSuccess<{
  items: CartValidationItemDto[];
  removedItems: CartValidationRemovedItemDto[];
  updatedItems: CartValidationUpdatedItemDto[];
}>;

export type AuthResponse = ApiSuccess<{
  user: UserDto;
  accessToken: string;
}>;

export type AuthBootstrapResponse = ApiSuccess<
  | {
      isAuthenticated: true;
      user: UserDto;
      accessToken: string;
    }
  | {
      isAuthenticated: false;
      user: null;
      accessToken: null;
    }
>;

export type CurrentUserResponse = ApiSuccess<{
  user: UserDto;
}>;

export type EmailVerificationResponse = ApiSuccess<{
  user: UserDto;
}>;

export type PasswordResetResponse = ApiSuccess<null>;

export type LogoutResponse = ApiSuccess<null>;
