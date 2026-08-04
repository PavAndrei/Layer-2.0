import { isObjectIdOrHexString, Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { BlogPostComment } from '../models/blog-post-comments.model';
import type { BlogPostCommentDocument } from '../models/blog-post-comments.model';
import { BlogPost } from '../models/blog-posts.model';
import { User } from '../models/users.model';
import type {
  BlogPostCommentAuthorDto,
  BlogPostCommentsResponse,
  CreateBlogPostCommentResponse,
  DeleteBlogPostCommentResponse,
  UpdateBlogPostCommentResponse,
} from '../types/api';
import type { UserRole } from '../types/user';
import { blogPostCommentToDto } from '../utils/blog-post-comment-to-dto';
import type {
  BlogPostCommentsQuery,
  CreateBlogPostCommentBody,
  UpdateBlogPostCommentBody,
} from '../validators/blog-posts.validators';

type AuthenticatedCommentUser = {
  role: UserRole;
  userId: string;
};

const getPublishedBlogPostBySlug = async (slug: string) => {
  const blogPost = await BlogPost.findOne({
    slug,
    status: 'published',
  }).select('_id');

  if (!blogPost) {
    throw ApiError.NotFound('Blog post not found');
  }

  return blogPost;
};

const getAuthorById = async (
  comments: BlogPostCommentDocument[],
): Promise<Map<string, BlogPostCommentAuthorDto>> => {
  const authorIds = [
    ...new Set(comments.map((comment) => comment.authorId.toString())),
  ];

  if (authorIds.length === 0) {
    return new Map();
  }

  const users = await User.find({
    _id: {
      $in: authorIds,
    },
  }).select('_id avatarUrl name');

  return new Map(
    users.map((user) => [
      user._id.toString(),
      {
        _id: user._id.toString(),
        ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
        name: user.name,
      },
    ]),
  );
};

const assertCanManageComment = (
  comment: BlogPostCommentDocument,
  user: AuthenticatedCommentUser,
) => {
  if (user.role === 'admin') return;

  if (comment.authorId.toString() === user.userId) return;

  throw ApiError.Forbidden('You cannot manage this comment');
};

const findBlogPostComment = async ({
  blogPostId,
  commentId,
}: {
  blogPostId: Types.ObjectId;
  commentId: string;
}) => {
  if (!isObjectIdOrHexString(commentId)) {
    throw ApiError.BadRequest('Invalid comment id');
  }

  const comment = await BlogPostComment.findOne({
    _id: new Types.ObjectId(commentId),
    blogPostId,
  });

  if (!comment) {
    throw ApiError.NotFound('Comment not found');
  }

  return comment;
};

const toSingleCommentResponseDto = async (
  comment: BlogPostCommentDocument,
) => {
  const authorById = await getAuthorById([comment]);

  return blogPostCommentToDto(comment, authorById);
};

export const getBlogPostCommentsData = async (
  slug: string,
  query: BlogPostCommentsQuery,
): Promise<BlogPostCommentsResponse['data']> => {
  const blogPost = await getPublishedBlogPostBySlug(slug);
  const total = await BlogPostComment.countDocuments({
    blogPostId: blogPost._id,
    parentCommentId: null,
  });
  const totalPages = Math.ceil(total / query.limit);
  const safePage = Math.min(query.page, totalPages || 1);
  const rootComments = await BlogPostComment.find({
    blogPostId: blogPost._id,
    parentCommentId: null,
  })
    .sort({ createdAt: -1, _id: -1 })
    .skip((safePage - 1) * query.limit)
    .limit(query.limit);
  const rootCommentIds = rootComments.map((comment) => comment._id);
  const replies =
    rootCommentIds.length > 0
      ? await BlogPostComment.find({
          blogPostId: blogPost._id,
          parentCommentId: {
            $in: rootCommentIds,
          },
        }).sort({ createdAt: 1, _id: 1 })
      : [];
  const authorById = await getAuthorById([...rootComments, ...replies]);
  const repliesByParentId = new Map<string, BlogPostCommentDocument[]>();

  replies.forEach((reply) => {
    const parentId = reply.parentCommentId?.toString();

    if (!parentId) return;

    const parentReplies = repliesByParentId.get(parentId) ?? [];

    parentReplies.push(reply);
    repliesByParentId.set(parentId, parentReplies);
  });

  return {
    comments: rootComments.map((comment) =>
      blogPostCommentToDto(
        comment,
        authorById,
        (repliesByParentId.get(comment._id.toString()) ?? []).map((reply) =>
          blogPostCommentToDto(reply, authorById),
        ),
      ),
    ),
    pagination: {
      total,
      page: safePage,
      limit: query.limit,
      totalPages,
    },
  };
};

export const createBlogPostCommentData = async (
  slug: string,
  userId: string,
  commentData: CreateBlogPostCommentBody,
): Promise<CreateBlogPostCommentResponse['data']> => {
  if (!isObjectIdOrHexString(userId)) {
    throw ApiError.BadRequest('Invalid user id');
  }

  const [blogPost, author] = await Promise.all([
    getPublishedBlogPostBySlug(slug),
    User.findById(new Types.ObjectId(userId)).select('_id avatarUrl name'),
  ]);

  if (!author) {
    throw ApiError.Unauthorized('User not found');
  }

  const parentCommentId = commentData.parentCommentId ?? null;

  if (parentCommentId) {
    const parentComment = await findBlogPostComment({
      blogPostId: blogPost._id,
      commentId: parentCommentId,
    });

    if (parentComment.status === 'deleted') {
      throw ApiError.BadRequest('Cannot reply to a deleted comment');
    }

    if (parentComment.parentCommentId) {
      throw ApiError.BadRequest('Replies can only be added to root comments');
    }
  }

  const comment = await BlogPostComment.create({
    authorId: author._id,
    blogPostId: blogPost._id,
    parentCommentId: parentCommentId
      ? new Types.ObjectId(parentCommentId)
      : null,
    status: 'published',
    text: commentData.text,
  });

  await BlogPost.findByIdAndUpdate(blogPost._id, {
    $inc: {
      commentsCount: 1,
    },
  });

  return {
    comment: blogPostCommentToDto(
      comment,
      new Map([
        [
          author._id.toString(),
          {
            _id: author._id.toString(),
            ...(author.avatarUrl ? { avatarUrl: author.avatarUrl } : {}),
            name: author.name,
          },
        ],
      ]),
    ),
  };
};

export const updateBlogPostCommentData = async (
  slug: string,
  user: AuthenticatedCommentUser,
  commentId: string,
  commentData: UpdateBlogPostCommentBody,
): Promise<UpdateBlogPostCommentResponse['data']> => {
  const blogPost = await getPublishedBlogPostBySlug(slug);
  const comment = await findBlogPostComment({
    blogPostId: blogPost._id,
    commentId,
  });

  assertCanManageComment(comment, user);

  if (comment.status === 'deleted') {
    throw ApiError.BadRequest('Deleted comment cannot be edited');
  }

  comment.text = commentData.text;
  comment.editedAt = new Date();

  await comment.save();

  return {
    comment: await toSingleCommentResponseDto(comment),
  };
};

export const deleteBlogPostCommentData = async (
  slug: string,
  user: AuthenticatedCommentUser,
  commentId: string,
): Promise<DeleteBlogPostCommentResponse['data']> => {
  const blogPost = await getPublishedBlogPostBySlug(slug);
  const comment = await findBlogPostComment({
    blogPostId: blogPost._id,
    commentId,
  });

  assertCanManageComment(comment, user);

  if (comment.status !== 'deleted') {
    comment.status = 'deleted';
    comment.deletedAt = new Date();

    await comment.save();
    await BlogPost.findOneAndUpdate(
      {
        _id: blogPost._id,
        commentsCount: {
          $gt: 0,
        },
      },
      {
        $inc: {
          commentsCount: -1,
        },
      },
    );
  }

  return {
    comment: await toSingleCommentResponseDto(comment),
    commentId: comment._id.toString(),
  };
};
