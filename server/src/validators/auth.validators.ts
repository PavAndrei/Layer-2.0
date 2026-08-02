import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .email('Invalid email')
  .max(254, 'Email is too long')
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters')
  .max(128, 'Password is too long');

const accountTokenSchema = z
  .string()
  .trim()
  .min(20, 'Token is too short')
  .max(200, 'Token is too long')
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid token');

const googleAuthorizationCodeSchema = z
  .string()
  .trim()
  .min(10, 'Google authorization code is too short')
  .max(2048, 'Google authorization code is too long')
  .regex(/^[A-Za-z0-9/_.-]+$/, 'Invalid Google authorization code');

const imageKitFileIdSchema = z
  .string()
  .trim()
  .min(1, 'Avatar file id is required')
  .max(200, 'Avatar file id is too long')
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid avatar file id');

const imageKitFilePathSchema = z
  .string()
  .trim()
  .min(1, 'Avatar file path is required')
  .max(500, 'Avatar file path is too long');

const imageUrlSchema = z
  .string()
  .trim()
  .url('Avatar URL must be valid')
  .max(2048, 'Avatar URL is too long');

const profileNameSchema = z
  .string()
  .trim()
  .min(2, 'Name must contain at least 2 characters')
  .max(80, 'Name is too long');

export const registerSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
      name: z
        .string()
        .trim()
        .min(2, 'Name must contain at least 2 characters')
        .max(80, 'Name is too long'),
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
    })
    .strict(),
});

export const googleLoginSchema = z.object({
  body: z
    .object({
      code: googleAuthorizationCodeSchema,
    })
    .strict(),
});

export const emailVerificationConfirmSchema = z.object({
  body: z
    .object({
      token: accountTokenSchema,
    })
    .strict(),
});

export const passwordResetRequestSchema = z.object({
  body: z
    .object({
      email: emailSchema,
    })
    .strict(),
});

export const passwordResetConfirmSchema = z.object({
  body: z
    .object({
      password: passwordSchema,
      token: accountTokenSchema,
    })
    .strict(),
});

export const updateCurrentUserProfileSchema = z.object({
  body: z
    .object({
      avatar: z
        .object({
          fileId: imageKitFileIdSchema,
          filePath: imageKitFilePathSchema,
          url: imageUrlSchema,
        })
        .strict()
        .nullable()
        .optional(),
      name: profileNameSchema.optional(),
    })
    .strict()
    .refine(
      (body) => body.name !== undefined || body.avatar !== undefined,
      'Profile update is empty',
    ),
});

export type RegisterBody = z.infer<typeof registerSchema>['body'];
export type LoginBody = z.infer<typeof loginSchema>['body'];
export type GoogleLoginBody = z.infer<typeof googleLoginSchema>['body'];
export type EmailVerificationConfirmBody = z.infer<
  typeof emailVerificationConfirmSchema
>['body'];
export type PasswordResetRequestBody = z.infer<
  typeof passwordResetRequestSchema
>['body'];
export type PasswordResetConfirmBody = z.infer<
  typeof passwordResetConfirmSchema
>['body'];
export type UpdateCurrentUserProfileBody = z.infer<
  typeof updateCurrentUserProfileSchema
>['body'];
