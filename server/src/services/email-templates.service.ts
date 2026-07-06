import { CLIENT_ORIGIN } from '../constants/env';
import type { EmailMessage } from './email-transport.service';

export type AccountEmailTemplateParams = {
  email: string;
  name: string;
  token: string;
};

const buildClientUrl = (path: string, params: Record<string, string>) => {
  const url = new URL(path, CLIENT_ORIGIN);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
};

export const buildEmailVerificationMessage = ({
  email,
  name,
  token,
}: AccountEmailTemplateParams): EmailMessage => {
  const verificationUrl = buildClientUrl('/verify-email', {
    token,
  });

  return {
    to: email,
    subject: 'Verify your Layer account email',
    text: [
      `Hi ${name},`,
      '',
      'Use this link to verify your Layer account email:',
      verificationUrl,
      '',
      'If you did not request this email, you can ignore it.',
    ].join('\n'),
  };
};

export const buildPasswordResetMessage = ({
  email,
  name,
  token,
}: AccountEmailTemplateParams): EmailMessage => {
  const passwordResetUrl = buildClientUrl('/reset-password', {
    token,
  });

  return {
    to: email,
    subject: 'Reset your Layer account password',
    text: [
      `Hi ${name},`,
      '',
      'Use this link to reset your Layer account password:',
      passwordResetUrl,
      '',
      'If you did not request a password reset, you can ignore this email.',
    ].join('\n'),
  };
};
