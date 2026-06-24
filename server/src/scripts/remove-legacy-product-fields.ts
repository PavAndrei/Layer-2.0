import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/env';

type StoredVariant = Record<string, unknown> & {
  _id?: unknown;
};

const removeLegacyProductFields = async () => {
  await mongoose.connect(MONGO_URI);

  const products = mongoose.connection.collection('products');
  const totalProducts = await products.countDocuments({});
  const productsWithoutVariants = await products.countDocuments({
    $or: [
      { variants: { $exists: false } },
      { variants: { $size: 0 } },
    ],
  });
  const productsWithMissingVariantIds = await products.countDocuments({
    variants: {
      $elemMatch: {
        _id: { $exists: false },
      },
    },
  });

  if (totalProducts === 0) {
    throw new Error('No products found. Migration was not applied.');
  }

  if (productsWithoutVariants > 0) {
    throw new Error(
      `Migration was not applied: ${productsWithoutVariants} products have no variants.`,
    );
  }

  if (productsWithMissingVariantIds > 0) {
    const productsToRepair = await products
      .find({
        variants: {
          $elemMatch: {
            _id: { $exists: false },
          },
        },
      })
      .project<{ _id: mongoose.Types.ObjectId; variants: StoredVariant[] }>({
        _id: 1,
        variants: 1,
      })
      .toArray();

    await products.bulkWrite(
      productsToRepair.map((product) => ({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              variants: product.variants.map((variant) => ({
                ...variant,
                _id: variant._id ?? new mongoose.Types.ObjectId(),
              })),
            },
          },
        },
      })),
    );
  }

  const missingVariantIdsAfterRepair = await products.countDocuments({
    variants: {
      $elemMatch: {
        _id: { $exists: false },
      },
    },
  });

  if (missingVariantIdsAfterRepair > 0) {
    throw new Error(
      `Migration was not applied: ${missingVariantIdsAfterRepair} products still have variants without ids.`,
    );
  }

  const result = await products.updateMany(
    {},
    {
      $unset: {
        color: '',
        quantity: '',
      },
    },
  );

  console.log(
    `Migration completed: repaired variant ids in ${productsWithMissingVariantIds} products, matched ${result.matchedCount}, modified ${result.modifiedCount} products.`,
  );
};

removeLegacyProductFields()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
