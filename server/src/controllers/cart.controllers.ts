import type { Request, Response } from 'express';

import { validateCartData } from '../services/cart.service';
import type { CartValidationResponse } from '../types/api';
import type { ValidateCartBody } from '../validators/cart.validators';

export const validateCart = async (
  req: Request,
  res: Response<CartValidationResponse>,
) => {
  const data = await validateCartData(req.body as ValidateCartBody);

  res.status(200).json({
    success: true,
    message: 'Cart validated successfully',
    data,
  });
};
