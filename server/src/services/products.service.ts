import { isObjectIdOrHexString, QueryFilter } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { Product, ProductData } from '../models/products.model';
import type {
  ProductResponse,
  ProductsResponse,
} from '../types/api';
import { getReviewCountsByProductIds } from '../utils/get-review-counts';
import { productToDto } from '../utils/product-to-dto';
import type { ProductsQuery } from '../validators/products.validators';

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildProductsFilter = ({
  audience,
  categories,
  colors,
  hasDiscount,
  inStockOnly,
  isNewProduct,
  maxPrice,
  minPrice,
  searchString,
  sizes,
}: ProductsQuery): QueryFilter<ProductData> => {
  const filter: QueryFilter<ProductData> = {};

  if (searchString) {
    const escapedSearchString = escapeRegExp(searchString);

    filter.$or = [
      {
        title: {
          $regex: escapedSearchString,
          $options: 'i',
        },
      },
      {
        description: {
          $regex: escapedSearchString,
          $options: 'i',
        },
      },
    ];
  }

  if (categories.length > 0) {
    filter.categories = {
      $in: categories,
    };
  }

  if (audience.length > 0) {
    filter.audience = {
      $in: audience,
    };
  }

  if (hasDiscount) {
    filter.hasDiscount = true;
  }

  if (isNewProduct) {
    filter.isNewProduct = true;
  }

  const priceFilter: Record<string, number> = {};

  if (minPrice !== undefined) {
    priceFilter.$gte = minPrice;
  }

  if (maxPrice !== undefined) {
    priceFilter.$lte = maxPrice;
  }

  if (Object.keys(priceFilter).length > 0) {
    filter.discountPrice = priceFilter;
  }

  const variantFilter: {
    size?: { $in: typeof sizes };
    color?: { $in: string[] };
    quantity?: { $gt: number };
  } = {};

  if (sizes.length > 0) {
    variantFilter.size = { $in: sizes };
  }

  if (colors.length > 0) {
    variantFilter.color = { $in: colors };
  }

  if (sizes.length > 0 || colors.length > 0 || inStockOnly) {
    variantFilter.quantity = { $gt: 0 };

    filter.variants = {
      $elemMatch: variantFilter,
    };
  }

  return filter;
};

const buildProductsSort = (
  sortBy: ProductsQuery['sortBy'],
): Record<string, 1 | -1> => {
  const sort: Record<string, 1 | -1> = {};

  switch (sortBy) {
    case 'price-asc':
      sort.discountPrice = 1;
      break;

    case 'price-desc':
      sort.discountPrice = -1;
      break;

    case 'name-asc':
      sort.title = 1;
      break;

    case 'name-desc':
      sort.title = -1;
      break;

    case 'rating-asc':
      sort.rating = 1;
      break;

    case 'rating-desc':
      sort.rating = -1;
      break;
  }

  return sort;
};

export const getProductsData = async (
  query: ProductsQuery,
): Promise<ProductsResponse['data']> => {
  const { page, limit, sortBy } = query;
  const filter = buildProductsFilter(query);
  const sort = buildProductsSort(sortBy);
  const total = await Product.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const products = await Product.find(filter)
    .sort(sort)
    .skip((safePage - 1) * limit)
    .limit(limit);
  const reviewCounts = await getReviewCountsByProductIds(
    products.map((product) => product._id),
  );

  return {
    products: products.map((product) =>
      productToDto(product, {
        reviewsCount: reviewCounts.get(product._id.toString()),
      }),
    ),
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
  };
};

export const getProductByIdentifierData = async (
  identifier: string,
): Promise<ProductResponse['data']> => {
  const product = isObjectIdOrHexString(identifier)
    ? await Product.findById(identifier)
    : await Product.findOne({ slug: identifier });

  if (!product) {
    throw ApiError.NotFound('Product not found');
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    categories: {
      $in: product.categories,
    },
  }).limit(10);
  const reviewCounts = await getReviewCountsByProductIds([
    product._id,
    ...relatedProducts.map((relatedProduct) => relatedProduct._id),
  ]);

  return {
    product: productToDto(product, {
      reviewsCount: reviewCounts.get(product._id.toString()),
    }),
    relatedProducts: relatedProducts.map((relatedProduct) =>
      productToDto(relatedProduct, {
        reviewsCount: reviewCounts.get(relatedProduct._id.toString()),
      }),
    ),
  };
};
