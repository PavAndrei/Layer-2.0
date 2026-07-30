import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router';

import {
  toAdminProductFormValues,
  useAdminProduct,
  useAdminProductForm,
  useUpdateAdminProduct,
} from '../../../features/admin-products';

export const useAdminProductEditPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const productQuery = useAdminProduct(productId);
  const form = useAdminProductForm();
  const updateProductMutation = useUpdateAdminProduct();
  const initializedProductIdRef = useRef<string | null>(null);
  const resetMutation = updateProductMutation.reset;

  useEffect(() => {
    if (!productQuery.product) return;

    if (initializedProductIdRef.current === productQuery.product._id) {
      return;
    }

    initializedProductIdRef.current = productQuery.product._id;
    resetMutation();
    form.resetForm(toAdminProductFormValues(productQuery.product));
  }, [
    form,
    productQuery.product,
    resetMutation,
  ]);

  const error = useMemo(() => {
    if (updateProductMutation.data && !updateProductMutation.data.success) {
      return updateProductMutation.data.message;
    }

    if (updateProductMutation.error instanceof Error) {
      return updateProductMutation.error.message;
    }

    return null;
  }, [
    updateProductMutation.data,
    updateProductMutation.error,
  ]);

  const successMessage =
    updateProductMutation.data?.success
      ? 'Your product changes have been saved.'
      : null;

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!productId || updateProductMutation.isPending) return;

      resetMutation();

      const validation = form.validateForm();

      if (!validation.success) return;

      updateProductMutation.mutate({
        payload: validation.payload,
        productId,
      });
    },
    [
      form,
      productId,
      resetMutation,
      updateProductMutation,
    ],
  );

  const handleReset = useCallback(() => {
    if (!productQuery.product || updateProductMutation.isPending) return;

    resetMutation();
    form.resetForm(toAdminProductFormValues(productQuery.product));
  }, [
    form,
    productQuery.product,
    resetMutation,
    updateProductMutation.isPending,
  ]);

  return {
    error,
    fieldErrors: form.fieldErrors,
    isFetching: productQuery.isFetching,
    isLoading: productQuery.isLoading,
    isSubmitting: updateProductMutation.isPending,
    loadError: productQuery.error,
    onAddImage: form.addImage,
    onAddVariant: form.addVariant,
    onAudienceToggle: form.toggleAudience,
    onCategoryToggle: form.toggleCategory,
    onImageRemove: form.removeImage,
    onImageUpdate: form.updateImageField,
    onRefetch: productQuery.refetch,
    onReset: handleReset,
    onSubmit: handleSubmit,
    onValueChange: form.updateField,
    onVariantRemove: form.removeVariant,
    onVariantUpdate: form.updateVariantField,
    product: productQuery.product,
    productId,
    successMessage,
    values: form.values,
  };
};

export type AdminProductEditPageState = ReturnType<
  typeof useAdminProductEditPage
>;
