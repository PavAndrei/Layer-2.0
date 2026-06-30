import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

import { USER_ROLES, type UserRole } from '../types/user';

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
      required: true,
      select: false,
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

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export type UserData = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserData>;

export const User = model<UserData>('User', userSchema);
