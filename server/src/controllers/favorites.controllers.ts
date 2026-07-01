import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import {
  addFavoriteProductData,
  getFavoriteProductsData,
  removeFavoriteProductData,
} from '../services/favorites.service';
import type {
  AddFavoriteResponse,
  FavoritesResponse,
  RemoveFavoriteResponse,
} from '../types/api';

const getAuthenticatedUserId = (req: Request) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  return req.user.userId;
};

export const getFavoriteProducts = async (
  req: Request,
  res: Response<FavoritesResponse>,
) => {
  const data = await getFavoriteProductsData(getAuthenticatedUserId(req));

  res.status(200).json({
    success: true,
    message: 'Favorite products fetched successfully',
    data,
  });
};

export const addFavoriteProduct = async (
  req: Request,
  res: Response<AddFavoriteResponse>,
) => {
  const { productId } = req.validated?.params as { productId: string };
  const data = await addFavoriteProductData(
    getAuthenticatedUserId(req),
    productId,
  );

  res.status(201).json({
    success: true,
    message: 'Product added to favorites successfully',
    data,
  });
};

export const removeFavoriteProduct = async (
  req: Request,
  res: Response<RemoveFavoriteResponse>,
) => {
  const { productId } = req.validated?.params as { productId: string };
  const data = await removeFavoriteProductData(
    getAuthenticatedUserId(req),
    productId,
  );

  res.status(200).json({
    success: true,
    message: 'Product removed from favorites successfully',
    data,
  });
};
