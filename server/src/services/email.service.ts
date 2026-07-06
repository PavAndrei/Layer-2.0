import {
  buildEmailVerificationMessage,
  buildPasswordResetMessage,
  type AccountEmailTemplateParams,
} from './email-templates.service';
import { emailTransport } from './email-transport.service';

export const sendEmailVerificationEmail = async ({
  email,
  name,
  token,
}: AccountEmailTemplateParams): Promise<void> => {
  const message = buildEmailVerificationMessage({
    email,
    name,
    token,
  });

  await emailTransport.send(message);
};

export const sendPasswordResetEmail = async ({
  email,
  name,
  token,
}: AccountEmailTemplateParams): Promise<void> => {
  const message = buildPasswordResetMessage({
    email,
    name,
    token,
  });

  await emailTransport.send(message);
};

export type { AccountEmailTemplateParams as AccountEmailParams };
