import { QueryFilter } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { BlogPost, type BlogPostData } from '../models/blog-posts.model';
import type {
  AdminBlogPostResponse,
  AdminBlogPostsResponse,
  CreateAdminBlogPostResponse,
  DeleteAdminBlogPostResponse,
  UpdateAdminBlogPostResponse,
  UpdateAdminBlogPostStatusResponse,
} from '../types/api';
import type { BlogPostStatus } from '../types/blog-post';
import {
  adminBlogPostToDto,
  adminBlogPostToListItemDto,
} from '../utils/admin-blog-post-to-dto';
import { createProductSlug } from '../utils/create-product-slug';
import type {
  AdminBlogPostsQuery,
  CreateAdminBlogPostBody,
  UpdateAdminBlogPostBody,
  UpdateAdminBlogPostStatusBody,
} from '../validators/admin-blog-posts.validators';
import { createAuditLog } from './audit-logs.service';
import {
  attachMediaAssets,
  deleteImageKitFile,
  markMediaAssetsDeleted,
} from './media.service';

type BlogPostStatsAggregateResult = {
  _id: null;
  archived: number;
  draft: number;
  published: number;
  total: number;
};

type RichTextContentNode = {
  attrs?: Record<string, unknown>;
  content?: unknown;
  text?: unknown;
  type?: unknown;
};

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const hasPublishableContentNode = (node: unknown): boolean => {
  if (!node || typeof node !== 'object') return false;

  const contentNode = node as RichTextContentNode;

  if (typeof contentNode.text === 'string' && contentNode.text.trim()) {
    return true;
  }

  if (
    typeof contentNode.type === 'string' &&
    ['image', 'video', 'iframe'].includes(contentNode.type) &&
    contentNode.attrs &&
    Object.values(contentNode.attrs).some(
      (value) => typeof value === 'string' && value.trim(),
    )
  ) {
    return true;
  }

  if (Array.isArray(contentNode.content)) {
    return contentNode.content.some(hasPublishableContentNode);
  }

  return false;
};

const hasPublishableBlogPostContent = (contentJson: unknown) => {
  return hasPublishableContentNode(contentJson);
};

const getUniqueBlogPostSlug = async (
  title: string,
  preferredSlug?: string,
) => {
  const baseSlug = preferredSlug || createProductSlug(title);

  if (!baseSlug) {
    throw ApiError.BadRequest('Blog post title cannot create a valid slug');
  }

  let slug = baseSlug;
  let suffix = 2;

  while (await BlogPost.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const getUniqueBlogPostSlugForUpdate = async ({
  blogPostId,
  preferredSlug,
  title,
}: {
  blogPostId: string;
  preferredSlug?: string;
  title: string;
}) => {
  const baseSlug = preferredSlug || createProductSlug(title);

  if (!baseSlug) {
    throw ApiError.BadRequest('Blog post title cannot create a valid slug');
  }

  let slug = baseSlug;
  let suffix = 2;

  while (
    await BlogPost.exists({
      _id: {
        $ne: blogPostId,
      },
      slug,
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const getCoverImageFileIds = (
  coverImage?: { fileId?: string } | null,
) => (coverImage?.fileId ? [coverImage.fileId] : []);

const deleteImageKitFilesSafely = async (
  fileIds: string[],
  context: string,
) => {
  const uniqueFileIds = [...new Set(fileIds)];

  if (uniqueFileIds.length === 0) return;

  const results = await Promise.allSettled(
    uniqueFileIds.map((fileId) => deleteImageKitFile(fileId)),
  );

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') return;

    console.error('Failed to delete ImageKit file', {
      context,
      error: result.reason,
      fileId: uniqueFileIds[index],
    });
  });
};

const getSafePagination = (query: AdminBlogPostsQuery) => {
  const page = Math.max(1, query.page);
  const limit = Math.min(Math.max(1, query.limit), 50);

  return {
    page,
    limit,
  };
};

const getAdminBlogPostsFilter = (
  query: AdminBlogPostsQuery,
): QueryFilter<BlogPostData> => {
  const filter: QueryFilter<BlogPostData> = {};

  if (query.search) {
    const escapedSearch = escapeRegExp(query.search);
    const searchExpression = {
      $regex: escapedSearch,
      $options: 'i',
    };

    filter.$or = [
      { title: searchExpression },
      { slug: searchExpression },
      { excerpt: searchExpression },
    ];
  }

  if (query.status) {
    filter.status = query.status;
  }

  return filter;
};

const getAdminBlogPostsSort = (
  sort: AdminBlogPostsQuery['sort'],
): Record<string, 1 | -1> => {
  switch (sort) {
    case 'published-asc':
      return {
        publishedAt: 1,
        _id: 1,
      };

    case 'published-desc':
      return {
        publishedAt: -1,
        _id: -1,
      };

    case 'title-asc':
      return {
        title: 1,
        _id: 1,
      };

    case 'title-desc':
      return {
        title: -1,
        _id: -1,
      };

    case 'updated-asc':
      return {
        updatedAt: 1,
        _id: 1,
      };

    default:
      return {
        updatedAt: -1,
        _id: -1,
      };
  }
};

const getAdminBlogPostsStats = async () => {
  const [stats] = await BlogPost.aggregate<BlogPostStatsAggregateResult>([
    {
      $group: {
        _id: null,
        archived: {
          $sum: {
            $cond: [{ $eq: ['$status', 'archived'] }, 1, 0],
          },
        },
        draft: {
          $sum: {
            $cond: [{ $eq: ['$status', 'draft'] }, 1, 0],
          },
        },
        published: {
          $sum: {
            $cond: [{ $eq: ['$status', 'published'] }, 1, 0],
          },
        },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  return {
    archived: stats?.archived ?? 0,
    draft: stats?.draft ?? 0,
    published: stats?.published ?? 0,
    total: stats?.total ?? 0,
  };
};

const ensureBlogPostCanBePublished = (blogPost: {
  contentJson: unknown;
  slug: string;
  title: string;
}) => {
  if (!blogPost.title.trim()) {
    throw ApiError.Conflict('Blog post title is required before publishing');
  }

  if (!blogPost.slug.trim()) {
    throw ApiError.Conflict('Blog post slug is required before publishing');
  }

  if (!hasPublishableBlogPostContent(blogPost.contentJson)) {
    throw ApiError.Conflict('Blog post content is required before publishing');
  }
};

const getNextPublishedAt = ({
  nextStatus,
  previousPublishedAt,
  previousStatus,
}: {
  nextStatus: BlogPostStatus;
  previousPublishedAt?: Date | null;
  previousStatus: BlogPostStatus;
}) => {
  if (nextStatus !== 'published') return undefined;

  return previousStatus === 'published'
    ? previousPublishedAt ?? new Date()
    : new Date();
};

export const getAdminBlogPostsData = async (
  query: AdminBlogPostsQuery,
): Promise<AdminBlogPostsResponse['data']> => {
  const { page, limit } = getSafePagination(query);
  const filter = getAdminBlogPostsFilter(query);
  const total = await BlogPost.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const [blogPosts, stats] = await Promise.all([
    BlogPost.find(filter)
      .sort(getAdminBlogPostsSort(query.sort))
      .skip((safePage - 1) * limit)
      .limit(limit),
    getAdminBlogPostsStats(),
  ]);

  return {
    blogPosts: blogPosts.map(adminBlogPostToListItemDto),
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
    stats,
  };
};

export const createAdminBlogPostData = async ({
  adminUserId,
  blogPostData,
}: {
  adminUserId: string;
  blogPostData: CreateAdminBlogPostBody;
}): Promise<CreateAdminBlogPostResponse['data']> => {
  const slug = await getUniqueBlogPostSlug(
    blogPostData.title,
    blogPostData.slug,
  );
  const status = blogPostData.status ?? 'draft';

  if (status === 'published') {
    ensureBlogPostCanBePublished({
      contentJson: blogPostData.contentJson,
      slug,
      title: blogPostData.title,
    });
  }

  const blogPost = await BlogPost.create({
    authorId: adminUserId,
    contentHtml: blogPostData.contentHtml,
    contentJson: blogPostData.contentJson,
    coverImage: blogPostData.coverImage ?? undefined,
    excerpt: blogPostData.excerpt,
    publishedAt: status === 'published' ? new Date() : undefined,
    slug,
    status,
    title: blogPostData.title,
  });
  const attachedMediaFileIds = getCoverImageFileIds(blogPost.coverImage);

  await attachMediaAssets({
    fileIds: attachedMediaFileIds,
    ownerId: blogPost._id,
    ownerType: 'blog-post',
    purpose: 'blog-image',
  });

  await createAuditLog({
    action: 'blog-post.created',
    actorId: adminUserId,
    entityId: blogPost._id,
    entityType: 'blog-post',
    metadata: {
      attachedMediaFileIds,
      slug: blogPost.slug,
      status: blogPost.status,
      title: blogPost.title,
    },
  });

  return {
    blogPost: adminBlogPostToListItemDto(blogPost),
  };
};

export const getAdminBlogPostData = async (
  blogPostId: string,
): Promise<AdminBlogPostResponse['data']> => {
  const blogPost = await BlogPost.findById(blogPostId);

  if (!blogPost) {
    throw ApiError.NotFound('Blog post not found');
  }

  return {
    blogPost: adminBlogPostToDto(blogPost),
  };
};

export const updateAdminBlogPostData = async ({
  adminUserId,
  blogPostId,
  update,
}: {
  adminUserId: string;
  blogPostId: string;
  update: UpdateAdminBlogPostBody;
}): Promise<UpdateAdminBlogPostResponse['data']> => {
  const blogPost = await BlogPost.findById(blogPostId);

  if (!blogPost) {
    throw ApiError.NotFound('Blog post not found');
  }

  const previousStatus = blogPost.status;
  const previousCoverFileIds = getCoverImageFileIds(blogPost.coverImage);
  const nextCoverFileIds = getCoverImageFileIds(update.coverImage);
  const attachedMediaFileIds = nextCoverFileIds.filter(
    (fileId) => !previousCoverFileIds.includes(fileId),
  );
  const removedMediaFileIds = previousCoverFileIds.filter(
    (fileId) => !nextCoverFileIds.includes(fileId),
  );
  const slug = await getUniqueBlogPostSlugForUpdate({
    blogPostId,
    preferredSlug: update.slug,
    title: update.title,
  });
  const nextStatus = update.status ?? previousStatus;
  const publishedAt = getNextPublishedAt({
    nextStatus,
    previousPublishedAt: blogPost.publishedAt,
    previousStatus,
  });

  if (nextStatus === 'published') {
    ensureBlogPostCanBePublished({
      contentJson: update.contentJson,
      slug,
      title: update.title,
    });
  }

  blogPost.set({
    contentHtml: update.contentHtml,
    contentJson: update.contentJson,
    coverImage: update.coverImage ?? undefined,
    excerpt: update.excerpt,
    publishedAt,
    slug,
    status: nextStatus,
    title: update.title,
  });

  await blogPost.save();
  await deleteImageKitFilesSafely(
    removedMediaFileIds,
    'admin-blog-post-update',
  );
  await Promise.all([
    attachMediaAssets({
      fileIds: nextCoverFileIds,
      ownerId: blogPost._id,
      ownerType: 'blog-post',
      purpose: 'blog-image',
    }),
    markMediaAssetsDeleted(removedMediaFileIds),
  ]);

  await createAuditLog({
    action: 'blog-post.updated',
    actorId: adminUserId,
    entityId: blogPost._id,
    entityType: 'blog-post',
    metadata: {
      attachedMediaFileIds,
      previousStatus,
      removedMediaFileIds,
      slug: blogPost.slug,
      status: blogPost.status,
      title: blogPost.title,
    },
  });

  return {
    blogPost: adminBlogPostToDto(blogPost),
  };
};

export const updateAdminBlogPostStatusData = async ({
  adminUserId,
  blogPostId,
  update,
}: {
  adminUserId: string;
  blogPostId: string;
  update: UpdateAdminBlogPostStatusBody;
}): Promise<UpdateAdminBlogPostStatusResponse['data']> => {
  const blogPost = await BlogPost.findById(blogPostId);

  if (!blogPost) {
    throw ApiError.NotFound('Blog post not found');
  }

  const previousStatus = blogPost.status;

  if (previousStatus === update.status) {
    return {
      blogPost: adminBlogPostToDto(blogPost),
    };
  }

  if (update.status === 'published') {
    ensureBlogPostCanBePublished(blogPost);
  }

  blogPost.status = update.status;
  blogPost.publishedAt = getNextPublishedAt({
    nextStatus: update.status,
    previousPublishedAt: blogPost.publishedAt,
    previousStatus,
  });

  await blogPost.save();

  await createAuditLog({
    action: 'blog-post.status_changed',
    actorId: adminUserId,
    entityId: blogPost._id,
    entityType: 'blog-post',
    metadata: {
      previousStatus,
      slug: blogPost.slug,
      status: blogPost.status,
      title: blogPost.title,
    },
  });

  return {
    blogPost: adminBlogPostToDto(blogPost),
  };
};

export const deleteAdminBlogPostData = async ({
  adminUserId,
  blogPostId,
}: {
  adminUserId: string;
  blogPostId: string;
}): Promise<DeleteAdminBlogPostResponse['data']> => {
  const blogPost = await BlogPost.findById(blogPostId);

  if (!blogPost) {
    throw ApiError.NotFound('Blog post not found');
  }

  if (blogPost.status !== 'archived') {
    throw ApiError.Conflict('Archive blog post before deleting it');
  }

  const deletedBlogPost = {
    _id: blogPost._id,
    coverFileIds: getCoverImageFileIds(blogPost.coverImage),
    slug: blogPost.slug,
    title: blogPost.title,
  };

  await blogPost.deleteOne();
  await deleteImageKitFilesSafely(
    deletedBlogPost.coverFileIds,
    'admin-blog-post-delete',
  );
  await markMediaAssetsDeleted(deletedBlogPost.coverFileIds);

  await createAuditLog({
    action: 'blog-post.deleted',
    actorId: adminUserId,
    entityId: deletedBlogPost._id,
    entityType: 'blog-post',
    metadata: {
      deletedMediaFileIds: deletedBlogPost.coverFileIds,
      slug: deletedBlogPost.slug,
      title: deletedBlogPost.title,
    },
  });

  return {
    blogPostId: deletedBlogPost._id.toString(),
    slug: deletedBlogPost.slug,
    title: deletedBlogPost.title,
  };
};
