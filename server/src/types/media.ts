export const MEDIA_UPLOAD_PURPOSES = [
  'product-image',
  'user-avatar',
  'blog-image',
] as const;
export const MEDIA_ASSET_OWNER_TYPES = [
  'blog-post',
  'product',
  'user',
] as const;
export const MEDIA_ASSET_STATUSES = [
  'attached',
  'deleted',
  'delete-pending',
  'pending',
] as const;

export type MediaUploadPurpose = (typeof MEDIA_UPLOAD_PURPOSES)[number];
export type MediaAssetOwnerType = (typeof MEDIA_ASSET_OWNER_TYPES)[number];
export type MediaAssetStatus = (typeof MEDIA_ASSET_STATUSES)[number];

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
