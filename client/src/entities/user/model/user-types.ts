export type UserRole = 'customer' | 'admin';

export type User = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
};
