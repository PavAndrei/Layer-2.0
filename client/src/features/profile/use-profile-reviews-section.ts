import type { UserReview } from '../../entities/review';
import {
  useDeleteReviewAction,
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
  const reviewDeleteAction = useDeleteReviewAction();
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

  return {
    deleteReviewError: reviewDeleteAction.deleteReviewError,
    deletingReviewId: reviewDeleteAction.deletingReviewId,
    onDeleteReview: handleDeleteReview,
    onPageChange,
    reviewsQuery,
  };
};

export type ProfileReviewsSectionState = ReturnType<
  typeof useProfileReviewsSection
>;
