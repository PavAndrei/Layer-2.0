export const MEDIA_UPLOAD_PURPOSES = ['product-image', 'user-avatar'] as const;

export type MediaUploadPurpose = (typeof MEDIA_UPLOAD_PURPOSES)[number];

export type ImageKitUploadAuth = {
  expire: number;
  publicKey: string;
  signature: string;
  token: string;
};

export type ImageKitUploadTarget = {
  folder: string;
  tags: string[];
  useUniqueFileName: boolean;
};
