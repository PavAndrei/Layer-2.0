type ImageKitImageFormat = 'auto' | 'avif' | 'jpg' | 'png' | 'webp';

export type ImageKitImageTransform = {
  format?: ImageKitImageFormat;
  height?: number;
  quality?: number;
  width?: number;
};

type BuildImageKitUrlOptions = {
  src: string;
  transform?: ImageKitImageTransform;
  urlEndpoint?: string;
};

const normalizeUrlEndpoint = (urlEndpoint: string) =>
  urlEndpoint.endsWith('/') ? urlEndpoint.slice(0, -1) : urlEndpoint;

const getTransformationParts = ({
  format,
  height,
  quality,
  width,
}: ImageKitImageTransform) => [
  width ? `w-${width}` : null,
  height ? `h-${height}` : null,
  quality ? `q-${quality}` : null,
  format ? `f-${format}` : null,
];

export const buildImageKitUrl = ({
  src,
  transform,
  urlEndpoint,
}: BuildImageKitUrlOptions) => {
  const transformation = transform
    ? getTransformationParts(transform).filter(Boolean).join(',')
    : '';

  if (!urlEndpoint || !transformation) return src;

  const normalizedEndpoint = normalizeUrlEndpoint(urlEndpoint);

  if (!src.startsWith(normalizedEndpoint)) return src;

  const imagePath = src.slice(normalizedEndpoint.length);
  const normalizedImagePath = imagePath.startsWith('/')
    ? imagePath
    : `/${imagePath}`;

  if (normalizedImagePath.startsWith('/tr:')) return src;

  return `${normalizedEndpoint}/tr:${transformation}${normalizedImagePath}`;
};
