import { ImageUploadField } from '../../../shared/ui';
import type { ImageUploadFieldProps } from '../../../shared/ui';

type AdminBlogPostCoverUploadFieldProps = Omit<
  ImageUploadFieldProps,
  'label' | 'purpose'
> & {
  label?: string;
};

const BLOG_COVER_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const AdminBlogPostCoverUploadField = ({
  allowedTypes = BLOG_COVER_ALLOWED_TYPES,
  helperText = 'JPEG, PNG, or WebP. Wide images work best for article covers.',
  label = 'Cover image',
  maxSizeMb = 8,
  previewVariant = 'wide',
  ...props
}: AdminBlogPostCoverUploadFieldProps) => (
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
