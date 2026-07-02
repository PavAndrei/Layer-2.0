import type { z } from 'zod';

import type { User } from '../../../entities/user';
import type { loginSchema, registerSchema } from './auth-validation';

export type AuthResponseData = {
  user: User;
  accessToken: string;
};

export type AuthBootstrapResponseData =
  | {
      isAuthenticated: true;
      user: User;
      accessToken: string;
    }
  | {
      isAuthenticated: false;
      user: null;
      accessToken: null;
    };

export type AuthBenefitsContent = {
  title: string;
  items: string[];
};

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type RegisterPayload = Omit<RegisterFormValues, 'confirmPassword'>;

export type LoginPayload = z.infer<typeof loginSchema>;

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'guest';
