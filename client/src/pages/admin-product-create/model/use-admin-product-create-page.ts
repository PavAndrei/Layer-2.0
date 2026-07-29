import { useCallback, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';

import {
  useAdminProductForm,
  useCreateAdminProduct,
} from '../../../features/admin-products';

export const useAdminProductCreatePage = () => {
  const navigate = useNavigate();
  const form = useAdminProductForm();
  const createProductMutation = useCreateAdminProduct();
  const resetMutation = createProductMutation.reset;

  const error = useMemo(() => {
    if (createProductMutation.data && !createProductMutation.data.success) {
      return createProductMutation.data.message;
    }

    if (createProductMutation.error instanceof Error) {
      return createProductMutation.error.message;
    }

    return null;
  }, [
    createProductMutation.data,
    createProductMutation.error,
  ]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (createProductMutation.isPending) return;

      resetMutation();

      const validation = form.validateForm();

      if (!validation.success) return;

      createProductMutation.mutate(validation.payload, {
        onSuccess: (response) => {
          if (!response.success) return;

          navigate('/admin?section=products');
        },
      });
    },
    [
      createProductMutation,
      form,
      navigate,
      resetMutation,
    ],
  );

  const handleReset = useCallback(() => {
    if (createProductMutation.isPending) return;

    resetMutation();
    form.resetForm();
  }, [
    createProductMutation.isPending,
    form,
    resetMutation,
  ]);

  return {
    error,
    fieldErrors: form.fieldErrors,
    isSubmitting: createProductMutation.isPending,
    onAddImage: form.addImage,
    onAddVariant: form.addVariant,
    onAudienceToggle: form.toggleAudience,
    onCategoryToggle: form.toggleCategory,
    onImageRemove: form.removeImage,
    onImageUpdate: form.updateImageField,
    onReset: handleReset,
    onSubmit: handleSubmit,
    onValueChange: form.updateField,
    onVariantRemove: form.removeVariant,
    onVariantUpdate: form.updateVariantField,
    values: form.values,
  };
};

export type AdminProductCreatePageState = ReturnType<
  typeof useAdminProductCreatePage
>;
