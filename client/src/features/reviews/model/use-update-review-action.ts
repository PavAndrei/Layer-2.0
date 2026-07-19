import type {
  ReviewFormValues,
  UserReview,
} from '../../../entities/review';
import { useUpdateUserReview } from './use-update-user-review';

type UpdateReviewOptions = {
  onUpdated?: () => void;
};

export const useUpdateReviewAction = () => {
  const updateReviewMutation = useUpdateUserReview();

  const updateReview = async (
    reviewId: string,
    review: ReviewFormValues,
    options: UpdateReviewOptions = {},
  ) => {
    const response = await updateReviewMutation.mutateAsync({
      review,
      reviewId,
    });

    if (response.success) {
      options.onUpdated?.();
    }

    return {
      message: response.message,
      success: response.success,
    };
  };

  const getUpdateReviewError = () => {
    if (updateReviewMutation.data && !updateReviewMutation.data.success) {
      return updateReviewMutation.data.message;
    }

    if (updateReviewMutation.error) {
      return updateReviewMutation.error instanceof Error
        ? updateReviewMutation.error.message
        : 'Failed to update review';
    }

    return null;
  };

  const updatingReviewId = updateReviewMutation.isPending
    ? updateReviewMutation.variables.reviewId
    : null;

  return {
    isUpdatingReview: (reviewId: string) => updatingReviewId === reviewId,
    updateReview,
    updateReviewError: getUpdateReviewError(),
    updatingReviewId,
  };
};

export type EditableReview = Pick<
  UserReview,
  '_id' | 'rating' | 'text' | 'title'
>;
