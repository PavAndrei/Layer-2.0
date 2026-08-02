import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from 'mongoose';

import {
  MEDIA_ASSET_OWNER_TYPES,
  MEDIA_ASSET_STATUSES,
  MEDIA_UPLOAD_PURPOSES,
  type MediaAssetOwnerType,
  type MediaAssetStatus,
  type MediaUploadPurpose,
} from '../types/media';

const mediaAssetSchema = new Schema(
  {
    fileId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    filePath: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      required: true,
      trim: true,
    },

    height: {
      type: Number,
      min: 0,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerId: {
      type: String,
      trim: true,
      index: true,
    },

    ownerType: {
      type: String,
      enum: MEDIA_ASSET_OWNER_TYPES,
      index: true,
    },

    purpose: {
      type: String,
      enum: MEDIA_UPLOAD_PURPOSES,
      required: true,
      index: true,
    },

    size: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: MEDIA_ASSET_STATUSES,
      required: true,
      default: 'pending' satisfies MediaAssetStatus,
      index: true,
    },

    thumbnailUrl: {
      type: String,
      trim: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    width: {
      type: Number,
      min: 0,
    },

    attachedAt: {
      type: Date,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

mediaAssetSchema.index({ status: 1, createdAt: 1 });
mediaAssetSchema.index({ ownerType: 1, ownerId: 1, status: 1 });
mediaAssetSchema.index({ uploadedBy: 1, status: 1, createdAt: -1 });

export type MediaAssetData = Omit<
  InferSchemaType<typeof mediaAssetSchema>,
  'ownerType' | 'purpose' | 'status'
> & {
  ownerType?: MediaAssetOwnerType;
  purpose: MediaUploadPurpose;
  status: MediaAssetStatus;
};
export type MediaAssetDocument = HydratedDocument<MediaAssetData>;

export const MediaAsset = model<MediaAssetData>(
  'MediaAsset',
  mediaAssetSchema,
);
