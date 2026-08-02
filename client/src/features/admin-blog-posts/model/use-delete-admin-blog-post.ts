import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  deleteAdminBlogPost,
  type DeleteAdminBlogPostResponseData,
} from '../api';
import { syncDeletedAdminBlogPostQueries } from './admin-blog-post-cache';

type UseDeleteAdminBlogPostOptions = {
  onDeleted?: (data: DeleteAdminBlogPostResponseData) => void;
};

export const useDeleteAdminBlogPost = (
  options: UseDeleteAdminBlogPostOptions = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminBlogPost,
    onSuccess: (response) => {
      if (!response.success) return;

      syncDeletedAdminBlogPostQueries(queryClient, response);
      options.onDeleted?.(response.data);
    },
  });
};
