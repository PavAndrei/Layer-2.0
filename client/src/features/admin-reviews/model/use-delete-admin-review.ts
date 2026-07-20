import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteAdminReview } from '../api';
import { syncDeletedAdminReviewQueries } from './admin-review-cache';

export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminReview,
    onSuccess: (response, reviewId) => {
      syncDeletedAdminReviewQueries(queryClient, reviewId, response);
    },
  });
};
