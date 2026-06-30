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

export type RegisterBody = z.infer<typeof registerSchema>['body'];
export type LoginBody = z.infer<typeof loginSchema>['body'];
