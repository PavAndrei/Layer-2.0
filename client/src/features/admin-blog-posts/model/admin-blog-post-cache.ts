import type { QueryClient } from '@tanstack/react-query';

import type { ApiResponse } from '../../../shared/api';
import type {
  AdminBlogPostResponseData,
  DeleteAdminBlogPostResponseData,
} from '../api';
import { adminBlogPostsQueryKeys } from './admin-blog-posts-query-keys';

export const syncAdminBlogPostQueries = (
  queryClient: QueryClient,
  blogPostId: string,
  response: ApiResponse<AdminBlogPostResponseData>,
) => {
  queryClient.setQueryData<ApiResponse<AdminBlogPostResponseData>>(
    adminBlogPostsQueryKeys.detail(blogPostId),
    response,
  );
  queryClient.invalidateQueries({
    queryKey: adminBlogPostsQueryKeys.lists(),
  });
};

export const syncDeletedAdminBlogPostQueries = (
  queryClient: QueryClient,
  response: ApiResponse<DeleteAdminBlogPostResponseData>,
) => {
  if (!response.success) return;

  queryClient.removeQueries({
    queryKey: adminBlogPostsQueryKeys.detail(response.data.blogPostId),
  });
  queryClient.invalidateQueries({
    queryKey: adminBlogPostsQueryKeys.lists(),
  });
};
