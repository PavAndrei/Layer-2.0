import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
  UploadedMediaAsset,
} from '../../../shared/api';
import type {
  BlogPostContentJson,
  BlogPostCoverImage,
  BlogPostStatus,
} from '../../../entities/blog';
import type { ProductStatus } from '../../../entities/product';

export type AdminBlogPostSortOption =
  | 'default'
  | 'published-asc'
  | 'published-desc'
  | 'title-asc'
  | 'title-desc'
  | 'updated-asc'
  | 'updated-desc';

export type AdminBlogPostsParams = {
  limit?: number;
  page?: number;
  search?: string;
  sort?: AdminBlogPostSortOption;
  status?: BlogPostStatus;
};

export type AdminBlogRelatedProductsParams = {
  limit?: number;
  page?: number;
  search?: string;
  status?: ProductStatus;
};

export type AdminBlogRelatedProductOption = {
  _id: string;
  defaultPrice: number;
  discountPrice: number;
  hasDiscount: boolean;
  img: string;
  slug: string;
  status: ProductStatus;
  title: string;
  totalStock: number;
};

export type AdminBlogPostListItem = {
  _id: string;
  authorId: string;
  coverImage?: BlogPostCoverImage;
  excerpt: string;
  publishedAt: string | null;
  slug: string;
  status: BlogPostStatus;
  title: string;
  updatedAt: string;
};

export type AdminBlogPost = AdminBlogPostListItem & {
  contentHtml: string;
  contentJson: BlogPostContentJson;
  createdAt: string;
  relatedProductIds: string[];
};

export type AdminBlogPostsStats = {
  archived: number;
  draft: number;
  published: number;
  total: number;
};

export type AdminBlogPostsResponseData = {
  blogPosts: AdminBlogPostListItem[];
  pagination: PaginationData;
  stats: AdminBlogPostsStats;
};

export type AdminBlogRelatedProductsResponseData = {
  pagination: PaginationData;
  products: AdminBlogRelatedProductOption[];
};

export type AdminBlogRelatedProductResponseData = {
  product: AdminBlogRelatedProductOption;
};

export type CreateAdminBlogPostPayload = {
  contentHtml?: string;
  contentJson?: BlogPostContentJson;
  coverImage?: BlogPostCoverImage | null;
  excerpt?: string;
  relatedProductIds?: string[];
  slug?: string;
  status?: BlogPostStatus;
  title: string;
};

export type UpdateAdminBlogPostPayload = CreateAdminBlogPostPayload;

export type UpdateAdminBlogPostStatusPayload = {
  status: BlogPostStatus;
};

export type CreateAdminBlogPostResponseData = {
  blogPost: AdminBlogPostListItem;
};

export type AdminBlogPostResponseData = {
  blogPost: AdminBlogPost;
};

export type UpdateAdminBlogPostResponseData = AdminBlogPostResponseData;

export type UpdateAdminBlogPostStatusResponseData = AdminBlogPostResponseData;

export type DeleteAdminBlogPostResponseData = {
  blogPostId: string;
  slug: string;
  title: string;
};

export const getBlogCoverAsset = (
  coverImage?: BlogPostCoverImage | null,
): UploadedMediaAsset | null => {
  if (!coverImage?.src) return null;

  return {
    fileId: coverImage.fileId ?? '',
    filePath: coverImage.filePath ?? coverImage.src,
    fileType: 'image',
    name: coverImage.alt,
    size: 0,
    url: coverImage.src,
  };
};

export const getAdminBlogPosts = async (
  params: AdminBlogPostsParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<AdminBlogPostsResponseData>> => {
  return apiClient.get<AdminBlogPostsResponseData>({
    path: '/admin/blog-posts',
    params,
    signal,
    errorMessage: 'Failed to load admin blog posts',
  });
};

export const getAdminBlogRelatedProducts = async (
  params: AdminBlogRelatedProductsParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<AdminBlogRelatedProductsResponseData>> => {
  return apiClient.get<AdminBlogRelatedProductsResponseData>({
    path: '/admin/products',
    params,
    signal,
    errorMessage: 'Failed to load related product options',
  });
};

export const getAdminBlogRelatedProduct = async (
  productId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<AdminBlogRelatedProductResponseData>> => {
  return apiClient.get<AdminBlogRelatedProductResponseData>({
    path: `/admin/products/${encodeURIComponent(productId)}`,
    signal,
    errorMessage: 'Failed to load related product',
  });
};

export const getAdminBlogPost = async (
  blogPostId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<AdminBlogPostResponseData>> => {
  return apiClient.get<AdminBlogPostResponseData>({
    path: `/admin/blog-posts/${encodeURIComponent(blogPostId)}`,
    signal,
    errorMessage: 'Failed to load admin blog post',
  });
};

export const createAdminBlogPost = async (
  payload: CreateAdminBlogPostPayload,
): Promise<ApiResponse<CreateAdminBlogPostResponseData>> => {
  return apiClient.post<
    CreateAdminBlogPostResponseData,
    CreateAdminBlogPostPayload
  >({
    path: '/admin/blog-posts',
    body: payload,
    errorMessage: 'Failed to create admin blog post',
  });
};

export const updateAdminBlogPost = async ({
  blogPostId,
  payload,
}: {
  blogPostId: string;
  payload: UpdateAdminBlogPostPayload;
}): Promise<ApiResponse<UpdateAdminBlogPostResponseData>> => {
  return apiClient.patch<
    UpdateAdminBlogPostResponseData,
    UpdateAdminBlogPostPayload
  >({
    path: `/admin/blog-posts/${encodeURIComponent(blogPostId)}`,
    body: payload,
    errorMessage: 'Failed to update admin blog post',
  });
};

export const updateAdminBlogPostStatus = async ({
  blogPostId,
  payload,
}: {
  blogPostId: string;
  payload: UpdateAdminBlogPostStatusPayload;
}): Promise<ApiResponse<UpdateAdminBlogPostStatusResponseData>> => {
  return apiClient.patch<
    UpdateAdminBlogPostStatusResponseData,
    UpdateAdminBlogPostStatusPayload
  >({
    path: `/admin/blog-posts/${encodeURIComponent(blogPostId)}/status`,
    body: payload,
    errorMessage: 'Failed to update admin blog post status',
  });
};

export const deleteAdminBlogPost = async (
  blogPostId: string,
): Promise<ApiResponse<DeleteAdminBlogPostResponseData>> => {
  return apiClient.delete<DeleteAdminBlogPostResponseData>({
    path: `/admin/blog-posts/${encodeURIComponent(blogPostId)}`,
    errorMessage: 'Failed to delete admin blog post',
  });
};
