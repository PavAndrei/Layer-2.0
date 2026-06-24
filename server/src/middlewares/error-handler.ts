import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api-error';
import type { ApiErrorResponse } from '../types/api';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ApiErrorResponse>,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
