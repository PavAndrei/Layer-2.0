export const BLOG_POST_STATUSES = [
  'draft',
  'published',
  'archived',
] as const;

export type BlogPostStatus = (typeof BLOG_POST_STATUSES)[number];

export type BlogPostCoverImage = {
  alt: string;
  fileId?: string;
  filePath?: string;
  src: string;
};

export type BlogPostContentJson = Record<string, unknown>;
