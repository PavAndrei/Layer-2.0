import { createHmac, randomUUID } from 'crypto';
import { Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { MediaAsset } from '../models/media-assets.model';
import type { UserRole } from '../types/user';
import type {
  ImageKitUploadAuth,
  ImageKitUploadTarget,
  MediaAssetOwnerType,
  MediaUploadPurpose,
  UploadedMediaAsset,
} from '../types/media';
import type { CreateMediaAssetBody } from '../validators/media.validators';

const IMAGEKIT_AUTH_EXPIRES_IN_SECONDS = 30 * 60;
const IMAGEKIT_API_URL = 'https://api.imagekit.io';

type ImageKitConfig = {
  privateKey: string;
  publicKey: string;
  urlEndpoint: string;
};

type ImageKitUploadAuthParams = {
  purpose: MediaUploadPurpose;
  userId: string;
  userRole: UserRole;
};

type AttachMediaAssetsParams = {
  fileIds: string[];
  ownerId: string | Types.ObjectId;
  ownerType: MediaAssetOwnerType;
  purpose?: MediaUploadPurpose;
  uploadedBy?: string | Types.ObjectId;
};

type CleanupPendingMediaAssetsOptions = {
  dryRun?: boolean;
  limit?: number;
  olderThanMs: number;
};

type DeleteImageKitFileForUserParams = {
  fileId: string;
  userId: string | Types.ObjectId;
  userRole: UserRole;
};

type CleanupPendingMediaAssetItem = {
  createdAt: string;
  fileId: string;
  filePath: string;
  purpose: MediaUploadPurpose;
  url: string;
};

type CleanupPendingMediaAssetFailure = CleanupPendingMediaAssetItem & {
  message: string;
};

export type CleanupPendingMediaAssetsResult = {
  candidates: CleanupPendingMediaAssetItem[];
  candidatesCount: number;
  cutoff: string;
  deletedCount: number;
  dryRun: boolean;
  failedCount: number;
  failures: CleanupPendingMediaAssetFailure[];
  limit: number;
  olderThanMs: number;
};

const ensureUploadPurposeAccess = ({
  purpose,
  userRole,
}: Pick<ImageKitUploadAuthParams, 'purpose' | 'userRole'>) => {
  if (purpose === 'product-image' && userRole !== 'admin') {
    throw ApiError.Forbidden('Only admins can upload product images');
  }

  if (purpose === 'blog-image' && userRole !== 'admin') {
    throw ApiError.Forbidden('Only admins can upload blog images');
  }
};

const getImageKitConfig = (): ImageKitConfig => {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!privateKey || !publicKey || !urlEndpoint) {
    throw ApiError.ServiceUnavailable('Image upload is not configured');
  }

  return {
    privateKey,
    publicKey,
    urlEndpoint,
  };
};

const getImageKitApiAuthHeader = (privateKey: string) =>
  `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`;

const getImageKitErrorMessage = async (response: Response) => {
  try {
    const data = await response.json() as { message?: unknown };

    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
  } catch {
    // ImageKit may return an empty body for some errors.
  }

  return 'Failed to delete image';
};

const getUploadTarget = ({
  purpose,
  userId,
  userRole,
}: ImageKitUploadAuthParams): ImageKitUploadTarget => {
  switch (purpose) {
    case 'product-image':
      ensureUploadPurposeAccess({ purpose, userRole });

      return {
        folder: '/layer/products',
        tags: ['product'],
        useUniqueFileName: true,
      };

    case 'blog-image':
      ensureUploadPurposeAccess({ purpose, userRole });

      return {
        folder: '/layer/blog',
        tags: ['blog'],
        useUniqueFileName: true,
      };

    case 'user-avatar':
      return {
        folder: `/layer/users/${userId}/avatar`,
        tags: ['avatar', `user-${userId}`],
        useUniqueFileName: true,
      };
  }
};

export const getImageKitUploadAuth = (params: ImageKitUploadAuthParams) => {
  const { privateKey, publicKey, urlEndpoint } = getImageKitConfig();
  const upload = getUploadTarget(params);
  const token = randomUUID();
  const expire =
    Math.floor(Date.now() / 1000) + IMAGEKIT_AUTH_EXPIRES_IN_SECONDS;
  const signature = createHmac('sha1', privateKey)
    .update(`${token}${expire}`)
    .digest('hex');

  return {
    auth: {
      expire,
      publicKey,
      signature,
      token,
    } satisfies ImageKitUploadAuth,
    upload,
    urlEndpoint,
  };
};

export const deleteImageKitFile = async (fileId: string): Promise<void> => {
  const { privateKey } = getImageKitConfig();
  const response = await fetch(
    `${IMAGEKIT_API_URL}/v1/files/${encodeURIComponent(fileId)}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: getImageKitApiAuthHeader(privateKey),
      },
      method: 'DELETE',
    },
  );

  if (response.status === 204) return;

  const message = await getImageKitErrorMessage(response);

  if (response.status === 404) {
    throw ApiError.NotFound(message || 'Image file not found');
  }

  if (response.status === 400) {
    throw ApiError.BadRequest(message);
  }

  if (response.status === 401 || response.status === 403) {
    throw ApiError.ServiceUnavailable('Image delete is not authorized');
  }

  if (response.status === 429) {
    throw ApiError.TooManyRequests('Image delete rate limit exceeded');
  }

  throw ApiError.ServiceUnavailable(message);
};

export const deleteImageKitFileForUser = async ({
  fileId,
  userId,
  userRole,
}: DeleteImageKitFileForUserParams): Promise<void> => {
  if (userRole === 'admin') {
    await deleteImageKitFile(fileId);
    await markMediaAssetsDeleted([fileId]);
    return;
  }

  const uploaderId =
    userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
  const mediaAsset = await MediaAsset.findOneAndUpdate(
    {
      fileId,
      purpose: 'user-avatar',
      status: 'pending',
      uploadedBy: uploaderId,
    },
    {
      $set: {
        status: 'delete-pending',
      },
    },
    {
      new: true,
    },
  );

  if (!mediaAsset) {
    throw ApiError.Forbidden('You can only delete your pending avatar uploads');
  }

  try {
    await deleteImageKitFile(fileId);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      await MediaAsset.updateOne(
        {
          _id: mediaAsset._id,
        },
        {
          $set: {
            status: 'pending',
          },
        },
      );

      throw error;
    }
  }

  await MediaAsset.updateOne(
    {
      _id: mediaAsset._id,
    },
    {
      $set: {
        deletedAt: new Date(),
        status: 'deleted',
      },
    },
  );
};

const mediaAssetToDto = (asset: {
  fileId: string;
  filePath: string;
  fileType: string;
  height?: number | null;
  name: string;
  size: number;
  thumbnailUrl?: string | null;
  url: string;
  width?: number | null;
}): UploadedMediaAsset => ({
  fileId: asset.fileId,
  filePath: asset.filePath,
  fileType: asset.fileType,
  height: asset.height ?? undefined,
  name: asset.name,
  size: asset.size,
  thumbnailUrl: asset.thumbnailUrl ?? undefined,
  url: asset.url,
  width: asset.width ?? undefined,
});

const mediaAssetToCleanupItem = (asset: {
  createdAt: Date;
  fileId: string;
  filePath: string;
  purpose: MediaUploadPurpose;
  url: string;
}): CleanupPendingMediaAssetItem => ({
  createdAt: asset.createdAt.toISOString(),
  fileId: asset.fileId,
  filePath: asset.filePath,
  purpose: asset.purpose,
  url: asset.url,
});

export const registerMediaAsset = async ({
  asset,
  uploadedBy,
  userRole,
}: {
  asset: CreateMediaAssetBody;
  uploadedBy: string | Types.ObjectId;
  userRole: UserRole;
}): Promise<UploadedMediaAsset> => {
  ensureUploadPurposeAccess({
    purpose: asset.purpose,
    userRole,
  });

  const uploaderId =
    uploadedBy instanceof Types.ObjectId
      ? uploadedBy
      : new Types.ObjectId(uploadedBy);
  const mediaAsset = await MediaAsset.findOneAndUpdate(
    {
      fileId: asset.fileId,
    },
    {
      $setOnInsert: {
        fileId: asset.fileId,
        filePath: asset.filePath,
        fileType: asset.fileType,
        height: asset.height,
        name: asset.name,
        purpose: asset.purpose,
        size: asset.size,
        status: 'pending',
        thumbnailUrl: asset.thumbnailUrl,
        uploadedBy: uploaderId,
        url: asset.url,
        width: asset.width,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  return mediaAssetToDto(mediaAsset);
};

export const attachMediaAssets = async ({
  fileIds,
  ownerId,
  ownerType,
  purpose,
  uploadedBy,
}: AttachMediaAssetsParams) => {
  const uniqueFileIds = [...new Set(fileIds.filter(Boolean))];

  if (uniqueFileIds.length === 0) return;

  const result = await MediaAsset.updateMany(
    {
      fileId: {
        $in: uniqueFileIds,
      },
      ...(purpose ? { purpose } : {}),
      ...(uploadedBy
        ? {
            uploadedBy:
              uploadedBy instanceof Types.ObjectId
                ? uploadedBy
                : new Types.ObjectId(uploadedBy),
          }
        : {}),
      status: {
        $ne: 'deleted',
      },
    },
    {
      $set: {
        attachedAt: new Date(),
        ownerId: ownerId.toString(),
        ownerType,
        status: 'attached',
      },
    },
  );

  return result.matchedCount;
};

export const markMediaAssetsDeleted = async (fileIds: string[]) => {
  const uniqueFileIds = [...new Set(fileIds.filter(Boolean))];

  if (uniqueFileIds.length === 0) return;

  await MediaAsset.updateMany(
    {
      fileId: {
        $in: uniqueFileIds,
      },
    },
    {
      $set: {
        deletedAt: new Date(),
        status: 'deleted',
      },
    },
  );
};

export const cleanupPendingMediaAssets = async ({
  dryRun = true,
  limit = 100,
  olderThanMs,
}: CleanupPendingMediaAssetsOptions): Promise<
  CleanupPendingMediaAssetsResult
> => {
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 500);
  const cutoffDate = new Date(Date.now() - olderThanMs);
  const pendingAssets = await MediaAsset.find({
    createdAt: {
      $lte: cutoffDate,
    },
    status: 'pending',
  })
    .sort({ createdAt: 1 })
    .limit(safeLimit);
  const candidates = pendingAssets.map(mediaAssetToCleanupItem);

  if (dryRun || pendingAssets.length === 0) {
    return {
      candidates,
      candidatesCount: candidates.length,
      cutoff: cutoffDate.toISOString(),
      deletedCount: 0,
      dryRun,
      failedCount: 0,
      failures: [],
      limit: safeLimit,
      olderThanMs,
    };
  }

  const failures: CleanupPendingMediaAssetFailure[] = [];
  let deletedCount = 0;

  for (const asset of pendingAssets) {
    const claimResult = await MediaAsset.updateOne(
      {
        _id: asset._id,
        status: 'pending',
      },
      {
        $set: {
          status: 'delete-pending',
        },
      },
    );

    if (claimResult.modifiedCount !== 1) continue;

    try {
      await deleteImageKitFile(asset.fileId);
      await MediaAsset.updateOne(
        {
          _id: asset._id,
        },
        {
          $set: {
            deletedAt: new Date(),
            status: 'deleted',
          },
        },
      );
      deletedCount += 1;
    } catch (error) {
      failures.push({
        ...mediaAssetToCleanupItem(asset),
        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete image',
      });
    }
  }

  return {
    candidates,
    candidatesCount: candidates.length,
    cutoff: cutoffDate.toISOString(),
    deletedCount,
    dryRun,
    failedCount: failures.length,
    failures,
    limit: safeLimit,
    olderThanMs,
  };
};
