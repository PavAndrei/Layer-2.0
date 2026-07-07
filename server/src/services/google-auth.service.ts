import { OAuth2Client } from 'google-auth-library';
import type { LoginTicket } from 'google-auth-library';

import {
  CLIENT_ORIGIN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '../constants/env';
import { ApiError } from '../exceptions/api-error';

export type GoogleAccountProfile = {
  avatarUrl?: string;
  email: string;
  emailVerified: boolean;
  googleId: string;
  name: string;
};

const googleOAuthClient = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CLIENT_ORIGIN,
);

export const verifyGoogleAuthorizationCode = async (
  code: string,
): Promise<GoogleAccountProfile> => {
  let ticket: LoginTicket;

  try {
    const { tokens } = await googleOAuthClient.getToken({
      code,
      redirect_uri: CLIENT_ORIGIN,
    });
    const idToken = tokens.id_token;

    if (!idToken) {
      throw ApiError.Unauthorized('Invalid Google authorization code');
    }

    ticket = await googleOAuthClient.verifyIdToken({
      audience: GOOGLE_CLIENT_ID,
      idToken,
    });
  } catch {
    throw ApiError.Unauthorized('Invalid Google authorization code');
  }

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || !payload.name) {
    throw ApiError.Unauthorized('Invalid Google authorization code');
  }

  if (!payload.email_verified) {
    throw ApiError.Unauthorized('Google account email is not verified');
  }

  return {
    avatarUrl: payload.picture,
    email: payload.email.toLowerCase(),
    emailVerified: payload.email_verified,
    googleId: payload.sub,
    name: payload.name,
  };
};
