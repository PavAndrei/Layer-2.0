import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from 'mongoose';

import {
  BLOG_POST_COMMENT_STATUSES,
  type BlogPostCommentStatus,
} from '../types/blog-post-comment';

const blogPostCommentSchema = new Schema(
  {
    blogPostId: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: true,
      index: true,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPostComment',
      default: null,
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: BLOG_POST_COMMENT_STATUSES,
      default: 'published' satisfies BlogPostCommentStatus,
      index: true,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

blogPostCommentSchema.index({
  blogPostId: 1,
  parentCommentId: 1,
  createdAt: -1,
});
blogPostCommentSchema.index({ authorId: 1, createdAt: -1 });
blogPostCommentSchema.index({ status: 1, createdAt: -1 });

export type BlogPostCommentData = InferSchemaType<
  typeof blogPostCommentSchema
>;
export type BlogPostCommentDocument =
  HydratedDocument<BlogPostCommentData>;

export const BlogPostComment = model<BlogPostCommentData>(
  'BlogPostComment',
  blogPostCommentSchema,
);
