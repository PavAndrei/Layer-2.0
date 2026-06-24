import { Request, Response } from 'express';
import { isObjectIdOrHexString } from 'mongoose';
import { Product } from '../models/products.model';
import { ApiError } from '../exceptions/api-error';

export const getProducts = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
  const searchString = req.query.searchString as string;
  const categories = req.query.categories as string;
  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);
  const sortBy = req.query.sortBy as string;
  const inStockOnly = req.query.inStockOnly === 'true';

  const filter: Record<string, any> = {};

  if (searchString) {
    filter.$or = [
      {
        title: {
          $regex: searchString,
          $options: 'i',
        },
      },
      {
        description: {
          $regex: searchString,
          $options: 'i',
        },
      },
    ];
  }

  if (categories) {
    filter.categories = {
      $in: categories.split(','),
    };
  }

  const priceFilter: Record<string, number> = {};

  if (!Number.isNaN(minPrice)) {
    priceFilter.$gte = minPrice;
  }

  if (!Number.isNaN(maxPrice)) {
    priceFilter.$lte = maxPrice;
  }

  if (Object.keys(priceFilter).length > 0) {
    filter.discountPrice = priceFilter;
  }

  if (inStockOnly) {
    filter.quantity = {
      $gt: 0,
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
    products,
    total,
    page: safePage,
    limit,
    totalPages,
  });
};

export const getProductById = async (req: Request, res: Response) => {
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
    product,
    relatedProducts,
  });
};
