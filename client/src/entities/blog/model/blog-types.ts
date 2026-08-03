import type { Product } from '../../product';

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

export type BlogPostListItem = {
  _id: string;
  coverImage?: BlogPostCoverImage;
  excerpt: string;
  publishedAt: string | null;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
  likesCount: number;
  viewsCount: number;
};

export type BlogPost = BlogPostListItem & {
  contentHtml: string;
  isLikedByViewer: boolean;
  relatedProducts: Product[];
};
