import type { FormEvent } from 'react';

import type { UploadedMediaAsset } from '../../../shared/api';
import {
  Button,
  FeedbackMessage,
  SelectFilter,
  TextInput,
  type SelectFilterOption,
} from '../../../shared/ui';
import type {
  BlogPostContentJson,
  BlogPostStatus,
} from '../api';
import type {
  AdminBlogPostCoverImageFormValues,
  AdminBlogPostFormErrors,
  AdminBlogPostFormValues,
} from '../model';
import { AdminBlogPostCoverUploadField } from './admin-blog-post-cover-upload-field';
import { AdminBlogPostEditor } from './admin-blog-post-editor';
import { AdminBlogPostRelatedProductsField } from './admin-blog-post-related-products-field';

type AdminBlogPostFormProps = {
  error: string | null;
  errorTitle?: string;
  fieldErrors: AdminBlogPostFormErrors;
  isSubmitting: boolean;
  resetLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
  successMessage?: string | null;
  values: AdminBlogPostFormValues;
  onContentChange: (value: {
    contentHtml: string;
    contentJson: BlogPostContentJson;
  }) => void;
  onCoverImageChange: (
    coverImage: AdminBlogPostCoverImageFormValues | null,
  ) => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValueChange: <Field extends keyof Omit<
    AdminBlogPostFormValues,
    'contentJson' | 'coverImage'
  >>(
    field: Field,
    value: AdminBlogPostFormValues[Field],
  ) => void;
};

const statusOptions: readonly SelectFilterOption<BlogPostStatus>[] = [
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
];

const getOption = <Value extends string>(
  options: readonly SelectFilterOption<Value>[],
  value: Value,
) => options.find((option) => option.value === value) ?? options[0];

const getCoverAsset = (
  coverImage: AdminBlogPostCoverImageFormValues | null,
): UploadedMediaAsset | null => {
  if (!coverImage?.src) return null;

  return {
    fileId: coverImage.fileId,
    filePath: coverImage.filePath || coverImage.src,
    fileType: 'image',
    name: coverImage.alt || 'Article cover',
    size: 0,
    url: coverImage.src,
  };
};

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
      className={`min-h-28 w-full resize-y rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60 ${
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

export const AdminBlogPostForm = ({
  error,
  errorTitle = 'Article could not be created',
  fieldErrors,
  isSubmitting,
  onContentChange,
  onCoverImageChange,
  onReset,
  onSubmit,
  onValueChange,
  resetLabel = 'Reset',
  submitLabel = 'Create article',
  submittingLabel = 'Creating...',
  successMessage = null,
  values,
}: AdminBlogPostFormProps) => (
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
        title="Article saved"
        description={successMessage}
      />
    )}

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <FieldsetHeader
        title="Article"
        description="Set the title, slug, excerpt, and publication status."
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <TextInput
          required
          error={fieldErrors.title}
          id="admin-blog-post-title"
          label="Title"
          placeholder="Summer guide"
          value={values.title}
          onChange={(value) => onValueChange('title', value)}
        />
        <SelectFilter
          id="admin-blog-post-status"
          label="Status"
          options={statusOptions}
          value={getOption(statusOptions, values.status)}
          onChange={(option) =>
            onValueChange('status', option?.value ?? 'draft')
          }
        />
      </div>
      <TextInput
        error={fieldErrors.slug}
        id="admin-blog-post-slug"
        label="Slug"
        placeholder="summer-guide"
        value={values.slug}
        onChange={(value) => onValueChange('slug', value)}
      />
      <TextAreaField
        error={fieldErrors.excerpt}
        id="admin-blog-post-excerpt"
        label="Excerpt"
        placeholder="Short summary for article cards"
        value={values.excerpt}
        onChange={(value) => onValueChange('excerpt', value)}
      />
    </section>

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <FieldsetHeader
        title="Cover"
        description="Attach a cover image and alt text for article previews."
      />
      <AdminBlogPostCoverUploadField
        error={fieldErrors.coverImage}
        previewAlt={values.coverImage?.alt}
        value={getCoverAsset(values.coverImage)}
        onChange={(asset) =>
          onCoverImageChange(
            asset
              ? {
                  alt: values.coverImage?.alt || values.title || asset.name,
                  fileId: asset.fileId,
                  filePath: asset.filePath,
                  src: asset.url,
                }
              : null,
          )
        }
      />
      {values.coverImage && (
        <TextInput
          error={fieldErrors.coverImage}
          id="admin-blog-post-cover-alt"
          label="Cover alt text"
          value={values.coverImage.alt}
          onChange={(value) =>
            onCoverImageChange({
              ...values.coverImage!,
              alt: value,
            })
          }
        />
      )}
    </section>

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <FieldsetHeader
        title="Related products"
        description="Choose storefront products that should appear with this article."
      />
      <AdminBlogPostRelatedProductsField
        disabled={isSubmitting}
        error={fieldErrors.relatedProductIds}
        value={values.relatedProductIds}
        onChange={(productIds) =>
          onValueChange('relatedProductIds', productIds)
        }
      />
    </section>

    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <FieldsetHeader
        title="Content"
        description="Write and format the article body."
      />
      <AdminBlogPostEditor
        error={fieldErrors.contentHtml}
        value={values.contentJson}
        onChange={onContentChange}
      />
    </section>

    <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-4 sm:flex-row sm:justify-end">
      <Button
        disabled={isSubmitting}
        type="button"
        variant="secondary"
        onClick={onReset}
      >
        {resetLabel}
      </Button>
      <Button disabled={isSubmitting} type="submit" variant="primary">
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </div>
  </form>
);
