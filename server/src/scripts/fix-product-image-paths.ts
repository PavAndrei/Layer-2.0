import mongoose from 'mongoose';

import { MONGO_URI } from '../constants/env';
import { Product } from '../models/products.model';

const PRODUCT_IMAGEKIT_FOLDER = '/layer/products';
const IMAGE_FILE_NAME_PATTERN =
  /^[A-Za-z0-9._-]+\.(avif|gif|jpeg|jpg|png|webp)$/i;

type StoredProductImage = {
  src?: string;
  filePath?: string;
  [key: string]: unknown;
};

type StoredProductVariant = {
  image?: string;
  [key: string]: unknown;
};

type StoredProduct = {
  _id: mongoose.Types.ObjectId;
  slug?: string;
  img?: string;
  images?: StoredProductImage[];
  variants?: StoredProductVariant[];
};

type TransformResult =
  | {
      status: 'updated';
      value: string;
      filePath: string;
    }
  | {
      status: 'unchanged' | 'skipped';
      value?: string;
    };

type MigrationStats = {
  productsScanned: number;
  productsMatched: number;
  productsUpdated: number;
  img: number;
  imageSrc: number;
  imageFilePath: number;
  variantImage: number;
  skipped: number;
  skippedSamples: {
    slug?: string;
    field: string;
    value?: string;
  }[];
};

const isDryRun = process.argv.includes('--dry-run');

const getImageKitEndpoint = () => {
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim().replace(/\/$/, '');

  if (!endpoint) {
    throw new Error('Missing environment variable IMAGEKIT_URL_ENDPOINT');
  }

  return endpoint;
};

const transformImageUrl = (
  value: string | undefined,
  urlEndpoint: string,
): TransformResult => {
  if (!value) {
    return { status: 'unchanged', value };
  }

  if (!value.startsWith(`${urlEndpoint}/`)) {
    return { status: 'unchanged', value };
  }

  if (value.startsWith(`${urlEndpoint}${PRODUCT_IMAGEKIT_FOLDER}/`)) {
    return { status: 'unchanged', value };
  }

  const fileName = value.slice(urlEndpoint.length + 1);

  if (!IMAGE_FILE_NAME_PATTERN.test(fileName)) {
    return { status: 'skipped', value };
  }

  return {
    status: 'updated',
    value: `${urlEndpoint}${PRODUCT_IMAGEKIT_FOLDER}/${fileName}`,
    filePath: `${PRODUCT_IMAGEKIT_FOLDER}/${fileName}`,
  };
};

const pushSkippedSample = (
  stats: MigrationStats,
  product: StoredProduct,
  field: string,
  value: string | undefined,
) => {
  stats.skipped += 1;

  if (stats.skippedSamples.length >= 5) {
    return;
  }

  stats.skippedSamples.push({
    slug: product.slug,
    field,
    value,
  });
};

const fixProductImagePaths = async () => {
  const urlEndpoint = getImageKitEndpoint();

  await mongoose.connect(MONGO_URI);

  const products = await Product.find({})
    .select('_id slug img images variants')
    .lean<StoredProduct[]>();
  const stats: MigrationStats = {
    productsScanned: products.length,
    productsMatched: 0,
    productsUpdated: 0,
    img: 0,
    imageSrc: 0,
    imageFilePath: 0,
    variantImage: 0,
    skipped: 0,
    skippedSamples: [],
  };
  const operations: mongoose.mongo.AnyBulkWriteOperation[] = [];

  for (const product of products) {
    const $set: Record<string, unknown> = {};
    const nextImg = transformImageUrl(product.img, urlEndpoint);

    if (nextImg.status === 'updated') {
      $set.img = nextImg.value;
      stats.img += 1;
    }

    if (nextImg.status === 'skipped') {
      pushSkippedSample(stats, product, 'img', product.img);
    }

    const nextImages = product.images?.map((image) => {
      const nextImage = transformImageUrl(image.src, urlEndpoint);

      if (nextImage.status === 'updated') {
        stats.imageSrc += 1;
        stats.imageFilePath += 1;

        return {
          ...image,
          src: nextImage.value,
          filePath: nextImage.filePath,
        };
      }

      if (nextImage.status === 'skipped') {
        pushSkippedSample(stats, product, 'images.src', image.src);
      }

      return image;
    });

    if (
      nextImages &&
      nextImages.some((image, index) => image !== product.images?.[index])
    ) {
      $set.images = nextImages;
    }

    const nextVariants = product.variants?.map((variant) => {
      const nextImage = transformImageUrl(variant.image, urlEndpoint);

      if (nextImage.status === 'updated') {
        stats.variantImage += 1;

        return {
          ...variant,
          image: nextImage.value,
        };
      }

      if (nextImage.status === 'skipped') {
        pushSkippedSample(stats, product, 'variants.image', variant.image);
      }

      return variant;
    });

    if (
      nextVariants &&
      nextVariants.some((variant, index) => variant !== product.variants?.[index])
    ) {
      $set.variants = nextVariants;
    }

    if (Object.keys($set).length === 0) {
      continue;
    }

    stats.productsMatched += 1;

    operations.push({
      updateOne: {
        filter: { _id: product._id },
        update: { $set },
      },
    });
  }

  if (!isDryRun && operations.length > 0) {
    const result = await Product.bulkWrite(operations);

    stats.productsUpdated = result.modifiedCount;
  }

  console.log(
    JSON.stringify(
      {
        mode: isDryRun ? 'dry-run' : 'apply',
        ...stats,
      },
      null,
      2,
    ),
  );
};

fixProductImagePaths()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
