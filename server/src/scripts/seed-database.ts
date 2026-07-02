import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';

import { MONGO_URI } from '../constants/env';
import { Product } from '../models/products.model';
import { Review } from '../models/reviews.model';
import { createProductSlug } from '../utils/create-product-slug';
import type { ReviewStatus } from '../types/review';

type ProductSeed = {
  img: string;
  title: string;
  description: string;
  defaultPrice: number;
  discountPrice: number;
  discountPercent: number;
  rating: number;
  categories: string[];
  audience: string[];
  hasDiscount: boolean;
  isNewProduct: boolean;
  images: {
    src: string;
    alt: string;
    role: string;
    color?: string;
  }[];
  variants: {
    sku: string;
    size: string;
    color: string;
    quantity: number;
    image?: string;
  }[];
};

type ReviewSeed = {
  productTitle: string;
  authorName: string;
  rating: number;
  title: string;
  text: string;
  verifiedPurchase: boolean;
  status: ReviewStatus;
  createdAt?: string;
};

type RatingAggregateResult = {
  _id: mongoose.Types.ObjectId;
  averageRating: number;
};

const readJsonFile = async <Data>(fileName: string): Promise<Data> => {
  const filePath = path.resolve(__dirname, '../data', fileName);
  const fileContent = await readFile(filePath, 'utf8');

  return JSON.parse(fileContent) as Data;
};

const seedDatabase = async () => {
  await mongoose.connect(MONGO_URI);

  const [productsSeed, reviewsSeed] = await Promise.all([
    readJsonFile<ProductSeed[]>('products.json'),
    readJsonFile<ReviewSeed[]>('reviews.json'),
  ]);

  await Review.deleteMany({});
  await Product.deleteMany({});

  const products = await Product.insertMany(
    productsSeed.map((product) => ({
      ...product,
      slug: createProductSlug(product.title),
    })),
  );
  const productByTitle = new Map(
    products.map((product) => [product.title, product]),
  );
  const reviews = reviewsSeed.map((review) => {
    const product = productByTitle.get(review.productTitle);

    if (!product) {
      throw new Error(
        `Cannot seed review: product "${review.productTitle}" was not found.`,
      );
    }

    return {
      productId: product._id,
      authorName: review.authorName,
      rating: review.rating,
      title: review.title,
      text: review.text,
      verifiedPurchase: review.verifiedPurchase,
      status: review.status,
      createdAt: review.createdAt ? new Date(review.createdAt) : undefined,
      updatedAt: review.createdAt ? new Date(review.createdAt) : undefined,
    };
  });

  if (reviews.length > 0) {
    await Review.insertMany(reviews);
  }

  const ratingAggregates = await Review.aggregate<RatingAggregateResult>([
    {
      $match: {
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  const ratingByProductId = new Map(
    ratingAggregates.map((aggregate) => [
      aggregate._id.toString(),
      Number(aggregate.averageRating.toFixed(1)),
    ]),
  );

  await Product.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            rating: ratingByProductId.get(product._id.toString()) ?? 0,
          },
        },
      },
    })),
  );

  console.log(
    `Seed completed: inserted ${products.length} products, inserted ${reviews.length} reviews and recalculated product ratings.`,
  );
};

seedDatabase()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
