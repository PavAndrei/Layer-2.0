export type HeaderAuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'guest';

export type HeaderUser = {
  email: string;
  name: string;
};
