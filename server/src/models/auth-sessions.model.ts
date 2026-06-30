import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from 'mongoose';

const authSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
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

authSessionSchema.index({ userId: 1, createdAt: -1 });
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AuthSessionData = InferSchemaType<typeof authSessionSchema>;
export type AuthSessionDocument = HydratedDocument<
  Omit<AuthSessionData, 'userId'> & { userId: Types.ObjectId }
>;

export const AuthSession = model<AuthSessionData>(
  'AuthSession',
  authSessionSchema,
);
