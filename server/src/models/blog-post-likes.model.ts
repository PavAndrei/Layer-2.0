import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from 'mongoose';

const blogPostLikeSchema = new Schema(
  {
    blogPostId: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: true,
      index: true,
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

blogPostLikeSchema.index(
  {
    blogPostId: 1,
    visitorHash: 1,
  },
  {
    unique: true,
  },
);

export type BlogPostLikeData = InferSchemaType<typeof blogPostLikeSchema>;
export type BlogPostLikeDocument = HydratedDocument<BlogPostLikeData>;

export const BlogPostLike = model<BlogPostLikeData>(
  'BlogPostLike',
  blogPostLikeSchema,
);
