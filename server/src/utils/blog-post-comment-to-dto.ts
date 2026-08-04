import type { Types } from 'mongoose';

import type { BlogPostCommentDocument } from '../models/blog-post-comments.model';
import type {
  BlogPostCommentAuthorDto,
  BlogPostCommentDto,
} from '../types/api';

type BlogPostCommentAuthorMap = Map<string, BlogPostCommentAuthorDto>;

const getAuthorDto = (
  authorId: Types.ObjectId,
  authorById: BlogPostCommentAuthorMap,
): BlogPostCommentAuthorDto => {
  return (
    authorById.get(authorId.toString()) ?? {
      _id: authorId.toString(),
      name: 'Deleted user',
    }
  );
};

export const blogPostCommentToDto = (
  comment: BlogPostCommentDocument,
  authorById: BlogPostCommentAuthorMap,
  replies: BlogPostCommentDto[] = [],
): BlogPostCommentDto => ({
  _id: comment._id.toString(),
  author: getAuthorDto(comment.authorId, authorById),
  blogPostId: comment.blogPostId.toString(),
  createdAt: comment.createdAt.toISOString(),
  deletedAt: comment.deletedAt?.toISOString() ?? null,
  editedAt: comment.editedAt?.toISOString() ?? null,
  parentCommentId: comment.parentCommentId?.toString() ?? null,
  replies,
  status: comment.status,
  text: comment.status === 'deleted' ? '' : comment.text,
  updatedAt: comment.updatedAt.toISOString(),
});
