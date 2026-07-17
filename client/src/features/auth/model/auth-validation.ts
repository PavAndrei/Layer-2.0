import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email')
    .max(254, 'Email is too long')
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(128, 'Password is too long'),
});

export const passwordResetRequestSchema = loginSchema.pick({
  email: true,
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
    name: z
      .string()
      .trim()
      .min(2, 'Name must contain at least 2 characters')
      .max(80, 'Name is too long'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const passwordResetConfirmSchema = z
  .object({
    confirmPassword: z.string(),
    password: loginSchema.shape.password,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
