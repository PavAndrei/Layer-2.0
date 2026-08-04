export const BLOG_POSTS_STALE_TIME_MS = 1000 * 60 * 2;

export const blogPostsQueryKeys = {
  all: ['blog-posts'] as const,
  comments: (slug: string) =>
    [...blogPostsQueryKeys.detail(slug), 'comments'] as const,
  commentsList: (slug: string, params = '') =>
    [...blogPostsQueryKeys.comments(slug), params] as const,
  details: () => [...blogPostsQueryKeys.all, 'detail'] as const,
  detail: (slug: string) =>
    [...blogPostsQueryKeys.details(), slug] as const,
  lists: () => [...blogPostsQueryKeys.all, 'list'] as const,
  list: (params = '') =>
    [...blogPostsQueryKeys.lists(), params] as const,
};
