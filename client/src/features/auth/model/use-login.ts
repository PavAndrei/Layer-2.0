import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';

import { login } from '../api';
import { setAuthenticatedAuthBootstrapQueryData } from './auth-query-cache';
import type { LoginPayload } from './auth-types';
import { useAuthStore } from './auth-store';
import {
  getZodFieldErrors,
  loginSchema,
  type FormErrors,
} from './auth-validation';

type UseLoginOptions = {
  redirectTo?: string;
};

const initialValues: LoginPayload = {
  email: '',
  password: '',
};

type RedirectLocationState = {
  from?: {
    hash?: string;
    pathname?: string;
    search?: string;
  };
};

const getRedirectPathFromState = (state: unknown): string | null => {
  const redirectState = state as RedirectLocationState | null;
  const from = redirectState?.from;

  if (!from?.pathname) return null;

  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
};

export const useLogin = ({ redirectTo = '/' }: UseLoginOptions = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const [values, setValues] = useState<LoginPayload>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors<LoginPayload>>({});
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (!response.success) {
        setError(response.message);
        return;
      }

      setSession(response.data);
      setAuthenticatedAuthBootstrapQueryData(queryClient, response.data);
      navigate(getRedirectPathFromState(location.state) ?? redirectTo, {
        replace: true,
      });
    },
    onError: () => {
      setError('Failed to login');
    },
  });

  const updateField = (field: keyof LoginPayload, value: string) => {
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

    if (loginMutation.isPending) return;

    setError(null);
    setFieldErrors({});

    const validationResult = loginSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(getZodFieldErrors<LoginPayload>(validationResult.error));
      return;
    }

    loginMutation.mutate(validationResult.data);
  };

  return {
    error,
    fieldErrors,
    handleSubmit,
    isSubmitting: loginMutation.isPending,
    updateField,
    values,
  };
};
