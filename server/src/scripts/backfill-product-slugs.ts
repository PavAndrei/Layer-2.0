import mongoose from 'mongoose';

import { MONGO_URI } from '../constants/env';
import { Product } from '../models/products.model';
import { createProductSlug } from '../utils/create-product-slug';

const getAvailableSlug = (title: string, usedSlugs: Set<string>) => {
  const baseSlug = createProductSlug(title);
  let slug = baseSlug;
  let suffix = 2;

  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  usedSlugs.add(slug);

  return slug;
};

const backfillProductSlugs = async () => {
  await mongoose.connect(MONGO_URI);

  const products = await Product.find({}).sort({ createdAt: 1 });
  const usedSlugs = new Set(
    products
      .map((product) => product.slug)
      .filter((slug): slug is string => Boolean(slug)),
  );
  const operations = products
    .filter((product) => !product.slug)
    .map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            slug: getAvailableSlug(product.title, usedSlugs),
          },
        },
      },
    }));

  if (operations.length > 0) {
    await Product.bulkWrite(operations);
  }

  console.log(`Backfilled product slugs: ${operations.length}`);
};

backfillProductSlugs()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
