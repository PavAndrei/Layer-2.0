import { useCallback, useMemo, useState } from 'react';

import type {
  BlogPostContentJson,
  BlogPostStatus,
  CreateAdminBlogPostPayload,
} from '../api';
import type {
  AdminBlogPostCoverImageFormValues,
  AdminBlogPostFormErrors,
  AdminBlogPostFormValues,
} from './admin-blog-post-form-types';
import { createEmptyBlogPostContentJson } from './admin-blog-post-form-mappers';
import {
  adminBlogPostFormSchema,
  getAdminBlogPostFormErrors,
  toCreateAdminBlogPostPayload,
} from './admin-blog-post-validation';

type AdminBlogPostField = Exclude<
  keyof AdminBlogPostFormValues,
  'contentJson' | 'coverImage'
>;

type AdminBlogPostFormValidationResult =
  | {
      errors: AdminBlogPostFormErrors;
      payload: null;
      success: false;
    }
  | {
      errors: Record<string, never>;
      payload: CreateAdminBlogPostPayload;
      success: true;
    };

export const createInitialAdminBlogPostFormValues =
  (): AdminBlogPostFormValues => ({
    contentHtml: '',
    contentJson: createEmptyBlogPostContentJson(),
    coverImage: null,
    excerpt: '',
    relatedProductIds: [],
    slug: '',
    status: 'draft',
    tags: [],
    title: '',
  });

export const useAdminBlogPostForm = () => {
  const [values, setValues] = useState<AdminBlogPostFormValues>(() =>
    createInitialAdminBlogPostFormValues(),
  );
  const [fieldErrors, setFieldErrors] = useState<AdminBlogPostFormErrors>({});

  const clearFieldError = useCallback(
    (field: keyof AdminBlogPostFormErrors) => {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    },
    [],
  );

  const updateField = useCallback(
    <Field extends AdminBlogPostField>(
      field: Field,
      value: AdminBlogPostFormValues[Field],
    ) => {
      clearFieldError(field);

      setValues((currentValues) => ({
        ...currentValues,
        [field]: value,
      }));
    },
    [clearFieldError],
  );

  const updateCoverImage = useCallback(
    (coverImage: AdminBlogPostCoverImageFormValues | null) => {
      clearFieldError('coverImage');

      setValues((currentValues) => ({
        ...currentValues,
        coverImage,
      }));
    },
    [clearFieldError],
  );

  const updateContent = useCallback(
    ({
      contentHtml,
      contentJson,
    }: {
      contentHtml: string;
      contentJson: BlogPostContentJson;
    }) => {
      clearFieldError('contentHtml');
      clearFieldError('contentJson');

      setValues((currentValues) => ({
        ...currentValues,
        contentHtml,
        contentJson,
      }));
    },
    [clearFieldError],
  );

  const setStatus = useCallback(
    (status: BlogPostStatus) => {
      updateField('status', status);
    },
    [updateField],
  );

  const resetForm = useCallback((nextValues?: AdminBlogPostFormValues) => {
    setValues(nextValues ?? createInitialAdminBlogPostFormValues());
    setFieldErrors({});
  }, []);

  const validateForm = useCallback((): AdminBlogPostFormValidationResult => {
    const result = adminBlogPostFormSchema.safeParse(values);

    if (!result.success) {
      const errors = getAdminBlogPostFormErrors(result.error);

      setFieldErrors(errors);

      return {
        errors,
        payload: null,
        success: false,
      };
    }

    setFieldErrors({});

    return {
      errors: {},
      payload: toCreateAdminBlogPostPayload(result.data),
      success: true,
    };
  }, [values]);

  const payload = useMemo(() => {
    const result = adminBlogPostFormSchema.safeParse(values);

    return result.success ? toCreateAdminBlogPostPayload(result.data) : null;
  }, [values]);

  return {
    fieldErrors,
    payload,
    resetForm,
    setStatus,
    updateContent,
    updateCoverImage,
    updateField,
    validateForm,
    values,
  };
};
