import { Router } from 'express';

import {
  bootstrap,
  confirmEmailVerification,
  confirmPasswordReset,
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
  requestEmailVerification,
  requestPasswordReset,
} from '../controllers/auth.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rateLimit } from '../middlewares/rate-limit.middleware';
import { validateRequest } from '../middlewares/validate-request';
import {
  emailVerificationConfirmSchema,
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  registerSchema,
} from '../validators/auth.validators';
import { catchErrors } from '../utils/catch-errors';

const authRoute = Router();
const ACCOUNT_TOKEN_REQUEST_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const ACCOUNT_TOKEN_CONFIRM_RATE_LIMIT_WINDOW_MS = 60 * 1000;

const accountTokenRequestRateLimit = rateLimit({
  keyPrefix: 'account-token-request',
  maxRequests: 5,
  windowMs: ACCOUNT_TOKEN_REQUEST_RATE_LIMIT_WINDOW_MS,
});
const accountTokenConfirmRateLimit = rateLimit({
  keyPrefix: 'account-token-confirm',
  maxRequests: 20,
  windowMs: ACCOUNT_TOKEN_CONFIRM_RATE_LIMIT_WINDOW_MS,
});

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
  accountTokenRequestRateLimit,
  authMiddleware,
  catchErrors(requestEmailVerification),
);
authRoute.post(
  '/email-verification/confirm',
  accountTokenConfirmRateLimit,
  validateRequest(emailVerificationConfirmSchema),
  catchErrors(confirmEmailVerification),
);
authRoute.post(
  '/password-reset/request',
  accountTokenRequestRateLimit,
  validateRequest(passwordResetRequestSchema),
  catchErrors(requestPasswordReset),
);
authRoute.post(
  '/password-reset/confirm',
  accountTokenConfirmRateLimit,
  validateRequest(passwordResetConfirmSchema),
  catchErrors(confirmPasswordReset),
);
authRoute.get('/me', authMiddleware, catchErrors(getCurrentUser));

export default authRoute;
