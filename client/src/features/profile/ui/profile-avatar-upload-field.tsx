import { ImageUploadField } from '../../../shared/ui';
import type { ImageUploadFieldProps } from '../../../shared/ui';

type ProfileAvatarUploadFieldProps = Omit<
  ImageUploadFieldProps,
  'label' | 'previewVariant' | 'purpose'
> & {
  label?: string;
};

const PROFILE_AVATAR_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ProfileAvatarUploadField = ({
  allowedTypes = PROFILE_AVATAR_ALLOWED_TYPES,
  helperText = 'JPEG, PNG, or WebP. A square image works best.',
  label = 'Profile photo',
  maxSizeMb = 3,
  ...props
}: ProfileAvatarUploadFieldProps) => {
  return (
    <ImageUploadField
      {...props}
      allowedTypes={allowedTypes}
      helperText={helperText}
      label={label}
      maxSizeMb={maxSizeMb}
      previewVariant="avatar"
      purpose="user-avatar"
    />
  );
};

export type { ProfileAvatarUploadFieldProps };
