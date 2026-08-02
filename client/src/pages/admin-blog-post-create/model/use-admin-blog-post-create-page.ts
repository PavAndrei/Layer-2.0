import { useCallback, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';

import {
  useAdminBlogPostForm,
  useCreateAdminBlogPost,
} from '../../../features/admin-blog-posts';

export const useAdminBlogPostCreatePage = () => {
  const navigate = useNavigate();
  const form = useAdminBlogPostForm();
  const createBlogPostMutation = useCreateAdminBlogPost();
  const resetMutation = createBlogPostMutation.reset;

  const error = useMemo(() => {
    if (createBlogPostMutation.data && !createBlogPostMutation.data.success) {
      return createBlogPostMutation.data.message;
    }

    if (createBlogPostMutation.error instanceof Error) {
      return createBlogPostMutation.error.message;
    }

    return null;
  }, [
    createBlogPostMutation.data,
    createBlogPostMutation.error,
  ]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (createBlogPostMutation.isPending) return;

      resetMutation();

      const validation = form.validateForm();

      if (!validation.success) return;

      createBlogPostMutation.mutate(validation.payload, {
        onSuccess: (response) => {
          if (!response.success) return;

          navigate('/admin?section=articles');
        },
      });
    },
    [
      createBlogPostMutation,
      form,
      navigate,
      resetMutation,
    ],
  );

  const handleReset = useCallback(() => {
    if (createBlogPostMutation.isPending) return;

    resetMutation();
    form.resetForm();
  }, [
    createBlogPostMutation.isPending,
    form,
    resetMutation,
  ]);

  return {
    error,
    fieldErrors: form.fieldErrors,
    isSubmitting: createBlogPostMutation.isPending,
    onContentChange: form.updateContent,
    onCoverImageChange: form.updateCoverImage,
    onReset: handleReset,
    onSubmit: handleSubmit,
    onValueChange: form.updateField,
    values: form.values,
  };
};

export type AdminBlogPostCreatePageState = ReturnType<
  typeof useAdminBlogPostCreatePage
>;
