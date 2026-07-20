import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminReview } from '../api';
import { syncUpdatedAdminReviewQueries } from './admin-review-cache';

export const useUpdateAdminReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminReview,
    onSuccess: (response, variables) => {
      syncUpdatedAdminReviewQueries(
        queryClient,
        variables.reviewId,
        response,
      );
    },
  });
};
