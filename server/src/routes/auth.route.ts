import { Router } from 'express';

import {
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
} from '../controllers/auth.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { loginSchema, registerSchema } from '../validators/auth.validators';
import { catchErrors } from '../utils/catch-errors';

const authRoute = Router();

authRoute.post(
  '/register',
  validateRequest(registerSchema),
  catchErrors(register),
);
authRoute.post('/login', validateRequest(loginSchema), catchErrors(login));
authRoute.post('/refresh', catchErrors(refresh));
authRoute.post('/logout', catchErrors(logout));
authRoute.get('/me', authMiddleware, catchErrors(getCurrentUser));

export default authRoute;
