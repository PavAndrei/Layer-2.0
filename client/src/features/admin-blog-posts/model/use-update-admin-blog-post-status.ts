import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminBlogPostStatus } from '../api';
import { syncAdminBlogPostQueries } from './admin-blog-post-cache';

export const useUpdateAdminBlogPostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminBlogPostStatus,
    onSuccess: (response, variables) => {
      if (!response.success) return;

      syncAdminBlogPostQueries(queryClient, variables.blogPostId, response);
    },
  });
};
