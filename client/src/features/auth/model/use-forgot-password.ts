import { useState } from 'react';
import type { FormEvent } from 'react';

import { useCooldown } from '../../../shared/hooks';
import {
  getZodFieldErrors,
  type FieldErrors,
} from '../../../shared/lib';
import { passwordResetRequestSchema } from './auth-validation';
import type { PasswordResetRequestFormValues } from './auth-types';
import { useRequestPasswordReset } from './use-request-password-reset';

const initialValues: PasswordResetRequestFormValues = {
  email: '',
};

const PASSWORD_RESET_COOLDOWN_SECONDS = 60;

export const useForgotPassword = () => {
  const [values, setValues] =
    useState<PasswordResetRequestFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors<PasswordResetRequestFormValues>>({});
  const cooldown = useCooldown();
  const requestPasswordResetMutation = useRequestPasswordReset();
  const response = requestPasswordResetMutation.data;

  const updateField = (
    field: keyof PasswordResetRequestFormValues,
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

    if (requestPasswordResetMutation.isPending || cooldown.isActive) return;

    setError(null);
    setFieldErrors({});

    const validationResult = passwordResetRequestSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(
        getZodFieldErrors<PasswordResetRequestFormValues>(
          validationResult.error,
        ),
      );
      return;
    }

    requestPasswordResetMutation.mutate(validationResult.data, {
      onSuccess: (nextResponse) => {
        if (!nextResponse.success) {
          setError(nextResponse.message);
        }
      },
      onError: () => {
        setError('Failed to request password reset');
      },
      onSettled: () => {
        cooldown.start(PASSWORD_RESET_COOLDOWN_SECONDS);
      },
    });
  };

  return {
    error,
    fieldErrors,
    handleSubmit,
    isCooldownActive: cooldown.isActive,
    isSubmitting: requestPasswordResetMutation.isPending,
    isSuccess: Boolean(response?.success),
    resendAvailableInSeconds: cooldown.remainingSeconds,
    updateField,
    values,
  };
};
