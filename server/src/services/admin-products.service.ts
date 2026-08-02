import { QueryFilter } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { Favorite } from '../models/favorites.model';
import { Product, ProductData } from '../models/products.model';
import { Review } from '../models/reviews.model';
import type {
  AdminProductResponse,
  AdminProductsResponse,
  CreateAdminProductResponse,
  DeleteAdminProductResponse,
  UpdateAdminProductResponse,
  UpdateAdminProductStatusResponse,
} from '../types/api';
import {
  adminProductToDto,
  adminProductToListItemDto,
} from '../utils/admin-product-to-dto';
import { createProductSlug } from '../utils/create-product-slug';
import { createAuditLog } from './audit-logs.service';
import {
  attachMediaAssets,
  deleteImageKitFile,
  markMediaAssetsDeleted,
} from './media.service';
import type {
  AdminProductsQuery,
  CreateAdminProductBody,
  UpdateAdminProductBody,
  UpdateAdminProductStatusBody,
} from '../validators/admin-products.validators';

const LOW_STOCK_THRESHOLD = 5;

const TOTAL_STOCK_EXPRESSION = {
  $reduce: {
    input: '$variants',
    initialValue: 0,
    in: {
      $add: ['$$value', '$$this.quantity'],
    },
  },
};

type ProductStatsAggregateResult = {
  _id: null;
  active: number;
  archived: number;
  discounted: number;
  draft: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  total: number;
  totalStock: number;
  totalVariants: number;
};

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getUniqueProductSlug = async (title: string) => {
  const baseSlug = createProductSlug(title);

  if (!baseSlug) {
    throw ApiError.BadRequest('Product title cannot create a valid slug');
  }

  let slug = baseSlug;
  let suffix = 2;

  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const getProductCoverImage = (images: CreateAdminProductBody['images']) => {
  return (
    images.find((image) => image.role === 'main') ??
    images.find((image) => image.role === 'front') ??
    images[0]
  );
};

const getDiscountFields = ({
  defaultPrice,
  discountPrice,
  hasDiscount,
}: Pick<
  CreateAdminProductBody,
  'defaultPrice' | 'discountPrice' | 'hasDiscount'
>) => {
  if (!hasDiscount || discountPrice === undefined) {
    return {
      discountPercent: 0,
      discountPrice: defaultPrice,
      hasDiscount: false,
    };
  }

  return {
    discountPercent: Math.round(
      ((defaultPrice - discountPrice) / defaultPrice) * 100,
    ),
    discountPrice,
    hasDiscount: true,
  };
};

const getImageKitFileIds = (
  images: Array<{ fileId?: string }> = [],
) => [
  ...new Set(
    images
      .map((image) => image.fileId)
      .filter((fileId): fileId is string => Boolean(fileId)),
  ),
];

const deleteImageKitFilesSafely = async (
  fileIds: string[],
  context: string,
) => {
  const uniqueFileIds = [...new Set(fileIds)];

  if (uniqueFileIds.length === 0) return;

  const results = await Promise.allSettled(
    uniqueFileIds.map((fileId) => deleteImageKitFile(fileId)),
  );

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') return;

    console.error('Failed to delete ImageKit file', {
      context,
      error: result.reason,
      fileId: uniqueFileIds[index],
    });
  });
};

const getSafePagination = (query: AdminProductsQuery) => {
  const page = Math.max(1, query.page);
  const limit = Math.min(Math.max(1, query.limit), 50);

  return {
    page,
    limit,
  };
};

const getAdminProductsFilter = (
  query: AdminProductsQuery,
): QueryFilter<ProductData> => {
  const filter: QueryFilter<ProductData> = {};

  if (query.search) {
    const escapedSearch = escapeRegExp(query.search);
    const searchExpression = {
      $regex: escapedSearch,
      $options: 'i',
    };

    filter.$or = [
      { title: searchExpression },
      { slug: searchExpression },
    ];
  }

  if (query.status) {
    if (query.status === 'active') {
      filter.$and = [
        ...(filter.$and ?? []),
        {
          $or: [
            { status: 'active' },
            { status: { $exists: false } },
          ],
        },
      ];
    } else {
      filter.status = query.status;
    }
  }

  if (query.category) {
    filter.categories = query.category;
  }

  if (query.audience) {
    filter.audience = query.audience;
  }

  if (query.hasDiscount !== undefined) {
    filter.hasDiscount = query.hasDiscount;
  }

  const variantFilter: {
    color?: string;
    quantity?: { $gt: number };
    size?: string;
  } = {};

  if (query.color) {
    variantFilter.color = query.color;
  }

  if (query.size) {
    variantFilter.size = query.size;
  }

  if (query.stock === 'in-stock') {
    variantFilter.quantity = { $gt: 0 };
  }

  if (Object.keys(variantFilter).length > 0) {
    filter.variants = {
      $elemMatch: variantFilter,
    };
  }

  if (query.stock === 'out-of-stock') {
    filter.$and = [
      ...(filter.$and ?? []),
      {
        variants: {
          $not: {
            $elemMatch: {
              quantity: { $gt: 0 },
            },
          },
        },
      },
    ];
  }

  if (query.stock === 'low-stock') {
    filter.$and = [
      ...(filter.$and ?? []),
      {
        $expr: {
          $and: [
            {
              $gt: [
                TOTAL_STOCK_EXPRESSION,
                0,
              ],
            },
            {
              $lte: [
                TOTAL_STOCK_EXPRESSION,
                LOW_STOCK_THRESHOLD,
              ],
            },
          ],
        },
      },
    ];
  }

  return filter;
};

const getAdminProductsSort = (
  sort: AdminProductsQuery['sort'],
): Record<string, 1 | -1> => {
  switch (sort) {
    case 'name-asc':
      return {
        title: 1,
        _id: 1,
      };

    case 'name-desc':
      return {
        title: -1,
        _id: -1,
      };

    case 'price-asc':
      return {
        discountPrice: 1,
        _id: 1,
      };

    case 'price-desc':
      return {
        discountPrice: -1,
        _id: -1,
      };

    case 'rating-asc':
      return {
        rating: 1,
        _id: 1,
      };

    case 'rating-desc':
      return {
        rating: -1,
        _id: -1,
      };

    default:
      return {
        updatedAt: -1,
        _id: -1,
      };
  }
};

const getAdminProductsStats = async () => {
  const [stats] = await Product.aggregate<ProductStatsAggregateResult>([
    {
      $addFields: {
        normalizedStatus: {
          $ifNull: ['$status', 'active'],
        },
        totalStock: TOTAL_STOCK_EXPRESSION,
        totalVariants: {
          $size: '$variants',
        },
      },
    },
    {
      $group: {
        _id: null,
        active: {
          $sum: {
            $cond: [{ $eq: ['$normalizedStatus', 'active'] }, 1, 0],
          },
        },
        archived: {
          $sum: {
            $cond: [{ $eq: ['$normalizedStatus', 'archived'] }, 1, 0],
          },
        },
        discounted: {
          $sum: {
            $cond: ['$hasDiscount', 1, 0],
          },
        },
        draft: {
          $sum: {
            $cond: [{ $eq: ['$normalizedStatus', 'draft'] }, 1, 0],
          },
        },
        inStock: {
          $sum: {
            $cond: [{ $gt: ['$totalStock', 0] }, 1, 0],
          },
        },
        lowStock: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gt: ['$totalStock', 0] },
                  { $lte: ['$totalStock', LOW_STOCK_THRESHOLD] },
                ],
              },
              1,
              0,
            ],
          },
        },
        outOfStock: {
          $sum: {
            $cond: [{ $lte: ['$totalStock', 0] }, 1, 0],
          },
        },
        total: {
          $sum: 1,
        },
        totalStock: {
          $sum: '$totalStock',
        },
        totalVariants: {
          $sum: '$totalVariants',
        },
      },
    },
  ]);

  return {
    active: stats?.active ?? 0,
    archived: stats?.archived ?? 0,
    discounted: stats?.discounted ?? 0,
    draft: stats?.draft ?? 0,
    inStock: stats?.inStock ?? 0,
    lowStock: stats?.lowStock ?? 0,
    outOfStock: stats?.outOfStock ?? 0,
    total: stats?.total ?? 0,
    totalStock: stats?.totalStock ?? 0,
    totalVariants: stats?.totalVariants ?? 0,
  };
};

export const getAdminProductsData = async (
  query: AdminProductsQuery,
): Promise<AdminProductsResponse['data']> => {
  const { page, limit } = getSafePagination(query);
  const filter = getAdminProductsFilter(query);
  const total = await Product.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const [products, stats] = await Promise.all([
    Product.find(filter)
      .sort(getAdminProductsSort(query.sort))
      .skip((safePage - 1) * limit)
      .limit(limit),
    getAdminProductsStats(),
  ]);

  return {
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
    products: products.map(adminProductToListItemDto),
    stats,
  };
};

export const createAdminProductData = async ({
  adminUserId,
  productData,
}: {
  adminUserId: string;
  productData: CreateAdminProductBody;
}): Promise<CreateAdminProductResponse['data']> => {
  const slug = await getUniqueProductSlug(productData.title);
  const coverImage = getProductCoverImage(productData.images);
  const discountFields = getDiscountFields(productData);
  const product = await Product.create({
    audience: productData.audience,
    categories: productData.categories,
    defaultPrice: productData.defaultPrice,
    description: productData.description,
    discountPercent: discountFields.discountPercent,
    discountPrice: discountFields.discountPrice,
    hasDiscount: discountFields.hasDiscount,
    images: productData.images,
    img: coverImage.src,
    isNewProduct: false,
    rating: 0,
    slug,
    status: productData.status ?? 'draft',
    title: productData.title,
    variants: productData.variants,
  });
  const attachedImageFileIds = getImageKitFileIds(product.images);

  await createAuditLog({
    action: 'product.created',
    actorId: adminUserId,
    entityId: product._id,
    entityType: 'product',
    metadata: {
      attachedMediaFileIds: attachedImageFileIds,
      slug: product.slug,
      status: product.status,
      title: product.title,
      variantsCount: product.variants.length,
    },
  });

  await attachMediaAssets({
    fileIds: attachedImageFileIds,
    ownerId: product._id,
    ownerType: 'product',
    purpose: 'product-image',
  });

  return {
    product: adminProductToListItemDto(product),
  };
};

export const getAdminProductData = async (
  productId: string,
): Promise<AdminProductResponse['data']> => {
  const product = await Product.findById(productId);

  if (!product) {
    throw ApiError.NotFound('Product not found');
  }

  return {
    product: adminProductToDto(product),
  };
};

export const updateAdminProductData = async ({
  adminUserId,
  productId,
  update,
}: {
  adminUserId: string;
  productId: string;
  update: UpdateAdminProductBody;
}): Promise<UpdateAdminProductResponse['data']> => {
  const product = await Product.findById(productId);

  if (!product) {
    throw ApiError.NotFound('Product not found');
  }

  const previousStatus = product.status ?? 'active';
  const previousImageFileIds = getImageKitFileIds(product.images);
  const nextImageFileIds = getImageKitFileIds(update.images);
  const attachedImageFileIds = nextImageFileIds.filter(
    (fileId) => !previousImageFileIds.includes(fileId),
  );
  const removedImageFileIds = previousImageFileIds.filter(
    (fileId) => !nextImageFileIds.includes(fileId),
  );
  const coverImage = getProductCoverImage(update.images);
  const discountFields = getDiscountFields(update);

  product.set({
    audience: update.audience,
    categories: update.categories,
    defaultPrice: update.defaultPrice,
    description: update.description,
    discountPercent: discountFields.discountPercent,
    discountPrice: discountFields.discountPrice,
    hasDiscount: discountFields.hasDiscount,
    images: update.images,
    img: coverImage.src,
    status: update.status ?? product.status ?? 'draft',
    title: update.title,
    variants: update.variants,
  });

  await product.save();
  await deleteImageKitFilesSafely(
    removedImageFileIds,
    'admin-product-update',
  );
  await Promise.all([
    attachMediaAssets({
      fileIds: nextImageFileIds,
      ownerId: product._id,
      ownerType: 'product',
      purpose: 'product-image',
    }),
    markMediaAssetsDeleted(removedImageFileIds),
  ]);

  await createAuditLog({
    action: 'product.updated',
    actorId: adminUserId,
    entityId: product._id,
    entityType: 'product',
    metadata: {
      attachedMediaFileIds: attachedImageFileIds,
      previousStatus,
      removedMediaFileIds: removedImageFileIds,
      slug: product.slug,
      status: product.status,
      title: product.title,
      variantsCount: product.variants.length,
    },
  });

  return {
    product: adminProductToDto(product),
  };
};

export const updateAdminProductStatusData = async ({
  adminUserId,
  productId,
  update,
}: {
  adminUserId: string;
  productId: string;
  update: UpdateAdminProductStatusBody;
}): Promise<UpdateAdminProductStatusResponse['data']> => {
  const product = await Product.findById(productId);

  if (!product) {
    throw ApiError.NotFound('Product not found');
  }

  const previousStatus = product.status ?? 'active';

  if (previousStatus === update.status) {
    return {
      product: adminProductToDto(product),
    };
  }

  product.status = update.status;

  await product.save();

  await createAuditLog({
    action: 'product.status_changed',
    actorId: adminUserId,
    entityId: product._id,
    entityType: 'product',
    metadata: {
      previousStatus,
      slug: product.slug,
      status: product.status,
      title: product.title,
    },
  });

  return {
    product: adminProductToDto(product),
  };
};

export const deleteAdminProductData = async ({
  adminUserId,
  productId,
}: {
  adminUserId: string;
  productId: string;
}): Promise<DeleteAdminProductResponse['data']> => {
  const product = await Product.findById(productId);

  if (!product) {
    throw ApiError.NotFound('Product not found');
  }

  if ((product.status ?? 'active') !== 'archived') {
    throw ApiError.Conflict('Archive product before deleting it');
  }

  const deletedProduct = {
    _id: product._id,
    imageFileIds: getImageKitFileIds(product.images),
    slug: product.slug,
    title: product.title,
  };
  const [favoritesDeleteResult, reviewsDeleteResult] = await Promise.all([
    Favorite.deleteMany({ productId: product._id }),
    Review.deleteMany({ productId: product._id }),
  ]);

  await product.deleteOne();
  await deleteImageKitFilesSafely(
    deletedProduct.imageFileIds,
    'admin-product-delete',
  );
  await markMediaAssetsDeleted(deletedProduct.imageFileIds);

  await createAuditLog({
    action: 'product.deleted',
    actorId: adminUserId,
    entityId: deletedProduct._id,
    entityType: 'product',
    metadata: {
      deletedFavoritesCount: favoritesDeleteResult.deletedCount,
      deletedMediaFileIds: deletedProduct.imageFileIds,
      deletedReviewsCount: reviewsDeleteResult.deletedCount,
      slug: deletedProduct.slug,
      title: deletedProduct.title,
    },
  });

  return {
    deletedFavoritesCount: favoritesDeleteResult.deletedCount,
    deletedReviewsCount: reviewsDeleteResult.deletedCount,
    productId: deletedProduct._id.toString(),
    slug: deletedProduct.slug,
    title: deletedProduct.title,
  };
};
