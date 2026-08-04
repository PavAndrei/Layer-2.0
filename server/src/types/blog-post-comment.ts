export const BLOG_POST_COMMENT_STATUSES = [
  'published',
  'deleted',
] as const;

export type BlogPostCommentStatus =
  (typeof BLOG_POST_COMMENT_STATUSES)[number];
