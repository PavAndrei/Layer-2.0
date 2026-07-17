import { useEffect, useState } from 'react';

import type { ProductReview } from '../../../entities/review';
import { useProductReviews } from './use-product-reviews';

type UseProductReviewsAccordionParams = {
  productId: string;
  reviewsCount: number;
};

const REVIEWS_LIMIT = 5;

const formatReviewsCount = (count: number) =>
  `${count} ${count === 1 ? 'review' : 'reviews'}`;

export const useProductReviewsAccordion = ({
  productId,
  reviewsCount,
}: UseProductReviewsAccordionParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loadedReviews, setLoadedReviews] = useState<ProductReview[]>([]);
  const { reviews, pagination, isLoading, isFetching, error, refetch } =
    useProductReviews({
      productId,
      isEnabled: isOpen,
      limit: REVIEWS_LIMIT,
      page,
    });
  const isInitialLoading = isLoading && loadedReviews.length === 0;
  const isEmpty = !isInitialLoading && loadedReviews.length === 0;
  const hasMoreReviews = pagination.page < pagination.totalPages;
  const totalReviews = pagination.total || reviewsCount;

  useEffect(() => {
    setPage(1);
    setLoadedReviews([]);
  }, [productId]);

  useEffect(() => {
    if (reviews.length === 0) return;

    setLoadedReviews((currentReviews) => {
      if (page === 1) return reviews;

      const reviewIds = new Set(currentReviews.map((review) => review._id));
      const nextReviews = reviews.filter((review) => !reviewIds.has(review._id));

      return [...currentReviews, ...nextReviews];
    });
  }, [page, reviews]);

  const resetReviews = () => {
    setPage(1);
    setLoadedReviews([]);
  };

  return {
    error,
    hasMoreReviews,
    isEmpty,
    isFetching,
    isInitialLoading,
    isOpen,
    loadedReviews,
    refetch,
    resetReviews,
    reviewsCountLabel: formatReviewsCount(reviewsCount),
    toggleReviews: () => setIsOpen((currentValue) => !currentValue),
    loadMoreReviews: () => setPage((currentPage) => currentPage + 1),
    totalReviews,
  };
};
