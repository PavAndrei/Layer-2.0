import { ImageUploadField } from '../../../shared/ui';
import type { ImageUploadFieldProps } from '../../../shared/ui';

type BlogImageUploadFieldProps = Omit<
  ImageUploadFieldProps,
  'label' | 'purpose'
> & {
  label?: string;
};

const BLOG_IMAGE_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const BlogImageUploadField = ({
  allowedTypes = BLOG_IMAGE_ALLOWED_TYPES,
  helperText = 'JPEG, PNG, or WebP. Wide images work best for article covers.',
  label = 'Blog image',
  maxSizeMb = 8,
  previewVariant = 'wide',
  ...props
}: BlogImageUploadFieldProps) => {
  return (
    <ImageUploadField
      {...props}
      allowedTypes={allowedTypes}
      helperText={helperText}
      label={label}
      maxSizeMb={maxSizeMb}
      previewVariant={previewVariant}
      purpose="blog-image"
    />
  );
};

export type { BlogImageUploadFieldProps };
