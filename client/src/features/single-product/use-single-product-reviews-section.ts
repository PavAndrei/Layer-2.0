import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  reviewQueryKeys,
  type ProductReview,
} from '../../entities/review';
import {
  useCreateProductReview,
  useProductReviews,
  useProductReviewStatus,
} from '../reviews';
import { singleProductQueryKeys, useProductReviewForm } from './model';
import { useSingleProductReviewActions } from './use-single-product-review-actions';

type UseSingleProductReviewsSectionParams = {
  canManageReviews: boolean;
  isAuthenticated: boolean;
  productId: string;
  productIdentifier?: string;
  reviewsCount: number;
};

const REVIEWS_LIMIT = 5;

const formatReviewsCount = (count: number) =>
  `${count} ${count === 1 ? 'review' : 'reviews'}`;

export const useSingleProductReviewsSection = ({
  canManageReviews,
  isAuthenticated,
  productId,
  productIdentifier,
  reviewsCount,
}: UseSingleProductReviewsSectionParams) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loadedReviews, setLoadedReviews] = useState<ProductReview[]>([]);
  const reviewsQuery = useProductReviews({
    isEnabled: isOpen,
    limit: REVIEWS_LIMIT,
    page,
    productId,
  });
  const reviewStatus = useProductReviewStatus({
    isEnabled: isAuthenticated && isOpen,
    productId,
  });
  const createReviewMutation = useCreateProductReview({
    productId,
  });
  const isInitialLoading =
    reviewsQuery.isLoading && loadedReviews.length === 0;
  const isEmpty = !isInitialLoading && loadedReviews.length === 0;
  const hasMoreReviews =
    reviewsQuery.pagination.page < reviewsQuery.pagination.totalPages;
  const totalReviews = reviewsQuery.isFetched
    ? reviewsQuery.pagination.total
    : reviewsCount;

  useEffect(() => {
    setPage(1);
    setLoadedReviews([]);
  }, [productId]);

  useEffect(() => {
    setLoadedReviews((currentReviews) => {
      if (page === 1) return reviewsQuery.reviews;
      if (reviewsQuery.reviews.length === 0) return currentReviews;

      const reviewIds = new Set(currentReviews.map((review) => review._id));
      const nextReviews = reviewsQuery.reviews.filter(
        (review) => !reviewIds.has(review._id),
      );

      return [...currentReviews, ...nextReviews];
    });
  }, [page, reviewsQuery.reviews]);

  const resetReviews = () => {
    setPage(1);
    setLoadedReviews([]);
  };

  const reviewForm = useProductReviewForm({
    isSubmitting: createReviewMutation.isPending,
    onCreateReview: async (review) => {
      const response = await createReviewMutation.mutateAsync(review);

      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: productIdentifier
            ? singleProductQueryKeys.detail(productIdentifier)
            : singleProductQueryKeys.all,
        });
      }

      return {
        message: response.message,
        success: response.success,
      };
    },
    onCreated: resetReviews,
    productId,
  });
  const reviewActions = useSingleProductReviewActions({
    canManageReviews,
    onReviewDeleted: ({ isCurrentUserReview }) => {
      if (isCurrentUserReview) {
        reviewForm.resetForm();
        queryClient.setQueryData(
          reviewQueryKeys.productReviewStatus(productId),
          {
            hasReviewed: false,
            review: null,
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: productIdentifier
          ? singleProductQueryKeys.detail(productIdentifier)
          : singleProductQueryKeys.all,
      });
    },
  });

  return {
    deleteReviewError: reviewActions.deleteReviewError,
    deleteReviewDialog: reviewActions.deleteReviewDialog,
    error: reviewsQuery.error,
    fieldErrors: reviewForm.fieldErrors,
    hasMoreReviews,
    isEmpty,
    isFetching: reviewsQuery.isFetching,
    isFormCreated: reviewForm.isCreated,
    isFormSubmitting: reviewForm.isSubmitting,
    isInitialLoading,
    isOpen,
    isReviewStatusFetching: reviewStatus.isFetching,
    isReviewStatusLoading: reviewStatus.isLoading,
    loadedReviews,
    loadMoreReviews: () => setPage((currentPage) => currentPage + 1),
    refetchReviewStatus: reviewStatus.refetch,
    refetchReviews: reviewsQuery.refetch,
    renderReviewActions: reviewActions.renderReviewActions,
    resetReviews,
    reviewFormError: reviewForm.error,
    reviewStatusError: reviewStatus.error,
    reviewStatusHasReviewed: reviewStatus.hasReviewed,
    reviewStatusReviewId: reviewStatus.review?._id ?? null,
    reviewsCountLabel: formatReviewsCount(totalReviews),
    totalReviews,
    toggleReviews: () => setIsOpen((currentValue) => !currentValue),
    updateReviewField: reviewForm.updateField,
    values: reviewForm.values,
    submitReview: reviewForm.handleSubmit,
  };
};
