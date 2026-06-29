export type ReviewStatus = 'approved' | 'pending' | 'rejected';

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
  updatedAt: string;
};

export type ProductReviewsSummary = {
  count: number;
  averageRating: number;
};
