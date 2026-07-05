import { CLIENT_ORIGIN } from '../constants/env';

type EmailMessage = {
  subject: string;
  text: string;
  to: string;
};

type AccountEmailParams = {
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

const sendEmail = async (message: EmailMessage): Promise<void> => {
  console.log('[email:dev] Outgoing email');
  console.log(`To: ${message.to}`);
  console.log(`Subject: ${message.subject}`);
  console.log(message.text);
};

export const sendEmailVerificationEmail = async ({
  email,
  name,
  token,
}: AccountEmailParams): Promise<void> => {
  const verificationUrl = buildClientUrl('/verify-email', {
    token,
  });

  await sendEmail({
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
  });
};

export const sendPasswordResetEmail = async ({
  email,
  name,
  token,
}: AccountEmailParams): Promise<void> => {
  const passwordResetUrl = buildClientUrl('/reset-password', {
    token,
  });

  await sendEmail({
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
  });
};
