import type { ProductSize, ProductVariant } from './product-variant';
import type { ProductAudience } from './product-audience';
import type { ProductImage } from './product-image';
import type {
  OrderItemSnapshot,
  OrderPaymentStatus,
  OrderShippingAddress,
  OrderStatus,
  OrderStatusHistoryItem,
} from './order';
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
  editedAt: string | null;
  updatedAt: string;
};

export type ReviewSummaryDto = {
  count: number;
  averageRating: number;
};

export type ReviewProductDto = {
  _id: string;
  img: string;
  slug: string;
  title: string;
};

export type UserReviewDto = ReviewDto & {
  product: ReviewProductDto | null;
};

export type OrderDto = {
  _id: string;
  contactEmail: string;
  createdAt: string;
  discountTotal: number;
  items: OrderItemSnapshot[];
  paymentStatus: OrderPaymentStatus;
  shippingAddress: OrderShippingAddress;
  status: OrderStatus;
  subtotal: number;
  trackingNumber?: string;
  total: number;
  updatedAt: string;
  userId: string;
};

export type OrderStatusHistoryDto = Omit<
  OrderStatusHistoryItem,
  'changedAt'
> & {
  changedAt: string;
};

export type AdminOrderListItemDto = {
  _id: string;
  contactEmail: string;
  createdAt: string;
  customerName: string;
  itemsCount: number;
  orderNumber: string;
  paymentStatus: OrderPaymentStatus;
  status: OrderStatus;
  total: number;
  trackingNumber?: string;
  updatedAt: string;
};

export type AdminOrderDto = OrderDto & {
  adminNote?: string;
  customerName: string;
  itemsCount: number;
  orderNumber: string;
  statusHistory: OrderStatusHistoryDto[];
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

export type AdminOrdersResponse = ApiSuccess<{
  orders: AdminOrderListItemDto[];
  pagination: PaginationData;
}>;

export type AdminOrderResponse = ApiSuccess<{
  order: AdminOrderDto;
}>;

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

export type CreateProductReviewResponse = ApiSuccess<{
  review: ReviewDto;
}>;

export type UpdateReviewResponse = ApiSuccess<{
  review: ReviewDto;
}>;

export type DeleteReviewResponse = ApiSuccess<{
  productId: string;
  reviewId: string;
}>;

export type ProductReviewStatusResponse = ApiSuccess<{
  hasReviewed: boolean;
  review: ReviewDto | null;
}>;

export type UserReviewsResponse = ApiSuccess<{
  reviews: UserReviewDto[];
  pagination: PaginationData;
}>;

export type OrdersResponse = ApiSuccess<{
  orders: OrderDto[];
  pagination: PaginationData;
}>;

export type OrderResponse = ApiSuccess<{
  order: OrderDto;
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

export type AdminMeResponse = ApiSuccess<{
  user: UserDto;
}>;

export type EmailVerificationResponse = ApiSuccess<{
  user: UserDto;
}>;

export type PasswordResetResponse = ApiSuccess<null>;

export type LogoutResponse = ApiSuccess<null>;
