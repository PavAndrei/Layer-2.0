import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  deleteBlogPostComment,
  type DeleteBlogPostCommentParams,
} from '../api';
import { syncUpdatedBlogPostCommentQueries } from './blog-post-comments-cache';

export const useDeleteBlogPostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: DeleteBlogPostCommentParams) => {
      const response = await deleteBlogPostComment(params);

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
        {
          decrementCommentsCount: true,
        },
      );
    },
  });
};
