import type {
  BlogPostContentJson,
  BlogPostStatus,
} from '../api';

export type AdminBlogPostCoverImageFormValues = {
  alt: string;
  fileId: string;
  filePath: string;
  src: string;
};

export type AdminBlogPostFormValues = {
  contentHtml: string;
  contentJson: BlogPostContentJson;
  coverImage: AdminBlogPostCoverImageFormValues | null;
  excerpt: string;
  slug: string;
  status: BlogPostStatus;
  title: string;
};

export type AdminBlogPostFormErrors = Partial<
  Record<keyof AdminBlogPostFormValues, string>
>;
