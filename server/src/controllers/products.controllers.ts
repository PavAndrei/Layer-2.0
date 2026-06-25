import { Request, Response } from 'express';
import { isObjectIdOrHexString, QueryFilter } from 'mongoose';
import { Product, ProductData } from '../models/products.model';
import { ApiError } from '../exceptions/api-error';
import {
  escapeRegExp,
  parseProductsQuery,
} from '../utils/parse-products-query';
import { productToDto } from '../utils/product-to-dto';
import type { ProductResponse, ProductsResponse } from '../types/api';

export const getProducts = async (
  req: Request,
  res: Response<ProductsResponse>,
) => {
  const {
    page,
    limit,
    searchString,
    audience,
    categories,
    sizes,
    colors,
    minPrice,
    maxPrice,
    sortBy,
    inStockOnly,
    hasDiscount,
    isNewProduct,
  } = parseProductsQuery(req.query);

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
  }

  const total = await Product.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const safePage = Math.min(page, totalPages || 1);

  const products = await Product.find(filter)
    .sort(sort)
    .skip((safePage - 1) * limit)
    .limit(limit);

  res.status(200).json({
    message: 'Products fetched successfully',
    success: true,
    data: {
      products: products.map(productToDto),
      pagination: {
        total,
        page: safePage,
        limit,
        totalPages,
      },
    },
  });
};

export const getProductById = async (
  req: Request,
  res: Response<ProductResponse>,
) => {
  const { id } = req.params;

  if (!isObjectIdOrHexString(id)) {
    throw ApiError.BadRequest('Invalid product id');
  }

  const product = await Product.findById(id);

  if (!product) {
    throw ApiError.NotFound('Product not found');
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    categories: {
      $in: product.categories,
    },
  }).limit(4);

  res.status(200).json({
    message: 'Product fetched successfully',
    success: true,
    data: {
      product: productToDto(product),
      relatedProducts: relatedProducts.map(productToDto),
    },
  });
};
