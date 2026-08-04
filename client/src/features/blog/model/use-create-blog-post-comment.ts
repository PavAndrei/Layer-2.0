import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createBlogPostComment,
  type CreateBlogPostCommentParams,
} from '../api';
import { syncCreatedBlogPostCommentQueries } from './blog-post-comments-cache';

export const useCreateBlogPostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateBlogPostCommentParams) => {
      const response = await createBlogPostComment(params);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (response, variables) => {
      syncCreatedBlogPostCommentQueries(
        queryClient,
        variables.slug,
        response.data.comment,
      );
    },
  });
};
