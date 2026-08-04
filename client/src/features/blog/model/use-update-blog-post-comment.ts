import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateBlogPostComment,
  type UpdateBlogPostCommentParams,
} from '../api';
import { syncUpdatedBlogPostCommentQueries } from './blog-post-comments-cache';

export const useUpdateBlogPostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateBlogPostCommentParams) => {
      const response = await updateBlogPostComment(params);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (response, variables) => {
      syncUpdatedBlogPostCommentQueries(
        queryClient,
        variables.slug,
        response.data.comment,
      );
    },
  });
};
