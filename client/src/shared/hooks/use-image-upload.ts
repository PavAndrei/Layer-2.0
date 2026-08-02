import { useCallback, useEffect, useRef, useState } from 'react';

import {
  uploadImageToImageKit,
  type MediaUploadPurpose,
  type UploadedMediaAsset,
} from '../api';

type UseImageUploadOptions = {
  allowedTypes?: readonly string[];
  maxSizeMb?: number;
  purpose: MediaUploadPurpose;
};

const BYTES_IN_MEGABYTE = 1024 * 1024;
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
const DEFAULT_MAX_SIZE_MB = 5;

const getUploadValidationError = (
  file: File,
  {
    allowedTypes,
    maxSizeMb,
  }: Required<Pick<UseImageUploadOptions, 'allowedTypes' | 'maxSizeMb'>>,
) => {
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `Image type must be one of: ${allowedTypes.join(', ')}`;
  }

  if (file.size > maxSizeMb * BYTES_IN_MEGABYTE) {
    return `Image must be ${maxSizeMb}MB or smaller`;
  }

  return null;
};

export const useImageUpload = ({
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
  purpose,
}: UseImageUploadOptions) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const uploadIdRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    uploadIdRef.current += 1;
    setIsUploading(false);
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const upload = useCallback(
    async (file: File): Promise<UploadedMediaAsset | null> => {
      const validationError = getUploadValidationError(file, {
        allowedTypes,
        maxSizeMb,
      });

      if (validationError) {
        setError(validationError);
        setProgress(0);
        return null;
      }

      abortControllerRef.current?.abort();

      const abortController = new AbortController();
      const uploadId = uploadIdRef.current + 1;

      abortControllerRef.current = abortController;
      uploadIdRef.current = uploadId;
      setError(null);
      setIsUploading(true);
      setProgress(0);

      const response = await uploadImageToImageKit({
        file,
        onProgress: (nextProgress) => {
          if (uploadIdRef.current !== uploadId) return;

          setProgress(nextProgress);
        },
        purpose,
        signal: abortController.signal,
      });

      if (uploadIdRef.current !== uploadId) {
        return null;
      }

      abortControllerRef.current = null;
      setIsUploading(false);

      if (!response.success) {
        setError(response.message);
        setProgress(0);
        return null;
      }

      setProgress(100);

      return response.data.asset;
    },
    [
      allowedTypes,
      maxSizeMb,
      purpose,
    ],
  );

  return {
    cancel,
    error,
    isUploading,
    progress,
    upload,
  };
};
