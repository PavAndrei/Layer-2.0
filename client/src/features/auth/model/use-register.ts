import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { register } from '../api';
import { setAuthenticatedAuthBootstrapQueryData } from './auth-query-cache';
import type { RegisterFormValues } from './auth-types';
import { useAuthStore } from './auth-store';
import {
  getZodFieldErrors,
  registerSchema,
  type FormErrors,
} from './auth-validation';

type UseRegisterOptions = {
  redirectTo?: string;
};

const initialValues: RegisterFormValues = {
  confirmPassword: '',
  email: '',
  name: '',
  password: '',
};

export const useRegister = ({
  redirectTo = '/',
}: UseRegisterOptions = {}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] =
    useState<FormErrors<RegisterFormValues>>({});
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      if (!response.success) {
        setError(response.message);
        return;
      }

      setSession(response.data);
      setAuthenticatedAuthBootstrapQueryData(queryClient, response.data);
      navigate(redirectTo, { replace: true });
    },
    onError: () => {
      setError('Failed to register');
    },
  });

  const updateField = (field: keyof RegisterFormValues, value: string) => {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registerMutation.isPending) return;

    setError(null);
    setFieldErrors({});

    const validationResult = registerSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(
        getZodFieldErrors<RegisterFormValues>(validationResult.error),
      );
      return;
    }

    const { confirmPassword: _confirmPassword, ...payload } =
      validationResult.data;

    registerMutation.mutate(payload);
  };

  return {
    error,
    fieldErrors,
    handleSubmit,
    isSubmitting: registerMutation.isPending,
    updateField,
    values,
  };
};
