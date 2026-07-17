import type { ZodError } from 'zod';

export type FieldErrors<FormValues> = Partial<
  Record<keyof FormValues, string>
>;

export const getZodErrorMessage = (error: ZodError) => {
  return error.issues[0]?.message ?? 'Invalid form data';
};

export const getZodFieldErrors = <FormValues>(
  error: ZodError,
): FieldErrors<FormValues> => {
  return error.issues.reduce<FieldErrors<FormValues>>((errors, issue) => {
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
