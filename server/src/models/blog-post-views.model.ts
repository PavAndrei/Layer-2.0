import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from 'mongoose';

const BLOG_POST_VIEW_TTL_SECONDS = 60 * 60 * 24;

const blogPostViewSchema = new Schema(
  {
    blogPostId: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: true,
      index: true,
    },

    viewedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    visitorHash: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

blogPostViewSchema.index(
  {
    blogPostId: 1,
    visitorHash: 1,
  },
  {
    unique: true,
  },
);
blogPostViewSchema.index(
  {
    viewedAt: 1,
  },
  {
    expireAfterSeconds: BLOG_POST_VIEW_TTL_SECONDS,
  },
);

export type BlogPostViewData = InferSchemaType<typeof blogPostViewSchema>;
export type BlogPostViewDocument = HydratedDocument<BlogPostViewData>;

export const BlogPostView = model<BlogPostViewData>(
  'BlogPostView',
  blogPostViewSchema,
);
