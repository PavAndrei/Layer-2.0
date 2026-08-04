import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from 'mongoose';

import {
  BLOG_POST_STATUSES,
  type BlogPostContentJson,
  type BlogPostCoverImage,
  type BlogPostStatus,
} from '../types/blog-post';

const blogPostCoverImageSchema = new Schema<BlogPostCoverImage>(
  {
    alt: {
      type: String,
      required: true,
      trim: true,
    },

    fileId: {
      type: String,
      trim: true,
    },

    filePath: {
      type: String,
      trim: true,
    },

    src: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const blogPostSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    contentHtml: {
      type: String,
      default: '',
    },

    contentJson: {
      type: Schema.Types.Mixed,
      default: {},
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    coverImage: {
      type: blogPostCoverImageSchema,
    },

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    excerpt: {
      type: String,
      default: '',
      trim: true,
    },

    publishedAt: {
      type: Date,
    },

    relatedProductIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
      ],
      default: [],
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: BLOG_POST_STATUSES,
      required: true,
      default: 'draft' satisfies BlogPostStatus,
      index: true,
    },

    tags: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      default: [],
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

blogPostSchema.index({ status: 1, updatedAt: -1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ relatedProductIds: 1 });
blogPostSchema.index({ status: 1, tags: 1, publishedAt: -1 });

export type BlogPostData = Omit<
  InferSchemaType<typeof blogPostSchema>,
  'contentJson' | 'coverImage' | 'status'
> & {
  contentJson: BlogPostContentJson;
  coverImage?: BlogPostCoverImage;
  status: BlogPostStatus;
};
export type BlogPostDocument = HydratedDocument<BlogPostData>;

export const BlogPost = model<BlogPostData>(
  'BlogPost',
  blogPostSchema,
);
