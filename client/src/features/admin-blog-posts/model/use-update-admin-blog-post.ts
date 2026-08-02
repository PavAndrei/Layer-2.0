import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminBlogPost } from '../api';
import { syncAdminBlogPostQueries } from './admin-blog-post-cache';

export const useUpdateAdminBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminBlogPost,
    onSuccess: (response, variables) => {
      if (!response.success) return;

      syncAdminBlogPostQueries(queryClient, variables.blogPostId, response);
    },
  });
};
