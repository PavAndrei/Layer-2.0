import { useId, useRef, useState } from 'react';
import type { CSSProperties, ChangeEvent, ReactNode } from 'react';

import {
  deleteImageFromImageKit,
  type MediaUploadPurpose,
  type UploadedMediaAsset,
} from '../api';
import { useImageUpload } from '../hooks';
import { Button } from './button';

export type ImageUploadPreviewVariant = 'avatar' | 'square' | 'wide';

export type ImageUploadFieldProps = {
  allowedTypes?: readonly string[];
  buttonLabel?: string;
  cancelLabel?: string;
  className?: string;
  deleteOnRemove?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: ReactNode;
  label: string;
  maxSizeMb?: number;
  name?: string;
  onChange: (asset: UploadedMediaAsset | null) => void;
  onRemove?: (asset: UploadedMediaAsset) => void | Promise<void>;
  previewAlt?: string;
  previewVariant?: ImageUploadPreviewVariant;
  purpose: MediaUploadPurpose;
  removeLabel?: string;
  replaceLabel?: string;
  value?: UploadedMediaAsset | null;
};

const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

const previewClasses: Record<ImageUploadPreviewVariant, string> = {
  avatar: '',
  square: 'aspect-square w-32 rounded',
  wide: 'aspect-video w-full max-w-sm rounded',
};

const previewBaseStyles: Record<ImageUploadPreviewVariant, CSSProperties> = {
  avatar: {
    aspectRatio: '1 / 1',
    borderRadius: '9999px',
    clipPath: 'circle(50% at 50% 50%)',
    height: '6rem',
    width: '6rem',
  },
  square: {},
  wide: {},
};

const getAssetDisplayName = (asset: UploadedMediaAsset) =>
  asset.name || asset.filePath || asset.url;

export const ImageUploadField = ({
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  buttonLabel = 'Upload image',
  cancelLabel = 'Cancel',
  className = '',
  deleteOnRemove = false,
  disabled = false,
  error,
  helperText,
  label,
  maxSizeMb,
  name,
  onChange,
  onRemove,
  previewAlt,
  previewVariant = 'square',
  purpose,
  removeLabel = 'Remove',
  replaceLabel = 'Replace',
  value = null,
}: ImageUploadFieldProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const {
    cancel,
    error: uploadError,
    isUploading,
    progress,
    upload,
  } = useImageUpload({
    allowedTypes,
    maxSizeMb,
    purpose,
  });
  const isBusy = isUploading || isRemoving;
  const message = error ?? uploadError ?? removeError;
  const previewImageUrl =
    previewVariant === 'avatar'
      ? value?.url
      : value?.thumbnailUrl ?? value?.url;

  const resetInput = () => {
    if (!inputRef.current) return;

    inputRef.current.value = '';
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setRemoveError(null);

    if (!file) return;

    const asset = await upload(file);

    resetInput();

    if (!asset) return;

    onChange(asset);
  };

  const handleCancel = () => {
    cancel();
    resetInput();
  };

  const handleRemove = async () => {
    if (!value || isBusy) return;

    setRemoveError(null);
    setIsRemoving(true);

    try {
      if (deleteOnRemove && value.fileId) {
        const response = await deleteImageFromImageKit(value.fileId);

        if (!response.success) {
          setRemoveError(response.message);
          return;
        }
      }

      await onRemove?.(value);
      onChange(null);
      resetInput();
    } catch (removeError) {
      setRemoveError(
        removeError instanceof Error
          ? removeError.message
          : 'Failed to remove image',
      );
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className={['flex flex-col gap-3', className].join(' ')}>
      <label
        className="block-small text-typography-primary"
        htmlFor={inputId}
      >
        {label}
      </label>

      {value && (
        <div className="flex flex-col gap-2">
          <div
            role="img"
            aria-label={previewAlt ?? value.name}
            className={[
              'shrink-0 overflow-hidden border border-border-soft bg-background-secondary bg-cover bg-center bg-no-repeat',
              previewClasses[previewVariant],
            ].join(' ')}
            style={{
              ...previewBaseStyles[previewVariant],
              backgroundClip: 'padding-box',
              backgroundImage: previewImageUrl
                ? `url("${previewImageUrl}")`
                : undefined,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          />
          <p className="max-w-sm truncate block-small text-typography-secondary">
            {getAssetDisplayName(value)}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          id={inputId}
          accept={allowedTypes.join(',')}
          className="sr-only"
          disabled={disabled || isBusy}
          name={name}
          type="file"
          onChange={handleChange}
        />
        <Button
          disabled={disabled || isBusy}
          size="sm"
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
        >
          {value ? replaceLabel : buttonLabel}
        </Button>
        {isUploading && (
          <Button
            disabled={disabled}
            size="sm"
            type="button"
            variant="ghost"
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
        )}
        {value && !isUploading && (
          <Button
            disabled={disabled || isRemoving}
            size="sm"
            type="button"
            variant="ghost"
            onClick={handleRemove}
          >
            {isRemoving ? 'Removing...' : removeLabel}
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="flex max-w-sm flex-col gap-1">
          <div className="h-2 overflow-hidden rounded bg-background-secondary">
            <div
              className="h-full rounded bg-accent-primary transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="block-small text-typography-secondary">
            Uploading {progress}%
          </p>
        </div>
      )}

      {helperText && !message && (
        <p className="block-small text-typography-secondary">{helperText}</p>
      )}
      {message && <p className="block-small text-accent-secondary">{message}</p>}
    </div>
  );
};
