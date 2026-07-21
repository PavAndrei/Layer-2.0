export const REVIEW_STATUSES = ['approved', 'pending', 'rejected'] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export type ProductReview = {
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

export type ProductReviewsSummary = {
  count: number;
  averageRating: number;
};

export type CreateProductReviewData = {
  rating: number;
  text: string;
  title: string;
};

export type UpdateReviewData = Partial<CreateProductReviewData>;

export type ProductReviewStatus = {
  hasReviewed: boolean;
  review: ProductReview | null;
};

export type ReviewProduct = {
  _id: string;
  img: string;
  slug: string;
  title: string;
};

export type UserReview = ProductReview & {
  product: ReviewProduct | null;
};

export type AdminReview = ProductReview & {
  authorId?: string;
  authorEmail?: string;
  moderationReason?: string;
  moderatedAt: string | null;
  moderatedBy?: string;
  moderatedByEmail?: string;
  moderatedByName?: string;
  product: ReviewProduct | null;
};

export type AdminReviewListItem = AdminReview;

export type AdminUserRecentReview = {
  _id: string;
  createdAt: string;
  product: ReviewProduct | null;
  rating: number;
  status: ReviewStatus;
  text: string;
  title: string;
};

export type UpdateAdminReviewData = {
  moderationReason?: string;
  status?: ReviewStatus;
};
