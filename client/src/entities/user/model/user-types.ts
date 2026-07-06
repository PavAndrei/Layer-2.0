export type UserAuthProvider = 'password' | 'google';
export type UserRole = 'customer' | 'admin';

export type User = {
  _id: string;
  authProviders: UserAuthProvider[];
  avatarUrl?: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
};
