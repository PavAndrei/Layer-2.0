import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import { checkoutData } from '../services/checkout.service';
import type { OrderResponse } from '../types/api';
import type { CheckoutBody } from '../validators/checkout.validators';

const getAuthenticatedUserId = (req: Request) => {
  if (!req.user || !req.currentUser) {
    throw ApiError.Unauthorized();
  }

  return req.user.userId;
};

export const checkout = async (
  req: Request,
  res: Response<OrderResponse>,
) => {
  const data = await checkoutData(
    getAuthenticatedUserId(req),
    req.body as CheckoutBody,
    {
      isEmailVerified: Boolean(req.currentUser?.isEmailVerified),
    },
  );

  res.status(201).json({
    success: true,
    message: 'Checkout completed successfully',
    data,
  });
};
