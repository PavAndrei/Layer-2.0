import { Request, Response } from 'express';
import {
  getProductByIdData,
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

export const getProductById = async (
  req: Request,
  res: Response<ProductResponse>,
) => {
  const { id } = req.validated?.params as { id: string };
  const data = await getProductByIdData(id);

  res.status(200).json({
    message: 'Product fetched successfully',
    success: true,
    data,
  });
};
