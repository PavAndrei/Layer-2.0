import type { FormEvent } from 'react';

import {
  CATEGORIES_COLLECTION,
  PRODUCT_AUDIENCES,
  PRODUCT_IMAGE_ROLES,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_STATUSES,
  type ProductAudience,
  type ProductImageRole,
  type ProductSize,
  type ProductStatus,
} from '../../../entities/product';
import {
  Button,
  FeedbackMessage,
  MultiSelectFilter,
  SelectFilter,
  TextInput,
  type SelectFilterOption,
} from '../../../shared/ui';
import type {
  AdminProductFormErrors,
  AdminProductFormValues,
  AdminProductImageFormValues,
  AdminProductVariantFormValues,
} from '../model';

type AdminProductFormProps = {
  error: string | null;
  errorTitle?: string;
  fieldErrors: AdminProductFormErrors;
  isSubmitting: boolean;
  resetLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
  successMessage?: string | null;
  values: AdminProductFormValues;
  onAddImage: () => void;
  onAddVariant: () => void;
  onAudienceToggle: (audience: ProductAudience) => void;
  onCategoryToggle: (category: string) => void;
  onImageRemove: (imageId: string) => void;
  onImageUpdate: <Field extends keyof Omit<AdminProductImageFormValues, 'id'>>(
    imageId: string,
    field: Field,
    value: AdminProductImageFormValues[Field],
  ) => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValueChange: <Field extends keyof Omit<
    AdminProductFormValues,
    'audience' | 'categories' | 'images' | 'variants'
  >>(
    field: Field,
    value: AdminProductFormValues[Field],
  ) => void;
  onVariantRemove: (variantId: string) => void;
  onVariantUpdate: <Field extends keyof Omit<AdminProductVariantFormValues, 'id'>>(
    variantId: string,
    field: Field,
    value: AdminProductVariantFormValues[Field],
  ) => void;
};

const audienceOptions: readonly SelectFilterOption<ProductAudience>[] =
  PRODUCT_AUDIENCES.map((audience) => ({
    label: audience[0].toUpperCase() + audience.slice(1),
    value: audience,
  }));

const statusOptions: readonly SelectFilterOption<ProductStatus>[] =
  PRODUCT_STATUSES.map((status) => ({
    label: status[0].toUpperCase() + status.slice(1),
    value: status,
  }));

const imageRoleOptions: readonly SelectFilterOption<ProductImageRole>[] =
  PRODUCT_IMAGE_ROLES.map((role) => ({
    label: role[0].toUpperCase() + role.slice(1),
    value: role,
  }));

const getSelectedOptions = <Value extends string>(
  options: readonly SelectFilterOption<Value>[],
  values: readonly Value[],
) => options.filter((option) => values.includes(option.value));

const getOption = <Value extends string>(
  options: readonly SelectFilterOption<Value>[],
  value: Value,
) => options.find((option) => option.value === value) ?? options[0];

const TextAreaField = ({
  error,
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  error?: string;
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    <label className="block-medium text-typography-heading" htmlFor={id}>
      {label}
    </label>
    <textarea
      id={id}
      className={`min-h-36 w-full resize-y rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60 ${
        error ? 'border-red-600' : 'border-border-strong'
      }`}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={Boolean(error)}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {error && (
      <p id={`${id}-error`} className="block-small text-red-600">
        {error}
      </p>
    )}
  </div>
);

const FieldsetHeader = ({
  description,
  title,
}: {
  description: string;
  title: string;
}) => (
  <div className="flex flex-col gap-1">
    <h3 className="block-title text-typography-heading">{title}</h3>
    <p className="block-small text-typography-secondary">{description}</p>
  </div>
);

export const AdminProductForm = ({
  error,
  errorTitle = 'Product could not be created',
  fieldErrors,
  isSubmitting,
  onAddImage,
  onAddVariant,
  onAudienceToggle,
  onCategoryToggle,
  onImageRemove,
  onImageUpdate,
  onReset,
  onSubmit,
  onValueChange,
  onVariantRemove,
  onVariantUpdate,
  resetLabel = 'Reset',
  submitLabel = 'Create product',
  submittingLabel = 'Creating...',
  successMessage = null,
  values,
}: AdminProductFormProps) => (
  <form className="flex flex-col gap-6" noValidate onSubmit={onSubmit}>
    {error && (
      <FeedbackMessage
        tone="danger"
        title={errorTitle}
        description={error}
      />
    )}
    {successMessage && (
      <FeedbackMessage
        title="Product saved"
        description={successMessage}
      />
    )}

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <FieldsetHeader
        title="Basic info"
        description="Name the product, set publication status, and add the catalog description."
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <TextInput
          required
          id="admin-product-title"
          label="Title"
          placeholder="Archive Utility Jacket"
          error={fieldErrors.title}
          value={values.title}
          onChange={(value) => onValueChange('title', value)}
        />
        <SelectFilter
          id="admin-product-status"
          label="Status:"
          options={statusOptions}
          value={getOption(statusOptions, values.status)}
          onChange={(option) =>
            onValueChange('status', option?.value ?? 'draft')
          }
        />
      </div>
      <TextAreaField
        id="admin-product-description"
        label="Description"
        placeholder="A structured everyday layer with utility pockets, relaxed fit, and durable fabric for transitional weather."
        error={fieldErrors.description}
        value={values.description}
        onChange={(value) => onValueChange('description', value)}
      />
    </section>

    <section className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
        <FieldsetHeader
          title="Catalog"
          description="Choose where the product appears in admin and storefront navigation."
        />
        <MultiSelectFilter
          id="admin-product-categories"
          label="Categories"
          options={CATEGORIES_COLLECTION}
          value={getSelectedOptions(CATEGORIES_COLLECTION, values.categories)}
          onChange={(options) => {
            options.forEach((option) => {
              if (!values.categories.includes(option.value)) {
                onCategoryToggle(option.value);
              }
            });
            values.categories.forEach((category) => {
              if (!options.some((option) => option.value === category)) {
                onCategoryToggle(category);
              }
            });
          }}
        />
        {fieldErrors.categories && (
          <p className="block-small text-red-600">{fieldErrors.categories}</p>
        )}

        <MultiSelectFilter
          id="admin-product-audience"
          label="Audience"
          options={audienceOptions}
          value={getSelectedOptions(audienceOptions, values.audience)}
          onChange={(options) => {
            options.forEach((option) => {
              if (!values.audience.includes(option.value)) {
                onAudienceToggle(option.value);
              }
            });
            values.audience.forEach((audience) => {
              if (!options.some((option) => option.value === audience)) {
                onAudienceToggle(audience);
              }
            });
          }}
        />
        {fieldErrors.audience && (
          <p className="block-small text-red-600">{fieldErrors.audience}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
        <FieldsetHeader
          title="Pricing"
          description="Set base price and optional sale price. Discount percent is calculated on the backend."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            required
            id="admin-product-default-price"
            label="Default price"
            type="number"
            min={0}
            step="0.01"
            placeholder="129.00"
            error={fieldErrors.defaultPrice}
            value={values.defaultPrice}
            onChange={(value) => onValueChange('defaultPrice', value)}
          />
          <TextInput
            id="admin-product-discount-price"
            label="Discount price"
            type="number"
            min={0}
            step="0.01"
            disabled={!values.hasDiscount}
            placeholder="99.00"
            error={fieldErrors.discountPrice}
            value={values.discountPrice}
            onChange={(value) => onValueChange('discountPrice', value)}
          />
        </div>
        <label className="flex items-start gap-3 rounded border border-border-soft bg-background-primary p-3">
          <input
            checked={values.hasDiscount}
            className="mt-1 size-4 rounded border-border-strong accent-accent-primary"
            type="checkbox"
            onChange={(event) =>
              onValueChange('hasDiscount', event.target.checked)
            }
          />
          <span className="flex flex-col gap-1">
            <span className="block-medium text-typography-heading">
              Enable discount
            </span>
            <span className="block-small text-typography-secondary">
              The storefront will use the discount price as the active price.
            </span>
          </span>
        </label>
      </div>
    </section>

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <FieldsetHeader
          title="Variants"
          description="Add size, color, SKU, stock, and an optional image for each purchasable option."
        />
        <Button size="sm" variant="secondary" onClick={onAddVariant}>
          Add variant
        </Button>
      </div>
      {fieldErrors.variants && (
        <p className="block-small text-red-600">{fieldErrors.variants}</p>
      )}
      <div className="flex flex-col gap-3">
        {values.variants.map((variant, index) => {
          const errors = fieldErrors.variantItems?.[variant.id] ?? {};

          return (
            <article
              key={variant.id}
              className="grid gap-4 rounded border border-border-soft bg-background-primary p-3 lg:grid-cols-[minmax(8rem,1fr)_9rem_minmax(8rem,1fr)_8rem_minmax(12rem,1.2fr)_auto]"
            >
              <TextInput
                id={`admin-product-variant-sku-${variant.id}`}
                label={`SKU ${index + 1}`}
                placeholder="LAYER-JACKET-BLK-M"
                error={errors.sku}
                value={variant.sku}
                onChange={(value) =>
                  onVariantUpdate(variant.id, 'sku', value)
                }
              />
              <SelectFilter
                id={`admin-product-variant-size-${variant.id}`}
                label="Size:"
                options={PRODUCT_SIZE_OPTIONS}
                value={getOption(
                  PRODUCT_SIZE_OPTIONS as readonly SelectFilterOption<ProductSize>[],
                  variant.size,
                )}
                onChange={(option) =>
                  onVariantUpdate(variant.id, 'size', option?.value ?? 'M')
                }
              />
              <TextInput
                id={`admin-product-variant-color-${variant.id}`}
                label="Color"
                placeholder="washed-black"
                error={errors.color}
                value={variant.color}
                onChange={(value) =>
                  onVariantUpdate(variant.id, 'color', value)
                }
              />
              <TextInput
                id={`admin-product-variant-quantity-${variant.id}`}
                label="Stock"
                type="number"
                min={0}
                step={1}
                placeholder="24"
                error={errors.quantity}
                value={variant.quantity}
                onChange={(value) =>
                  onVariantUpdate(variant.id, 'quantity', value)
                }
              />
              <TextInput
                id={`admin-product-variant-image-${variant.id}`}
                label="Image URL"
                placeholder="https://ik.imagekit.io/b3yhg2lkg/product-black-front.webp"
                error={errors.image}
                value={variant.image}
                onChange={(value) =>
                  onVariantUpdate(variant.id, 'image', value)
                }
              />
              <div className="flex items-end">
                <Button
                  disabled={values.variants.length <= 1}
                  size="sm"
                  variant="secondary"
                  onClick={() => onVariantRemove(variant.id)}
                >
                  Remove
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <FieldsetHeader
          title="Images"
          description="Add ImageKit URLs, alt text, image role, and optional color association."
        />
        <Button size="sm" variant="secondary" onClick={onAddImage}>
          Add image
        </Button>
      </div>
      {fieldErrors.images && (
        <p className="block-small text-red-600">{fieldErrors.images}</p>
      )}
      <div className="flex flex-col gap-3">
        {values.images.map((image, index) => {
          const errors = fieldErrors.imageItems?.[image.id] ?? {};

          return (
            <article
              key={image.id}
              className="grid gap-4 rounded border border-border-soft bg-background-primary p-3 lg:grid-cols-[minmax(14rem,1.4fr)_minmax(10rem,1fr)_9rem_minmax(8rem,0.8fr)_auto]"
            >
              <TextInput
                id={`admin-product-image-src-${image.id}`}
                label={`Image URL ${index + 1}`}
                placeholder="https://ik.imagekit.io/b3yhg2lkg/product-black-front.webp"
                error={errors.src}
                value={image.src}
                onChange={(value) =>
                  onImageUpdate(image.id, 'src', value)
                }
              />
              <TextInput
                id={`admin-product-image-alt-${image.id}`}
                label="Alt text"
                placeholder="Archive Utility Jacket in washed black front view"
                error={errors.alt}
                value={image.alt}
                onChange={(value) =>
                  onImageUpdate(image.id, 'alt', value)
                }
              />
              <SelectFilter
                id={`admin-product-image-role-${image.id}`}
                label="Role:"
                options={imageRoleOptions}
                value={getOption(imageRoleOptions, image.role)}
                onChange={(option) =>
                  onImageUpdate(image.id, 'role', option?.value ?? 'front')
                }
              />
              <TextInput
                id={`admin-product-image-color-${image.id}`}
                label="Color"
                placeholder="washed-black"
                error={errors.color}
                value={image.color}
                onChange={(value) =>
                  onImageUpdate(image.id, 'color', value)
                }
              />
              <div className="flex items-end">
                <Button
                  disabled={values.images.length <= 1}
                  size="sm"
                  variant="secondary"
                  onClick={() => onImageRemove(image.id)}
                >
                  Remove
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>

    <div className="border-t border-border-soft bg-background-primary py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          className="w-full sm:w-fit"
          disabled={isSubmitting}
          variant="secondary"
          onClick={onReset}
        >
          {resetLabel}
        </Button>
        <Button
          className="w-full sm:w-fit"
          disabled={isSubmitting}
          type="submit"
          variant="primary"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </div>
  </form>
);
