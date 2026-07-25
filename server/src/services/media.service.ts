import { createHmac, randomUUID } from 'crypto';

import { ApiError } from '../exceptions/api-error';
import type { UserRole } from '../types/user';
import type {
  ImageKitUploadAuth,
  ImageKitUploadTarget,
  MediaUploadPurpose,
} from '../types/media';

const IMAGEKIT_AUTH_EXPIRES_IN_SECONDS = 30 * 60;

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

const getUploadTarget = ({
  purpose,
  userId,
  userRole,
}: ImageKitUploadAuthParams): ImageKitUploadTarget => {
  if (purpose === 'product-image') {
    if (userRole !== 'admin') {
      throw ApiError.Forbidden('Only admins can upload product images');
    }

    return {
      folder: '/layer/products',
      tags: ['product'],
      useUniqueFileName: true,
    };
  }

  return {
    folder: `/layer/users/${userId}/avatar`,
    tags: ['avatar', `user-${userId}`],
    useUniqueFileName: true,
  };
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
