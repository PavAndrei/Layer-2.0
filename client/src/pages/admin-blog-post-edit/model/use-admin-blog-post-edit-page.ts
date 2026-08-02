import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router';

import {
  toAdminBlogPostFormValues,
  useAdminBlogPost,
  useAdminBlogPostForm,
  useUpdateAdminBlogPost,
} from '../../../features/admin-blog-posts';

export const useAdminBlogPostEditPage = () => {
  const { blogPostId } = useParams<{ blogPostId: string }>();
  const blogPostQuery = useAdminBlogPost(blogPostId);
  const form = useAdminBlogPostForm();
  const updateBlogPostMutation = useUpdateAdminBlogPost();
  const initializedBlogPostIdRef = useRef<string | null>(null);
  const resetMutation = updateBlogPostMutation.reset;

  useEffect(() => {
    if (!blogPostQuery.blogPost) return;

    if (initializedBlogPostIdRef.current === blogPostQuery.blogPost._id) {
      return;
    }

    initializedBlogPostIdRef.current = blogPostQuery.blogPost._id;
    resetMutation();
    form.resetForm(toAdminBlogPostFormValues(blogPostQuery.blogPost));
  }, [
    blogPostQuery.blogPost,
    form,
    resetMutation,
  ]);

  const error = useMemo(() => {
    if (updateBlogPostMutation.data && !updateBlogPostMutation.data.success) {
      return updateBlogPostMutation.data.message;
    }

    if (updateBlogPostMutation.error instanceof Error) {
      return updateBlogPostMutation.error.message;
    }

    return null;
  }, [
    updateBlogPostMutation.data,
    updateBlogPostMutation.error,
  ]);

  const successMessage =
    updateBlogPostMutation.data?.success
      ? 'Your article changes have been saved.'
      : null;

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!blogPostId || updateBlogPostMutation.isPending) return;

      resetMutation();

      const validation = form.validateForm();

      if (!validation.success) return;

      updateBlogPostMutation.mutate({
        blogPostId,
        payload: validation.payload,
      });
    },
    [
      blogPostId,
      form,
      resetMutation,
      updateBlogPostMutation,
    ],
  );

  const handleReset = useCallback(() => {
    if (!blogPostQuery.blogPost || updateBlogPostMutation.isPending) return;

    resetMutation();
    form.resetForm(toAdminBlogPostFormValues(blogPostQuery.blogPost));
  }, [
    blogPostQuery.blogPost,
    form,
    resetMutation,
    updateBlogPostMutation.isPending,
  ]);

  return {
    blogPost: blogPostQuery.blogPost,
    blogPostId,
    error,
    fieldErrors: form.fieldErrors,
    isFetching: blogPostQuery.isFetching,
    isLoading: blogPostQuery.isLoading,
    isSubmitting: updateBlogPostMutation.isPending,
    loadError: blogPostQuery.error,
    onContentChange: form.updateContent,
    onCoverImageChange: form.updateCoverImage,
    onRefetch: blogPostQuery.refetch,
    onReset: handleReset,
    onSubmit: handleSubmit,
    onValueChange: form.updateField,
    successMessage,
    values: form.values,
  };
};

export type AdminBlogPostEditPageState = ReturnType<
  typeof useAdminBlogPostEditPage
>;
