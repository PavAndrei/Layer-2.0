import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAdminBlogPost } from '../api';
import { adminBlogPostsQueryKeys } from './admin-blog-posts-query-keys';

export const useCreateAdminBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminBlogPost,
    onSuccess: (response) => {
      if (!response.success) return;

      queryClient.invalidateQueries({
        queryKey: adminBlogPostsQueryKeys.lists(),
      });
    },
  });
};
