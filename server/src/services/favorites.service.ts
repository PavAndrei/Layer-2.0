import { isObjectIdOrHexString, Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { Favorite } from '../models/favorites.model';
import { Product, type ProductDocument } from '../models/products.model';
import type {
  AddFavoriteResponse,
  FavoritesResponse,
  RemoveFavoriteResponse,
} from '../types/api';
import { getReviewCountsByProductIds } from '../utils/get-review-counts';
import { productToDto } from '../utils/product-to-dto';

const validateObjectId = (id: string, message: string) => {
  if (!isObjectIdOrHexString(id)) {
    throw ApiError.BadRequest(message);
  }
};

const productsToFavoriteDtos = async (
  products: ProductDocument[],
): Promise<FavoritesResponse['data']['products']> => {
  const reviewCounts = await getReviewCountsByProductIds(
    products.map((product) => product._id),
  );

  return products.map((product) =>
    productToDto(product, {
      reviewsCount: reviewCounts.get(product._id.toString()),
    }),
  );
};

export const getFavoriteProductsData = async (
  userId: string,
): Promise<FavoritesResponse['data']> => {
  validateObjectId(userId, 'Invalid user id');

  const favorites = await Favorite.find({ userId })
    .sort({ createdAt: -1 })
    .select('productId');
  const favoriteProductIds = favorites.map((favorite) => favorite.productId);

  if (favoriteProductIds.length === 0) {
    return {
      products: [],
    };
  }

  const products = await Product.find({
    _id: { $in: favoriteProductIds },
  });
  const productsById = new Map(
    products.map((product) => [product._id.toString(), product]),
  );
  const orderedProducts = favoriteProductIds
    .map((productId) => productsById.get(productId.toString()))
    .filter((product): product is ProductDocument => Boolean(product));

  return {
    products: await productsToFavoriteDtos(orderedProducts),
  };
};

export const addFavoriteProductData = async (
  userId: string,
  productId: string,
): Promise<AddFavoriteResponse['data']> => {
  validateObjectId(userId, 'Invalid user id');
  validateObjectId(productId, 'Invalid product id');

  const product = await Product.findById(productId);

  if (!product) {
    throw ApiError.NotFound('Product not found');
  }

  await Favorite.updateOne(
    {
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
    },
    {
      $setOnInsert: {
        productId: new Types.ObjectId(productId),
        userId: new Types.ObjectId(userId),
      },
    },
    {
      upsert: true,
    },
  );

  const [favoriteProduct] = await productsToFavoriteDtos([product]);

  return {
    product: favoriteProduct,
  };
};

export const removeFavoriteProductData = async (
  userId: string,
  productId: string,
): Promise<RemoveFavoriteResponse['data']> => {
  validateObjectId(userId, 'Invalid user id');
  validateObjectId(productId, 'Invalid product id');

  await Favorite.deleteOne({
    productId: new Types.ObjectId(productId),
    userId: new Types.ObjectId(userId),
  });

  return {
    productId,
  };
};
