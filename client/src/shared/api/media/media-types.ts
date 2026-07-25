export type MediaUploadPurpose = 'product-image' | 'user-avatar';

export type ImageKitUploadAuth = {
  expire: number;
  publicKey: string;
  signature: string;
  token: string;
};

export type ImageKitUploadAuthData = {
  auth: ImageKitUploadAuth;
  upload: {
    folder: string;
    tags: string[];
    useUniqueFileName: boolean;
  };
  urlEndpoint: string;
};

export type UploadedMediaAsset = {
  fileId: string;
  filePath: string;
  fileType: string;
  height?: number;
  name: string;
  size: number;
  thumbnailUrl?: string;
  url: string;
  width?: number;
};

export type UploadImageToImageKitOptions = {
  file: File;
  fileName?: string;
  onProgress?: (progress: number) => void;
  purpose: MediaUploadPurpose;
  signal?: AbortSignal;
};
