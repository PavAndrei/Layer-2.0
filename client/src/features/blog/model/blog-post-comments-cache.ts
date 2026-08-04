import type { QueryClient } from '@tanstack/react-query';

import type { BlogPostComment } from '../../../entities/blog';
import type { ApiResponse } from '../../../shared/api';
import type {
  BlogPostCommentsResponseData,
  BlogPostResponseData,
  BlogPostsResponseData,
} from '../api';
import { blogPostsQueryKeys } from './blog-posts-query-keys';

type BlogPostsListQueryData = ApiResponse<BlogPostsResponseData>;

const updateCommentTree = (
  comments: BlogPostComment[],
  comment: BlogPostComment,
): BlogPostComment[] =>
  comments.map((currentComment) => {
    if (currentComment._id === comment._id) {
      return {
        ...comment,
        replies: currentComment.replies,
      };
    }

    if (currentComment.replies.length === 0) return currentComment;

    return {
      ...currentComment,
      replies: updateCommentTree(currentComment.replies, comment),
    };
  });

const addReplyToCommentTree = (
  comments: BlogPostComment[],
  reply: BlogPostComment,
): BlogPostComment[] =>
  comments.map((comment) => {
    if (comment._id === reply.parentCommentId) {
      const hasReply = comment.replies.some(
        (currentReply) => currentReply._id === reply._id,
      );

      if (hasReply) return comment;

      return {
        ...comment,
        replies: [...comment.replies, reply],
      };
    }

    return comment;
  });

const syncBlogPostCommentsCountQueries = (
  queryClient: QueryClient,
  slug: string,
  change: number,
) => {
  queryClient.setQueryData<BlogPostResponseData>(
    blogPostsQueryKeys.detail(slug),
    (previousData) => {
      if (!previousData) return previousData;

      return {
        ...previousData,
        blogPost: {
          ...previousData.blogPost,
          commentsCount: Math.max(
            0,
            previousData.blogPost.commentsCount + change,
          ),
        },
      };
    },
  );

  queryClient.setQueriesData<BlogPostsListQueryData>(
    {
      queryKey: blogPostsQueryKeys.lists(),
    },
    (previousData) => {
      if (!previousData?.success) return previousData;

      return {
        ...previousData,
        data: {
          ...previousData.data,
          blogPosts: previousData.data.blogPosts.map((blogPost) =>
            blogPost.slug === slug
              ? {
                  ...blogPost,
                  commentsCount: Math.max(
                    0,
                    blogPost.commentsCount + change,
                  ),
                }
              : blogPost,
          ),
        },
      };
    },
  );
};

export const syncCreatedBlogPostCommentQueries = (
  queryClient: QueryClient,
  slug: string,
  comment: BlogPostComment,
) => {
  syncBlogPostCommentsCountQueries(queryClient, slug, 1);

  queryClient.setQueriesData<BlogPostCommentsResponseData>(
    {
      queryKey: blogPostsQueryKeys.comments(slug),
    },
    (previousData) => {
      if (!previousData) return previousData;

      if (comment.parentCommentId) {
        return {
          ...previousData,
          comments: addReplyToCommentTree(previousData.comments, comment),
        };
      }

      if (previousData.pagination.page !== 1) return previousData;

      const hasComment = previousData.comments.some(
        (currentComment) => currentComment._id === comment._id,
      );

      if (hasComment) return previousData;

      return {
        ...previousData,
        comments: [comment, ...previousData.comments].slice(
          0,
          previousData.pagination.limit,
        ),
        pagination: {
          ...previousData.pagination,
          total: previousData.pagination.total + 1,
          totalPages: Math.ceil(
            (previousData.pagination.total + 1) /
              previousData.pagination.limit,
          ),
        },
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: blogPostsQueryKeys.comments(slug),
  });
};

export const syncUpdatedBlogPostCommentQueries = (
  queryClient: QueryClient,
  slug: string,
  comment: BlogPostComment,
  options: {
    decrementCommentsCount?: boolean;
  } = {},
) => {
  if (options.decrementCommentsCount) {
    syncBlogPostCommentsCountQueries(queryClient, slug, -1);
  }

  queryClient.setQueriesData<BlogPostCommentsResponseData>(
    {
      queryKey: blogPostsQueryKeys.comments(slug),
    },
    (previousData) => {
      if (!previousData) return previousData;

      return {
        ...previousData,
        comments: updateCommentTree(previousData.comments, comment),
      };
    },
  );
};
