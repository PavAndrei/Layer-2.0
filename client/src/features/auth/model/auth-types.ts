export type UserRole = 'customer' | 'admin';

export type User = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
};

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

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'guest';
