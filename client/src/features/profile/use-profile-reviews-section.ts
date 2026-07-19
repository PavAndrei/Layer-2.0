import { useState } from 'react';

import type { UserReview } from '../../entities/review';
import type { ReviewFormValues } from '../../entities/review';
import {
  useDeleteReviewAction,
  useUpdateReviewAction,
  useUserReviews,
} from '../reviews';
import {
  PROFILE_REVIEWS_PAGE_LIMIT,
  type ProfileSection,
} from './model';

type UseProfileReviewsSectionParams = {
  activeReviewsPage: number;
  activeSection: ProfileSection;
  onPageChange: (page: number) => void;
};

export const useProfileReviewsSection = ({
  activeReviewsPage,
  activeSection,
  onPageChange,
}: UseProfileReviewsSectionParams) => {
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const reviewDeleteAction = useDeleteReviewAction();
  const reviewUpdateAction = useUpdateReviewAction();
  const reviewsQuery = useUserReviews({
    enabled: activeSection === 'reviews',
    params: {
      limit: PROFILE_REVIEWS_PAGE_LIMIT,
      page: activeReviewsPage,
    },
  });

  const handleDeleteReview = (review: UserReview) => {
    reviewDeleteAction.deleteReview(review._id);
  };

  const handleUpdateReview = (
    review: UserReview,
    values: ReviewFormValues,
  ) => {
    return reviewUpdateAction.updateReview(review._id, values, {
      onUpdated: () => setEditingReviewId(null),
    });
  };

  return {
    deleteReviewError: reviewDeleteAction.deleteReviewError,
    deleteReviewDialog: reviewDeleteAction.deleteReviewDialog,
    deletingReviewId: reviewDeleteAction.deletingReviewId,
    editingReviewId,
    onCancelEditReview: () => setEditingReviewId(null),
    onDeleteReview: handleDeleteReview,
    onEditReview: (review: UserReview) => setEditingReviewId(review._id),
    onPageChange,
    onUpdateReview: handleUpdateReview,
    reviewsQuery,
    updateReviewError: reviewUpdateAction.updateReviewError,
    updatingReviewId: reviewUpdateAction.updatingReviewId,
  };
};

export type ProfileReviewsSectionState = ReturnType<
  typeof useProfileReviewsSection
>;
