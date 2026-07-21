import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

import {
  USER_AUTH_PROVIDERS,
  USER_ROLES,
  type UserAuthProvider,
  type UserRole,
} from '../types/user';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      maxlength: 254,
      match: EMAIL_PATTERN,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    googleId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: 'customer' satisfies UserRole,
      index: true,
    },

    authProviders: {
      type: [String],
      enum: USER_AUTH_PROVIDERS,
      default: ['password'] satisfies UserAuthProvider[],
    },

    avatarUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export type UserData = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserData>;

export const User = model<UserData>('User', userSchema);
