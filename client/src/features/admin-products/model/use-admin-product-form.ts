import { useCallback, useMemo, useState } from 'react';

import type {
  ProductAudience,
  ProductImageRole,
  ProductSize,
  ProductStatus,
} from '../../../entities/product';
import type { CreateAdminProductPayload } from '../api';
import type {
  AdminProductFormErrors,
  AdminProductFormValues,
  AdminProductImageFormValues,
  AdminProductVariantFormValues,
} from './admin-product-form-types';
import {
  adminProductFormSchema,
  getAdminProductFormErrors,
  toCreateAdminProductPayload,
} from './admin-product-validation';

type AdminProductField = Exclude<
  keyof AdminProductFormValues,
  'audience' | 'categories' | 'images' | 'variants'
>;

type AdminProductVariantField = Exclude<
  keyof AdminProductVariantFormValues,
  'id'
>;

type AdminProductImageField = Exclude<
  keyof AdminProductImageFormValues,
  'id'
>;

type AdminProductFormValidationResult =
  | {
      errors: AdminProductFormErrors;
      payload: null;
      success: false;
    }
  | {
      errors: Record<string, never>;
      payload: CreateAdminProductPayload;
      success: true;
    };

const createFormItemId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createEmptyAdminProductVariant =
  (): AdminProductVariantFormValues => ({
    id: createFormItemId(),
    color: '',
    image: '',
    quantity: '0',
    size: 'M',
    sku: '',
  });

export const createEmptyAdminProductImage =
  (): AdminProductImageFormValues => ({
    id: createFormItemId(),
    alt: '',
    color: '',
    fileId: '',
    filePath: '',
    role: 'main',
    src: '',
  });

export const createInitialAdminProductFormValues =
  (): AdminProductFormValues => ({
    audience: ['unisex'],
    categories: [],
    defaultPrice: '',
    description: '',
    discountPrice: '',
    hasDiscount: false,
    images: [createEmptyAdminProductImage()],
    status: 'draft',
    title: '',
    variants: [createEmptyAdminProductVariant()],
  });

const removeValue = <Value extends string>(values: Value[], value: Value) =>
  values.filter((currentValue) => currentValue !== value);

const toggleValue = <Value extends string>(values: Value[], value: Value) =>
  values.includes(value) ? removeValue(values, value) : [...values, value];

export const useAdminProductForm = () => {
  const [values, setValues] = useState<AdminProductFormValues>(() =>
    createInitialAdminProductFormValues(),
  );
  const [fieldErrors, setFieldErrors] = useState<AdminProductFormErrors>({});

  const clearFieldError = useCallback((field: keyof AdminProductFormErrors) => {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }, []);

  const clearVariantFieldError = useCallback(
    (variantId: string, field: AdminProductVariantField) => {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        variants: undefined,
        variantItems: {
          ...currentErrors.variantItems,
          [variantId]: {
            ...currentErrors.variantItems?.[variantId],
            [field]: undefined,
          },
        },
      }));
    },
    [],
  );

  const clearImageFieldError = useCallback(
    (imageId: string, field: AdminProductImageField) => {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        images: undefined,
        imageItems: {
          ...currentErrors.imageItems,
          [imageId]: {
            ...currentErrors.imageItems?.[imageId],
            [field]: undefined,
          },
        },
      }));
    },
    [],
  );

  const updateField = useCallback(
    <Field extends AdminProductField>(
      field: Field,
      value: AdminProductFormValues[Field],
    ) => {
      clearFieldError(field);

      setValues((currentValues) => ({
        ...currentValues,
        [field]: value,
      }));
    },
    [clearFieldError],
  );

  const toggleCategory = useCallback(
    (category: string) => {
      clearFieldError('categories');

      setValues((currentValues) => ({
        ...currentValues,
        categories: toggleValue(currentValues.categories, category),
      }));
    },
    [clearFieldError],
  );

  const toggleAudience = useCallback(
    (audience: ProductAudience) => {
      clearFieldError('audience');

      setValues((currentValues) => ({
        ...currentValues,
        audience: toggleValue(currentValues.audience, audience),
      }));
    },
    [clearFieldError],
  );

  const addVariant = useCallback(
    (variant: Partial<AdminProductVariantFormValues> = {}) => {
      clearFieldError('variants');

      setValues((currentValues) => ({
        ...currentValues,
        variants: [
          ...currentValues.variants,
          {
            ...createEmptyAdminProductVariant(),
            ...variant,
            id: variant.id ?? createFormItemId(),
          },
        ],
      }));
    },
    [clearFieldError],
  );

  const removeVariant = useCallback((variantId: string) => {
    setFieldErrors((currentErrors) => {
      const variantItems = {
        ...(currentErrors.variantItems ?? {}),
      };

      delete variantItems[variantId];

      return {
        ...currentErrors,
        variantItems,
        variants: undefined,
      };
    });

    setValues((currentValues) => ({
      ...currentValues,
      variants: currentValues.variants.filter(
        (variant) => variant.id !== variantId,
      ),
    }));
  }, []);

  const updateVariantField = useCallback(
    <Field extends AdminProductVariantField>(
      variantId: string,
      field: Field,
      value: AdminProductVariantFormValues[Field],
    ) => {
      clearVariantFieldError(variantId, field);

      setValues((currentValues) => ({
        ...currentValues,
        variants: currentValues.variants.map((variant) =>
          variant.id === variantId
            ? {
                ...variant,
                [field]: value,
              }
            : variant,
        ),
      }));
    },
    [clearVariantFieldError],
  );

  const addImage = useCallback(
    (image: Partial<AdminProductImageFormValues> = {}) => {
      clearFieldError('images');

      setValues((currentValues) => ({
        ...currentValues,
        images: [
          ...currentValues.images,
          {
            ...createEmptyAdminProductImage(),
            ...image,
            id: image.id ?? createFormItemId(),
          },
        ],
      }));
    },
    [clearFieldError],
  );

  const removeImage = useCallback((imageId: string) => {
    setFieldErrors((currentErrors) => {
      const imageItems = {
        ...(currentErrors.imageItems ?? {}),
      };

      delete imageItems[imageId];

      return {
        ...currentErrors,
        imageItems,
        images: undefined,
      };
    });

    setValues((currentValues) => ({
      ...currentValues,
      images: currentValues.images.filter((image) => image.id !== imageId),
    }));
  }, []);

  const updateImageField = useCallback(
    <Field extends AdminProductImageField>(
      imageId: string,
      field: Field,
      value: AdminProductImageFormValues[Field],
    ) => {
      clearImageFieldError(imageId, field);

      setValues((currentValues) => ({
        ...currentValues,
        images: currentValues.images.map((image) =>
          image.id === imageId
            ? {
                ...image,
                [field]: value,
              }
            : image,
        ),
      }));
    },
    [clearImageFieldError],
  );

  const setVariantSize = useCallback(
    (variantId: string, size: ProductSize) => {
      updateVariantField(variantId, 'size', size);
    },
    [updateVariantField],
  );

  const setImageRole = useCallback(
    (imageId: string, role: ProductImageRole) => {
      updateImageField(imageId, 'role', role);
    },
    [updateImageField],
  );

  const setStatus = useCallback(
    (status: ProductStatus) => {
      updateField('status', status);
    },
    [updateField],
  );

  const resetForm = useCallback((nextValues?: AdminProductFormValues) => {
    setValues(nextValues ?? createInitialAdminProductFormValues());
    setFieldErrors({});
  }, []);

  const validateForm = useCallback((): AdminProductFormValidationResult => {
    const result = adminProductFormSchema.safeParse(values);

    if (!result.success) {
      const errors = getAdminProductFormErrors(result.error, values);

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
      payload: toCreateAdminProductPayload(result.data),
      success: true,
    };
  }, [values]);

  const payload = useMemo(() => {
    const result = adminProductFormSchema.safeParse(values);

    return result.success ? toCreateAdminProductPayload(result.data) : null;
  }, [values]);

  const hasFilledCoreFields = Boolean(
    values.title.trim() &&
      values.description.trim() &&
      values.defaultPrice.trim() &&
      values.categories.length > 0 &&
      values.audience.length > 0,
  );

  return {
    addImage,
    addVariant,
    fieldErrors,
    hasFilledCoreFields,
    payload,
    removeImage,
    removeVariant,
    resetForm,
    setImageRole,
    setStatus,
    setVariantSize,
    toggleAudience,
    toggleCategory,
    updateField,
    updateImageField,
    updateVariantField,
    validateForm,
    values,
  };
};
