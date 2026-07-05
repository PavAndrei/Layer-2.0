export const ACCOUNT_TOKEN_PURPOSES = [
  'email-verification',
  'password-reset',
] as const;

export type AccountTokenPurpose = (typeof ACCOUNT_TOKEN_PURPOSES)[number];
