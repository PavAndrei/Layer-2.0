import { useState } from 'react';
import type { FormEvent } from 'react';

import {
  getZodFieldErrors,
  passwordResetConfirmSchema,
  type FormErrors,
} from './auth-validation';
import type { PasswordResetConfirmFormValues } from './auth-types';
import { useConfirmPasswordReset } from './use-confirm-password-reset';

const initialValues: PasswordResetConfirmFormValues = {
  confirmPassword: '',
  password: '',
};

export const useResetPassword = (token: string) => {
  const [values, setValues] =
    useState<PasswordResetConfirmFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] =
    useState<FormErrors<PasswordResetConfirmFormValues>>({});
  const confirmPasswordResetMutation = useConfirmPasswordReset();
  const response = confirmPasswordResetMutation.data;

  const updateField = (
    field: keyof PasswordResetConfirmFormValues,
    value: string,
  ) => {
    setValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [field]: undefined,
    }));
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (confirmPasswordResetMutation.isPending) return;

    setError(null);
    setFieldErrors({});

    if (!token) {
      setError('Password reset link is invalid');
      return;
    }

    const validationResult = passwordResetConfirmSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(
        getZodFieldErrors<PasswordResetConfirmFormValues>(
          validationResult.error,
        ),
      );
      return;
    }

    confirmPasswordResetMutation.mutate(
      {
        password: validationResult.data.password,
        token,
      },
      {
        onSuccess: (nextResponse) => {
          if (!nextResponse.success) {
            setError(nextResponse.message);
          }
        },
        onError: () => {
          setError('Failed to reset password');
        },
      },
    );
  };

  return {
    error,
    fieldErrors,
    handleSubmit,
    isSubmitting: confirmPasswordResetMutation.isPending,
    isSuccess: Boolean(response?.success),
    updateField,
    values,
  };
};
