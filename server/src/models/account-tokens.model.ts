import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from 'mongoose';

import {
  ACCOUNT_TOKEN_PURPOSES,
  type AccountTokenPurpose,
} from '../types/account-token';

const accountTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    purpose: {
      type: String,
      enum: ACCOUNT_TOKEN_PURPOSES,
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 64,
      maxlength: 64,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    consumedAt: {
      type: Date,
    },

    revokedAt: {
      type: Date,
    },

    createdByIp: {
      type: String,
      trim: true,
      maxlength: 128,
    },

    userAgent: {
      type: String,
      trim: true,
      maxlength: 512,
    },
  },
  {
    timestamps: true,
  },
);

accountTokenSchema.index({ userId: 1, purpose: 1, createdAt: -1 });
accountTokenSchema.index({
  purpose: 1,
  tokenHash: 1,
  consumedAt: 1,
  revokedAt: 1,
  expiresAt: 1,
});
accountTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AccountTokenData = InferSchemaType<typeof accountTokenSchema>;
export type AccountTokenDocument = HydratedDocument<
  Omit<AccountTokenData, 'purpose' | 'userId'> & {
    purpose: AccountTokenPurpose;
    userId: Types.ObjectId;
  }
>;

export const AccountToken = model<AccountTokenData>(
  'AccountToken',
  accountTokenSchema,
);
