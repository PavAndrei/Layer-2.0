import { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';

import { ApiError } from '../exceptions/api-error';
import type { ApiErrorResponse } from '../types/api';

const DUPLICATE_KEY_ERROR_CODE = 11000;

const getDuplicateKeyMessage = (err: MongoServerError): string => {
  const fieldNames = Object.keys(err.keyPattern ?? err.keyValue ?? {});

  if (fieldNames.includes('email')) {
    return 'User with this email already exists';
  }

  if (fieldNames.length > 0) {
    return `${fieldNames.join(', ')} already exists`;
  }

  return 'Duplicate value';
};

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

  if (
    err instanceof MongoServerError &&
    err.code === DUPLICATE_KEY_ERROR_CODE
  ) {
    return res.status(409).json({
      success: false,
      message: getDuplicateKeyMessage(err),
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
