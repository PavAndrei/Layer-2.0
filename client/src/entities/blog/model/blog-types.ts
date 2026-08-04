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

export const BLOG_POST_COMMENT_STATUSES = [
  'published',
  'deleted',
] as const;

export type BlogPostCommentStatus =
  (typeof BLOG_POST_COMMENT_STATUSES)[number];

export type BlogPostCommentAuthor = {
  _id: string;
  avatarUrl?: string;
  name: string;
};

export type BlogPostComment = {
  _id: string;
  author: BlogPostCommentAuthor;
  blogPostId: string;
  createdAt: string;
  deletedAt: string | null;
  editedAt: string | null;
  parentCommentId: string | null;
  replies: BlogPostComment[];
  status: BlogPostCommentStatus;
  text: string;
  updatedAt: string;
};

export type BlogPostListItem = {
  _id: string;
  commentsCount: number;
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
