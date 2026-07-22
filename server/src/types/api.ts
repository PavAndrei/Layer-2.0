import type { ProductSize, ProductVariant } from './product-variant';
import type { ProductAudience } from './product-audience';
import type { ProductImage } from './product-image';
import type { AdminDashboardPeriod } from './admin-dashboard';
import type { StoreShippingRegion } from './store-settings';
import type {
  OrderItemSnapshot,
  OrderPaymentStatus,
  OrderShippingAddress,
  OrderShippingSnapshot,
  OrderStatus,
  OrderStatusHistoryItem,
} from './order';
import type { ReviewStatus } from './review';
import type { UserAuthProvider, UserRole, UserStatus } from './user';

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

export type AdminReviewDto = ReviewDto & {
  authorId?: string;
  authorEmail?: string;
  moderationReason?: string;
  moderatedAt: string | null;
  moderatedBy?: string;
  moderatedByEmail?: string;
  moderatedByName?: string;
  product: ReviewProductDto | null;
};

export type AdminReviewListItemDto = AdminReviewDto;

export type OrderDto = {
  _id: string;
  contactEmail: string;
  createdAt: string;
  discountTotal: number;
  items: OrderItemSnapshot[];
  paymentStatus: OrderPaymentStatus;
  shippingAddress: OrderShippingAddress;
  shippingSnapshot?: OrderShippingSnapshot;
  shippingTotal: number;
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
  changedByEmail?: string;
  changedByName?: string;
};

export type AdminOrderListItemDto = {
  _id: string;
  contactEmail: string;
  createdAt: string;
  customerName: string;
  hasShippingSnapshot: boolean;
  itemsCount: number;
  orderNumber: string;
  paymentStatus: OrderPaymentStatus;
  shippingTotal: number;
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
  isBlocked: boolean;
};

export type AdminUserListItemDto = UserDto & {
  adminNote?: string;
  createdAt: string;
  ordersCount: number;
  status: UserStatus;
  totalSpent: number;
  updatedAt: string;
};

export type AdminUserStatsDto = {
  activeSessionsCount: number;
  lastOrderAt: string | null;
  reviewsCount: number;
  totalSpent: number;
};

export type AdminUserRecentOrderDto = {
  _id: string;
  createdAt: string;
  hasShippingSnapshot: boolean;
  orderNumber: string;
  paymentStatus: OrderPaymentStatus;
  shippingTotal: number;
  status: OrderStatus;
  total: number;
};

export type AdminUserRecentReviewDto = {
  _id: string;
  createdAt: string;
  product: ReviewProductDto | null;
  rating: number;
  status: ReviewStatus;
  text: string;
  title: string;
};

export type AdminUserDto = UserDto & {
  adminNote?: string;
  createdAt: string;
  lastLoginAt: string | null;
  recentOrders: AdminUserRecentOrderDto[];
  recentReviews: AdminUserRecentReviewDto[];
  stats: AdminUserStatsDto;
  status: UserStatus;
  updatedAt: string;
};

export type AdminDashboardSummaryDto = {
  averageOrderValue: number;
  newCustomers: number;
  orders: number;
  revenue: number;
};

export type AdminDashboardRevenuePointDto = {
  date: string;
  revenue: number;
};

export type AdminDashboardOrderStatusItemDto = {
  count: number;
  status: OrderStatus;
};

export type AdminDashboardDto = {
  orderStatusDistribution: AdminDashboardOrderStatusItemDto[];
  period: AdminDashboardPeriod;
  recentOrders: AdminOrderListItemDto[];
  recentReviews: AdminReviewListItemDto[];
  recentUsers: AdminUserListItemDto[];
  revenueSeries: AdminDashboardRevenuePointDto[];
  summary: AdminDashboardSummaryDto;
};

export type StoreGeneralSettingsDto = {
  address?: string;
  storeName: string;
  supportEmail: string;
  supportPhone?: string;
};

export type StoreShippingSettingsDto = {
  estimatedDeliveryDaysMax: number;
  estimatedDeliveryDaysMin: number;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number | null;
  shippingNotice?: string;
  shippingRegion: StoreShippingRegion;
  standardShippingPrice: number;
};

export type StoreOrderSettingsDto = {
  ordersEnabled: boolean;
  requireVerifiedEmailForCheckout: boolean;
};

export type StoreSettingsDto = {
  _id: string;
  createdAt: string;
  general: StoreGeneralSettingsDto;
  orders: StoreOrderSettingsDto;
  shipping: StoreShippingSettingsDto;
  updatedAt: string;
};

export type AdminStoreSettingsDto = StoreSettingsDto;

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

export type AdminReviewsResponse = ApiSuccess<{
  reviews: AdminReviewListItemDto[];
  pagination: PaginationData;
}>;

export type AdminUsersResponse = ApiSuccess<{
  users: AdminUserListItemDto[];
  pagination: PaginationData;
}>;

export type AdminUserResponse = ApiSuccess<{
  user: AdminUserDto;
}>;

export type AdminDashboardResponse = ApiSuccess<{
  dashboard: AdminDashboardDto;
}>;

export type AdminStoreSettingsResponse = ApiSuccess<{
  settings: AdminStoreSettingsDto;
}>;

export type StoreSettingsResponse = ApiSuccess<{
  settings: StoreSettingsDto;
}>;

export type AdminReviewResponse = ApiSuccess<{
  review: AdminReviewDto;
}>;

export type UpdateAdminReviewResponse = ApiSuccess<{
  review: AdminReviewDto;
}>;

export type DeleteAdminReviewResponse = ApiSuccess<{
  productId: string;
  reviewId: string;
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
