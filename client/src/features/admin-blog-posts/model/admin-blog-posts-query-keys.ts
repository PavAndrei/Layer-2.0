export const adminBlogPostsQueryKeys = {
  all: ['admin-blog-posts'] as const,
  details: () => [...adminBlogPostsQueryKeys.all, 'detail'] as const,
  detail: (blogPostId: string) =>
    [...adminBlogPostsQueryKeys.details(), blogPostId] as const,
  lists: () => [...adminBlogPostsQueryKeys.all, 'list'] as const,
  list: (params = '') =>
    [...adminBlogPostsQueryKeys.lists(), params] as const,
};
