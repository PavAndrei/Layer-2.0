import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';

import { apiClient } from '../api-client';
import type { ApiResponse } from '../api-types';
import type {
  DeleteImageFromImageKitResponseData,
  ImageKitUploadAuthData,
  MediaUploadPurpose,
  RegisterMediaAssetPayload,
  RegisterMediaAssetResponseData,
  UploadedMediaAsset,
  UploadImageToImageKitOptions,
} from './media-types';

const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';

type ImageKitUploadResponse = UploadedMediaAsset & {
  versionInfo?: {
    id: string;
    name: string;
  };
};

type ImageKitErrorResponse = {
  message?: string;
};

export const getImageKitUploadAuth = (
  purpose: MediaUploadPurpose,
  signal?: AbortSignal,
) =>
  apiClient.post<ImageKitUploadAuthData, { purpose: MediaUploadPurpose }>({
    body: { purpose },
    path: '/media/imagekit-auth',
    signal,
    errorMessage: 'Failed to get image upload credentials',
  });

const getUploadErrorMessage = (data: unknown) => {
  const message =
    data && typeof data === 'object' && 'message' in data
      ? (data as ImageKitErrorResponse).message
      : null;

  if (
    typeof message === 'string'
  ) {
    return message;
  }

  return 'Failed to upload image';
};

const normalizeUploadResponse = (
  response: ImageKitUploadResponse,
): UploadedMediaAsset => ({
  fileId: response.fileId,
  filePath: response.filePath,
  fileType: response.fileType,
  height: response.height,
  name: response.name,
  size: response.size,
  thumbnailUrl: response.thumbnailUrl,
  url: response.url,
  width: response.width,
});

export const registerMediaAsset = (
  payload: RegisterMediaAssetPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<RegisterMediaAssetResponseData>> => {
  return apiClient.post<
    RegisterMediaAssetResponseData,
    RegisterMediaAssetPayload
  >({
    path: '/media/assets',
    body: payload,
    signal,
    errorMessage: 'Failed to register uploaded image',
  });
};

export const uploadImageToImageKit = async ({
  file,
  fileName = file.name,
  onProgress,
  purpose,
  signal,
}: UploadImageToImageKitOptions): Promise<
  ApiResponse<{ asset: UploadedMediaAsset }>
> => {
  const authResponse = await getImageKitUploadAuth(purpose, signal);

  if (!authResponse.success) {
    return authResponse;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);
  formData.append('publicKey', authResponse.data.auth.publicKey);
  formData.append('signature', authResponse.data.auth.signature);
  formData.append('expire', String(authResponse.data.auth.expire));
  formData.append('token', authResponse.data.auth.token);
  formData.append('folder', authResponse.data.upload.folder);
  formData.append(
    'useUniqueFileName',
    String(authResponse.data.upload.useUniqueFileName),
  );

  if (authResponse.data.upload.tags.length) {
    formData.append('tags', authResponse.data.upload.tags.join(','));
  }

  try {
    const response = await axios.post<ImageKitUploadResponse>(
      IMAGEKIT_UPLOAD_URL,
      formData,
      {
        headers: {
          Accept: 'application/json',
        },
        onUploadProgress: (event: AxiosProgressEvent) => {
          if (!event.total || !onProgress) return;

          onProgress(Math.round((event.loaded / event.total) * 100));
        },
        signal,
        validateStatus: () => true,
      },
    );

    if (response.status >= 400) {
      return {
        success: false,
        message: getUploadErrorMessage(response.data),
      };
    }

    const uploadedAsset = normalizeUploadResponse(response.data);
    const registerResponse = await registerMediaAsset(
      {
        ...uploadedAsset,
        purpose,
      },
      signal,
    );

    if (!registerResponse.success) {
      return registerResponse;
    }

    return {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        asset: registerResponse.data.asset,
      },
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      return {
        success: false,
        message: 'Image upload was canceled',
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
};

export const deleteImageFromImageKit = (
  fileId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<DeleteImageFromImageKitResponseData>> => {
  return apiClient.delete<DeleteImageFromImageKitResponseData>({
    path: `/media/imagekit-files/${encodeURIComponent(fileId)}`,
    signal,
    errorMessage: 'Failed to delete image',
  });
};
