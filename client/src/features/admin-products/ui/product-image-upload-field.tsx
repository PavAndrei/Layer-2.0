import { ImageUploadField } from '../../../shared/ui';
import type { ImageUploadFieldProps } from '../../../shared/ui';

type ProductImageUploadFieldProps = Omit<
  ImageUploadFieldProps,
  'label' | 'purpose'
> & {
  label?: string;
};

const PRODUCT_IMAGE_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ProductImageUploadField = ({
  allowedTypes = PRODUCT_IMAGE_ALLOWED_TYPES,
  helperText = 'JPEG, PNG, or WebP. Use square or clean catalog images for best results.',
  label = 'Product image',
  maxSizeMb = 8,
  previewVariant = 'square',
  ...props
}: ProductImageUploadFieldProps) => {
  return (
    <ImageUploadField
      {...props}
      allowedTypes={allowedTypes}
      helperText={helperText}
      label={label}
      maxSizeMb={maxSizeMb}
      previewVariant={previewVariant}
      purpose="product-image"
    />
  );
};

export type { ProductImageUploadFieldProps };
