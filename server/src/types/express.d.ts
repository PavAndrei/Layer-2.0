import type { AccessTokenPayload } from '../utils/auth-tokens';
import type { UserDocument } from '../models/users.model';

type ValidatedRequestData = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
      validated?: ValidatedRequestData;
      user?: AccessTokenPayload;
    }
  }
}

export {};
