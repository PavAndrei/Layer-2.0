import { Router } from 'express';

import {
  bootstrap,
  confirmEmailVerification,
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
  requestEmailVerification,
} from '../controllers/auth.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import {
  emailVerificationConfirmSchema,
  loginSchema,
  registerSchema,
} from '../validators/auth.validators';
import { catchErrors } from '../utils/catch-errors';

const authRoute = Router();

authRoute.post(
  '/register',
  validateRequest(registerSchema),
  catchErrors(register),
);
authRoute.post('/login', validateRequest(loginSchema), catchErrors(login));
authRoute.post('/bootstrap', catchErrors(bootstrap));
authRoute.post('/refresh', catchErrors(refresh));
authRoute.post('/logout', catchErrors(logout));
authRoute.post(
  '/email-verification/request',
  authMiddleware,
  catchErrors(requestEmailVerification),
);
authRoute.post(
  '/email-verification/confirm',
  validateRequest(emailVerificationConfirmSchema),
  catchErrors(confirmEmailVerification),
);
authRoute.get('/me', authMiddleware, catchErrors(getCurrentUser));

export default authRoute;
