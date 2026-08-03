import { QueryFilter } from 'mongoose';
import { createHash } from 'node:crypto';

import { VIEW_TRACKING_SECRET } from '../constants/env';
import { ApiError } from '../exceptions/api-error';
import { BlogPostView } from '../models/blog-post-views.model';
import { BlogPost, type BlogPostData } from '../models/blog-posts.model';
import { Product } from '../models/products.model';
import type {
  BlogPostResponse,
  BlogPostsResponse,
  TrackBlogPostViewResponse,
} from '../types/api';
import { getReviewCountsByProductIds } from '../utils/get-review-counts';
import {
  blogPostToDto,
  blogPostToListItemDto,
} from '../utils/blog-post-to-dto';
import { productToDto } from '../utils/product-to-dto';
import type { BlogPostsQuery } from '../validators/blog-posts.validators';

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isDuplicateKeyError = (error: unknown) => {
  return (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 11000
  );
};

const getVisitorHash = ({
  ip,
  userAgent,
}: {
  ip: string;
  userAgent: string;
}) => {
  return createHash('sha256')
    .update(`${ip}:${userAgent}:${VIEW_TRACKING_SECRET}`)
    .digest('hex');
};

const getBlogPostsFilter = (
  query: BlogPostsQuery,
): QueryFilter<BlogPostData> => {
  const filter: QueryFilter<BlogPostData> = {
    status: 'published',
  };

  if (query.search) {
    const searchExpression = {
      $regex: escapeRegExp(query.search),
      $options: 'i',
    };

    filter.$or = [
      { title: searchExpression },
      { excerpt: searchExpression },
    ];
  }

  if (query.tag) {
    filter.tags = query.tag;
  }

  return filter;
};

const getRelatedProductsForBlogPost = async (
  relatedProductIds: BlogPostData['relatedProductIds'],
) => {
  try {
    const orderedProductIds = (relatedProductIds ?? []).map((productId) =>
      productId.toString(),
    );

    if (orderedProductIds.length === 0) {
      return [];
    }

    const products = await Product.find({
      _id: {
        $in: orderedProductIds,
      },
      $or: [
        { status: 'active' },
        { status: { $exists: false } },
      ],
    });
    const productById = new Map(
      products.map((product) => [product._id.toString(), product]),
    );
    const orderedProducts = orderedProductIds
      .map((productId) => productById.get(productId))
      .filter((product) => product !== undefined);
    const reviewCounts = await getReviewCountsByProductIds(
      orderedProducts.map((product) => product._id),
    );

    return orderedProducts.map((product) =>
      productToDto(product, {
        reviewsCount: reviewCounts.get(product._id.toString()),
      }),
    );
  } catch (error) {
    console.error('Failed to load blog post related products', {
      error,
      relatedProductIds,
    });

    return [];
  }
};

export const getBlogPostsData = async (
  query: BlogPostsQuery,
): Promise<BlogPostsResponse['data']> => {
  const filter = getBlogPostsFilter(query);
  const total = await BlogPost.countDocuments(filter);
  const totalPages = Math.ceil(total / query.limit);
  const safePage = Math.min(query.page, totalPages || 1);
  const blogPosts = await BlogPost.find(filter)
    .sort({
      publishedAt: -1,
      _id: -1,
    })
    .skip((safePage - 1) * query.limit)
    .limit(query.limit);

  return {
    blogPosts: blogPosts.map(blogPostToListItemDto),
    pagination: {
      total,
      page: safePage,
      limit: query.limit,
      totalPages,
    },
  };
};

export const getBlogPostBySlugData = async (
  slug: string,
): Promise<BlogPostResponse['data']> => {
  const blogPost = await BlogPost.findOne({
    slug,
    status: 'published',
  });

  if (!blogPost) {
    throw ApiError.NotFound('Blog post not found');
  }

  const relatedProducts = await getRelatedProductsForBlogPost(
    blogPost.relatedProductIds,
  );

  return {
    blogPost: blogPostToDto(blogPost, relatedProducts),
  };
};

export const trackBlogPostViewData = async ({
  ip,
  slug,
  userAgent,
}: {
  ip: string;
  slug: string;
  userAgent: string;
}): Promise<TrackBlogPostViewResponse['data']> => {
  const blogPost = await BlogPost.findOne({
    slug,
    status: 'published',
  }).select('_id viewsCount');

  if (!blogPost) {
    throw ApiError.NotFound('Blog post not found');
  }

  try {
    await BlogPostView.create({
      blogPostId: blogPost._id,
      visitorHash: getVisitorHash({
        ip,
        userAgent,
      }),
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        counted: false,
        viewsCount: blogPost.viewsCount ?? 0,
      };
    }

    throw error;
  }

  const updatedBlogPost = await BlogPost.findByIdAndUpdate(
    blogPost._id,
    {
      $inc: {
        viewsCount: 1,
      },
    },
    {
      returnDocument: 'after',
      projection: {
        viewsCount: 1,
      },
    },
  );

  return {
    counted: true,
    viewsCount: updatedBlogPost?.viewsCount ?? (blogPost.viewsCount ?? 0) + 1,
  };
};
