import { Request, Response } from 'express';
import {
  getProductByIdentifierData,
  getProductsData,
} from '../services/products.service';
import type { ProductResponse, ProductsResponse } from '../types/api';
import type { ProductsQuery } from '../validators/products.validators';

export const getProducts = async (
  req: Request,
  res: Response<ProductsResponse>,
) => {
  const data = await getProductsData(
    req.validated?.query as ProductsQuery,
  );

  res.status(200).json({
    message: 'Products fetched successfully',
    success: true,
    data,
  });
};

export const getProductByIdentifier = async (
  req: Request,
  res: Response<ProductResponse>,
) => {
  const { identifier } = req.validated?.params as { identifier: string };
  const data = await getProductByIdentifierData(identifier);

  res.status(200).json({
    message: 'Product fetched successfully',
    success: true,
    data,
  });
};
