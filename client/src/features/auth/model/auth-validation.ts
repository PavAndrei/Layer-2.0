import { z } from 'zod';

export type FormErrors<FormValues> = Partial<
  Record<keyof FormValues, string>
>;

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

export const getZodErrorMessage = (error: z.ZodError) => {
  return error.issues[0]?.message ?? 'Invalid form data';
};

export const getZodFieldErrors = <FormValues>(
  error: z.ZodError,
): FormErrors<FormValues> => {
  return error.issues.reduce<FormErrors<FormValues>>((errors, issue) => {
    const [fieldName] = issue.path;

    if (typeof fieldName !== 'string') return errors;

    const fieldKey = fieldName as keyof FormValues;

    if (errors[fieldKey]) return errors;

    return {
      ...errors,
      [fieldKey]: issue.message,
    };
  }, {});
};
